// DashFlows.react.js
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    ReactFlow,
    Controls,
    MiniMap,
    Background,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    useViewport,
    //} from '@xyflow/react';
} from 'reactflow';

import 'reactflow/dist/style.css';
//import '@xyflow/react/dist/style.css';

import { FaPencilAlt } from 'react-icons/fa';
import CreatableSelect from 'react-select/creatable';
import ELK from 'elkjs/lib/elk.bundled.js';

import ResizableNode from './ResizableNode.js';
import AnimatedCircleNode from './AnimatedCircleNode.js';
import DevTools from './DevTools.jsx';
import AnimatedNodeEdge from './AnimatedNodeEdge.js';
import BananaNode from './BananaNode.react.jsx';

import {getJsonFromString, getStringFromJson} from '../utils/marshaling.js';

// Initialize ELK
const elk = new ELK();

// Node types definition
const nodeTypes = {
    //resizable: ResizableNode,
    //circle: AnimatedCircleNode,
    banana: BananaNode,
};

// Edge types definition
const edgeTypes = {
    //animated: AnimatedNodeEdge,
};

// Process Dash components
const processDashComponents = (nodes) => {
    if (!nodes) return [];

    const processComponent = (component) => {
        if (!component || typeof component === 'string') {
            console.log('DEBUG: regular string: ', component);
            return component;
        }

        // If it's a Dash component with _dashprivate_layout
        if (component.props && component.props._dashprivate_layout) {
            console.log('DEBUG: component with props and dashprivate_layout: ', component);

            const layout = component.props._dashprivate_layout;
            const processedChildren = Array.isArray(layout.props.children)
                ? layout.props.children.map(processComponent)
                : layout.props.children
                    ? processComponent(layout.props.children)
                    : null;

            return {
                props: {
                    _dashprivate_layout: {
                        ...layout,
                        props: {
                            ...layout.props,
                            children: processedChildren
                        }
                    }
                }
            };
        }

        // If it's a regular React component
        if (component.type && component.props) {
            console.log('regular react node', component);
            const processedChildren = Array.isArray(component.props.children)
                ? component.props.children.map(processComponent)
                : component.props.children
                    ? processComponent(component.props.children) : null;

            return {
                type: component.type,
                props: {
                    ...component.props,
                    children: processedChildren
                }
            };
        }

        return component;
    };

    return nodes.map(node => {
        if (!node.data.label || typeof node.data.label === 'string') {
            return node;
        }

        return {
            ...node,
            data: {
                ...node.data,
                label: processComponent(node.data.label)
            }
        };
    });
};

/**
 * ddd
 */
