// src/lib/components/DevTools.js
import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'reactflow';

const localButtonStyle = {
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor:'#fff',
    width:"100%"
}

const localButtonDivStyle = {
    padding: '2px',
    margin: '2px',
}

/**
 * ddd
 */
const ViewportLogger = ({ viewport }) => (
    <div style={{
            padding: '8px',
            background: '#eee',
            borderRadius: '4px',
            margin: '4px' 
         }}>
        <strong>Viewport:</strong>
        <div>x: {viewport.x.toFixed(2)}</div>
        <div>y: {viewport.y.toFixed(2)}</div>
        <div>zoom: {viewport.zoom.toFixed(2)}</div>
    </div>
);

/**
 * ddd
 */
const NodeInspector = ({ nodes }) => (
    <div style={{
            padding: '8px',
            background: '#eee',
            borderRadius: '4px',
            margin: '4px' 
            }}>
        <strong>Nodes:</strong>
        {nodes.map((node) => (
            <div key={node.id}>
                ID: {node.id}, Type: {node.type || 'default'}
            </div>
        ))}
    </div>
);

/**
 * DevTools component for displaying debug information about the flow
 */
const DevTools = ({ viewport, nodes, onAddNode }) => {
    return (
        <Panel position="top-right" style={{
                maxHeight: '400px',
                overflow: 'auto', 
                backgroundColor: "#eee"
                }}>
            <ViewportLogger viewport={viewport} />
            <NodeInspector nodes={nodes} />
            <div style={localButtonDivStyle}>
                <button id="btn_add"
                    style={localButtonStyle}
                    onClick={(evt)=>{
                        console.log("adding a node...", evt);
                        onAddNode({
                            counter: nodes.length
                        });
                        }
                    }>Add a node</button>
            </div>
            <div style={localButtonDivStyle}>
                <button id="btn_delete"
                    style={localButtonStyle}
                    onClick={(evt)=>{
                        console.log("deleting selection...");
                        alert("no workie yet, use the button on a node");
                        }
                    }>Delete</button>
            </div>
            <div style={localButtonDivStyle}>
                <button id="btn_properties"
                    style={localButtonStyle}
                    onClick={(evt)=>{
                        console.log("properties...");
                        console.log("nodes:", nodes);
                        alert("no workie yet, here are nodes:", nodes);
                        }
                    }>Properties...</button>
            </div>
            <div style={localButtonDivStyle}>
                <button id="btn_export"
                    style={localButtonStyle}
                    onClick={(evt)=>{
                        console.log("export from DevTools...");
                        alert("no workie yet");
                        }
                    }>Export...</button>
            </div>
        </Panel>
    );
};

DevTools.propTypes = {
    /**
     * Current viewport information including position and zoom level
     */
    viewport: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        zoom: PropTypes.number.isRequired
    }).isRequired,

    /**
     * Array of nodes to display information about
     */
    nodes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string
    })).isRequired
};

DevTools.displayName = 'DevTools';

export default DevTools;