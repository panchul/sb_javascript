// BananaNode.js
import React, { memo, useMemo, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Handle,
    Position,
    NodeResizer,
    useReactFlow,
    ReactFlowProvider } from 'reactflow';
import CreatableSelect from 'react-select/creatable';
import { FaPencilAlt } from 'react-icons/fa';
import { set } from 'ramda';


/**
 * ddd
 */
//const BananaNode = memo(({ id, initial_data, selected }) => {
//const BananaNode = ({ id, initial_data }) => {
function BananaNode({ id, data }) {

    const { updateNodeData } = useReactFlow();
    const [data_local, setData] = useState(data);

    const selected = false;

    
    const renderDashComponent = (component) => {
        if (!component) return null;
        if (typeof component === 'string') return component;
        if (React.isValidElement(component)) return component;

        // Handle Dash components
        if (component.props?._dashprivate_layout) {
            const layout = component.props._dashprivate_layout;

            // Get the component class from the namespace
            const namespace = window[layout.namespace];
            if (!namespace || !namespace[layout.type]) {
                console.error('Could not find component:', layout.type, 'in namespace:', layout.namespace);
                return null;
            }

            const ComponentClass = namespace[layout.type];

            // Process children recursively if they exist
            const processChildren = (children) => {
                if (!children) return null;
                if (Array.isArray(children)) {
                    return children.map((child, index) => {
                        const processed = renderDashComponent(child);
                        return processed ? React.cloneElement(processed, { key: index }) : null;
                    });
                }
                return renderDashComponent(children);
            };

            // Process props to ensure they're in the right format for React
            const processProps = (rawProps) => {
                const { children, ...otherProps } = rawProps;

                // Convert any prop keys from camelCase to lowercase for HTML elements
                const processedProps = {};
                Object.entries(otherProps).forEach(([key, value]) => {
                    if (key === 'style') {
                        processedProps.style = {
                            width: '100%',
                            height: '100%',
                            ...(value || {})
                        };
                    } else if (key === '_dashprivate_layout') {
                        // Skip internal Dash props
                        return;
                    } else {
                        processedProps[key] = value;
                    }
                });

                return processedProps;
            };

            // Process children and create the element
            const children = processChildren(layout.props.children);
            const props = processProps(layout.props);

            try {
                return React.createElement(ComponentClass, props, children);
            } catch (error) {
                console.error('Error creating element:', error);
                return null;
            }
        }

        // Handle HTML elements
        if (typeof component.type === 'string') {
            const processedChildren = component.props?.children ?
                (Array.isArray(component.props.children) ?
                    component.props.children.map((child, index) => React.cloneElement(renderDashComponent(child), { key: index })) :
                    renderDashComponent(component.props.children)
                ) : null;

            return React.createElement(
                component.type.toLowerCase(),
                {
                    ...component.props,
                    style: { ...component.props.style }
                },
                processedChildren
            );
        }

        console.warn('Could not process component:', component);
        return null;
    };
    

    const onChange = useCallback((evt) => {
        setData((data) => ({
            ...data,
            metric: evt.target.value
        }));
        updateNodeData(id, { metric: evt.target.value });
    }, []);

    //console.log("the options now:",
    //    data.dependsOnOptions ? data.dependsOnOptions.filter(
    //        (option) => option.value != data.node_id)
    //        : []);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            //position: 'relative',
            background: '#eee',
            // overflow: 'hidden'
        }}>
            <NodeResizer
                isVisible={selected}
                minWidth={120}
                minHeight={80}
                // handleStyle={{ width: 8, height: 8 }}
                //lineStyle={{ borderWidth: 1 }}
            />
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: '#555' }}
                // handleStyle={{ width: 8, height: 8, background: 'blue' }} // backgroundColor (?)
                //lineStyle={{ borderWidth: 1, borderColor: `blue` }}
                isConnectable={true}
                onConnect={(params)=>{
                    console.log("got onConnect from target:", params);
                }}
            />
            <div // className="nodrag"
                    >
                    <div style={{ display: 'flex', algnItems: 'center', justifyContent: 'space-between' }}>
                        <i>add pic here</i>
                        <div style={{ display: 'flex', algnItems: 'center', justifyContent: 'flex-end' }}>
                            <button onClick={() => {
                                console.log("node's button props");
                                console.log("data: ", data_local);

                                alert("no workie yet. here's the data:", data_local );


                            }}>...</button>
                            <button onClick={() => {
                                console.log("node's button delete");
                                data_local.onDelete(data_local.node_id);
                            }}>X</button>
                        </div>
                    </div>
                    <div>
                        <b>{data_local.label && renderDashComponent(data_local.label)}</b>
                    </div>
                    <div>
                        <input
                            name="some_input"
                            style={{ background: '#555' }}
                            onChange={(newValue,actionMeta)=>
                                {
                                    console.log("onchange for some_input");
                                }
                            }
                            defaultValue={"something"}
                            />
                    </div>
                    <div>
                        <input
                            name="metric"
                            style={{ background: '#555' }}
                            value={data_local.metric}
                            onChange= {onChange}
                            /*{(newValue,actionMeta)=>{
                                    console.log("onChange of the metric field for data.node_id ", data.node_id);
                                    data.onChange(newValue, actionMeta, data.node_id);
                                }
                            }
                            */
                            />
                    </div>
                    <div>
                        <label>Some select</label>
                        <CreatableSelect
                            name="some_select"
                            value="something"
                            options={[{value:"something",label:"some label"},{value:"something2",label:"some label2"}]}
                            onChange={
                                (newValue, actionMeta) =>{
                                    console.log("got for some_select:", newValue, actionMeta);
                                }
                            }
                            isClearable
                        />
                    </div>
                    <div>
                        <label>Depends on</label>
                        <CreatableSelect
                            name="depends_on"
                            isMulti
                            value={
                                (
                                    data_local.dependsOnOptions ? data_local.dependsOnOptions.filter(
                                        (option) => data_local.depends_on.includes(option.value)
                                    )
                                        : []
                                )
                            }
                            options={
                                (
                                    data_local.dependsOnOptions ? data_local.dependsOnOptions.filter(
                                        (option) => option.value != data_local.node_id)
                                        : []
                                )
                            }
                            onChange={
                                (newValue, actionMeta) =>
                                    data_local.onChange(newValue, actionMeta, data_local.node_id)
                            }
                            isClearable
                        />
                    </div>
            </div>

            <Handle
                id="a"
                type="source"
                position={Position.Bottom}
                style={{ background: '#555' }}
                onConnect={(params)=>{
                    console.log("got onConnect from source a:", params);
                }}
            />
            <Handle
                id="b"
                type="source"
                position={Position.Bottom}
                style={{ background: '#555' }}
                onConnect={(params)=>{
                    console.log("got onConnect from source b:", params);
                }}
            />
        </div>
    );
}
//});

BananaNode.displayName = 'BananaNode';

BananaNode.propTypes = {
    /**
     * ddd
     * */
    id: PropTypes.string,

    /**
    * ddd
    */
    data: PropTypes.shape({
        label: PropTypes.any,
        depends_on: PropTypes.array, // we also have the dependsOnOptions (?)
        node_id: PropTypes.string,
        onChange: PropTypes.func,
        onDelete: PropTypes.func,
        dependsOnOptions: PropTypes.any
    }).isRequired,

    /**
    * ddd
    */
    selected: PropTypes.bool
};

BananaNode.defaultProps = {
    id: 'undef',
    selected: false,
    data: {
        label: "undef",
        depends_on: [],
        node_id: "undef"
    }
};

export default BananaNode