const FlowWithProvider = (props) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(props.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);
    const { setViewport } = useViewport();

    const applyLayout = async (options) => {
        if (!options) return;

        console.log('Applying layout:', nodes, edges);

        try {
            const layoutOptions = JSON.parse(options);
            const graph = {
                id: 'root',
                layoutOptions: layoutOptions,
                children: nodes?nodes.map(node => {
                    // Special handling for circle nodes and animated nodes
                    const isCircleNode = node.type === 'circle' || edges.some(edge =>
                        edge.type === 'animated' && edge.data?.animatedNode === node.id
                    );

                    if (isCircleNode) {
                        return {
                            id: node.id,
                            width: 60,
                            height: 60,
                            ...node,
                        };
                    }

                    return {
                        id: node.id,
                        width: node.style?.width || 150,
                        height: node.style?.height || 50,
                        ...node
                    };
                }):[],
                edges: edges?edges.map(edge => ({
                    id: edge.id,
                    sources: [edge.source],
                    targets: [edge.target],
                    ...edge
                })):[]
            };

            const layout = await elk.layout(graph);

            const layoutedNodes = layout.children.map((node) => {
                // Get the original node to preserve special properties
                const originalNode = nodes.find(n => n.id === node.id);

                return {
                    ...originalNode,
                    ...node,
                    position: { x: node.x, y: node.y },
                    style: originalNode.style,
                };
            });

            setNodes(layoutedNodes);
            // Maybe set the wholeGraph
            //props.setProps({
            //    nodes: layoutedNodes
            //});
        } catch (error) {
            console.error('Layout error:', error);
        }
    };

    useEffect(() => {
        if (props.layoutOptions) {
            console.log('props.layoutOptions changed:', props.layoutOptions);
            applyLayout(props.layoutOptions);
        }
    }, [props.layoutOptions]);

    useEffect(() => {
        if (props.nodes !== nodes) {
            //console.log('new nodes:', nodes);
            props.setProps({
                nodes,
                //wholeGraph: JSON.stringify({ nodes, edges })
            });
        }
    }, [nodes]);

    useEffect(() => {
        if (props.edges !== edges) {
            //console.log('new edges:', edges);
            props.setProps({
                edges,
                //wholeGraph: JSON.stringify({ nodes, edges })
            });
        }
    }, [edges]);

    const onChange = (newValue, actionMeta, node_id) => {

        let field;
        let value;
        if (actionMeta == undefined) {
            field = newValue.target.name;
            value = newValue.target.value;
        } else {
            field = actionMeta.name;
            value = Array.isArray(newValue) 
                ? newValue.map((item) => item.value) 
                : newValue;
        }

        console.log(`onChange with ${newValue}, ${actionMeta}, ${node_id}`);
        console.log(`that is, onChange with ${field} -> ${value}`);

        setNodes((nds) => {
            nds.map((node) => {
                if (node.id == node_id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            [field]: value
                        }
                    };
                } else {
                    return node;
                }
            })
        });
    };

    const onDelete = (node_id) => {
        setNodes((nds) => nds.filter((node) => node.id != node_id));
        setEdges((eds) => eds.filter((edge) => edge.source != node_id && edge.target != node_id));
        setNodes((nds) =>
            nds.map((node) => {
                return {
                    ...node,
                    depends_on: (node.depends_on || []).filter((dep) => dep != node_id)
                };
            }
            ));
    };

    const updatedDependsOnOptions = (nds) => nds.map((node) => {
        return {
            value: node.id,
            label: node.data.label
        };
    });

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        onChange: onChange,
                        onDelete: onDelete,
                        dependsOnOptions: updatedDependsOnOptions(nds)
                    }
                };
            }));
    }, [setNodes]); // nodes too?

    const onConnect = useCallback(
        (params) => {
            const newEdge = {
                ...params,
                id: `e${params.source}-${params.target}`
            };
            newEdges = [...edges, newEdge];
            newNodes = nodes.map((node) => {
                if (node.id === params.target) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            depends_on: [
                                ...(node.data.depends_on || []),
                                params.source,
                            ]
                        }
                    };
                }
                return node;
            });
            setEdges(newEdges);
            setNodes(newNodes);
            //props.setProps({
            //    //nodes,
            //    //edges: [...edges, newEdge],
            //    wholeGraph: JSON.stringify({ newNodes, newEdges }),
            //});
        }, [setEdges, setNodes]); // (?) nodes and edges too? We json.stringify them.


    const generateNewNode = (params) => {
        const newid = `n${params.counter++}`;
        return {
            id: newid,
            type: 'banana',
            position: {
                x: 25 * params.counter,
                y: 25 * params.counter
            },
            data: {
                label: `something ${newid}`,
                depends_on: [],
                metric: `${25 * params.counter} m`,
                node_id: newid,
                onChange: onChange,
                onDelete: onDelete,
                dependsOnOptions: updatedDependsOnOptions(nodes)
            }
        };
    };

    const onAddNode = useCallback(
        (params) => {
            console.log("adding a node: ", params);
            const newNode = generateNewNode(params);
            setNodes((nds) => [...nds, newNode]);

            /*
            props.setProps({
                nodes: [...nodes, newNode],
                edges: edges,
                wholeGraph: JSON.stringify(
                    {
                        nodes: [...nodes, newNode],
                        edges: edges
                    }
            )
            });
            */
        },
        [setNodes]
    );

    const onRemoveNode = useCallback(
        (params) => {
            const nodeId = params.node.id;
            setNodes((nds) => nds.filter((node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));

            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === nodeId) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                depends_on: depends_on.filter((dep) => dep !== nodeId)
                            }
                        };
                    }
                    return node;
                }));

            /*
            props.setProps({
                nodes: nodes.filter((node) => node.id !== nodeId),
                edges: edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
                wholeGraph: JSON.stringify({ nodes, edges })
            });
            */
        },
        [setNodes, setEdges]
    );

    const onRemoveEdge = useCallback(
        (params) => {
            const edgeId = params.edge.id;
            setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));

            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === params.edge.target) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                depends_on: depends_on.filter(
                                    (dep) => dep !== params.edge.source)
                            }
                        };
                    }
                    return node;
                }));

            /*
            props.setProps({
                nodes: nodes,
                edges: edges.filter((edge) => edge.id !== edgeId),
                wholeGraph: JSON.stringify({ nodes, edges })
            });
            */
        },
        [setNodes, setEdges]
    );

    const processedNodes = useMemo(() => processDashComponents(nodes), [nodes]);

    return (
        <div style={{ width: '100%', height: '600px', ...props.style }}>
            <ReactFlowProvider>
            <ReactFlow
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodes={processedNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodesDraggable={props.nodesDraggable}
                nodesConnectable={props.nodesConnectable}
                elementsSelectable={props.elementsSelectable}
                fitView
            >
                {props.showControls && <Controls />}
                {props.showMiniMap && <MiniMap />}
                {props.showBackground && <Background />}
                {props.showDevTools && <DevTools
                    viewport={useViewport()}
                    nodes={processedNodes}
                    onAddNode={onAddNode}
                />}
            </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};

/**
 * ddd
 */
const DashFlows = (props) => {

    const getGraphJson = () => {
        try {
            const res = getJsonFromString(props.wholeGraph);

            if (res.nodes == undefined) {
                console.log("unexpected res.nodes == undefined");
            }

            if (res.edges == undefined) {
                console.log("unexpected res.edges == undefined");
            }
            return res;
        } catch (error) {
            console.log('failed to parse graph json:', error);
            return [];
        }
    }

    const parseGraphAndGetNodes = () => {
        try {
            console.log("parseGraphAndGetNodes()...");
            return getGraphJson().nodes.filter(
                (n) => n.type && n.type == "banana").map(
                    (node) =>
                    ({
                        id: node.id,
                        type: node.type,
                        position: node.position,
                        data: {
                            label: node.data.label,
                            metric: node.data.metric,
                            depends_on: node.data.depends_on || [],
                            node_id: node.id // otherwise it is not clear how the node class knows what it is
                        },
                    })
                );
        } catch (error) {
            console.log('failed to parse graph and get the nodes:', error);
            return [];
        }
    };

    const parseGraphAndGetEdges = () => {
        try {
            console.log("parseGraphAndGetEdges()...");
            return getGraphJson().edges.map((edge) =>
            ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
            })
            );
        } catch (error) {
            console.log('failed to parse graph and get the edges:', error);
            return [];
        }
    };

    const effective_nodes= parseGraphAndGetNodes();
    const effective_edges= parseGraphAndGetEdges();

    console.log("effective_nodes: ", effective_nodes);
    console.log("effective_edges: ", effective_edges);

    return (
        <div id={props.id}>
            // <ReactFlowProvider>
                <FlowWithProvider 
                    {...props}
                    nodes={effective_nodes}
                    edges={effective_edges}
                />
            // </ReactFlowProvider>
        </div>
    );
};

