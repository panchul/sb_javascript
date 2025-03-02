// ResizableNode.js
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Handle, Position, NodeResizer } from 'reactflow';

/**
 * ddd
 */
const ResizableNode = memo(({ data, selected }) => {
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

    return (
        <div className="resizable-node" style={{
            width: '100%',
            height: '100%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            position: 'relative',
            background: '#fff',
            overflow: 'hidden'
        }}>
            <NodeResizer
                isVisible={selected}
                minWidth={100}
                minHeight={50}
                // handleStyle={{ width: 8, height: 8 }}
                //lineStyle={{ borderWidth: 1 }}
            />
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: '#555' }}
            />
            <div style={{
                padding: 10,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                {data.label && renderDashComponent(data.label)}
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: '#555' }}
            />
        </div>
    );
});

ResizableNode.displayName = 'ResizableNode';

ResizableNode.propTypes = {
    /**
    * ddd
    */
    data: PropTypes.shape({
        label: PropTypes.any
    }).isRequired,

    /**
    * ddd
     */
    selected: PropTypes.bool
};

ResizableNode.defaultProps = {
    selected: false
};

export default ResizableNode