DashFlows.defaultProps = {
    nodesDraggable: true,
    nodesConnectable: true,
    elementsSelectable: true,
    showMiniMap: true,
    showControls: true,
    showBackground: true,
    wholeGraph: "",
    //nodes: [],
    //edges: [],
    style: {},
    className: '',
    showDevTools: false,
    layoutOptions: null,
};

DashFlows.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * Enable/disable node dragging behavior
     */
    nodesDraggable: PropTypes.bool,

    /**
     * Enable/disable the ability to make new connections between nodes
     */
    nodesConnectable: PropTypes.bool,

    /**
     * Enable/disable the ability to select elements
     */
    elementsSelectable: PropTypes.bool,

    /**
     * Show/hide the minimap navigation component
     */
    showMiniMap: PropTypes.bool,

    /**
     * Show/hide the control panel
     */
    showControls: PropTypes.bool,

    /**
     * Show/hide the background pattern
     */
    showBackground: PropTypes.bool,

    /**
     * wakawaka
     */
    wholeGraph: PropTypes.string,

    /**
     * Array of nodes to display in the flow
     * /
    nodes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string,
        data: PropTypes.object.isRequired,
        position: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
        }).isRequired,
        style: PropTypes.object
    })),
    

    /**
     * Array of edges defining connections between nodes
     * /
    edges: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        source: PropTypes.string.isRequired,
        target: PropTypes.string.isRequired,
        type: PropTypes.string,
        data: PropTypes.object,
        style: PropTypes.object
    })),

     /**
     * Custom CSS styles for the container div
     */
    style: PropTypes.object,

    /**
     * CSS class name for the container div
     */
    className: PropTypes.string,

    /**
     * Show/hide the developer tools panel
     */
    showDevTools: PropTypes.bool,

    /**
     * Layout options for arranging nodes using the ELK layout engine
     */
    layoutOptions: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     */
    setProps: PropTypes.func
};

DashFlows.displayName = 'DashFlows';

export default DashFlows;