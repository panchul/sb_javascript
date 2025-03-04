# AUTO GENERATED FILE - DO NOT EDIT

export dashflows

"""
    dashflows(;kwargs...)

A DashFlows component.
ddd
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `className` (String; optional): CSS class name for the container div
- `elementsSelectable` (Bool; optional): Enable/disable the ability to select elements
- `layoutOptions` (String; optional): Layout options for arranging nodes using the ELK layout engine
- `nodesConnectable` (Bool; optional): Enable/disable the ability to make new connections between nodes
- `nodesDraggable` (Bool; optional): Enable/disable node dragging behavior
- `showBackground` (Bool; optional): Show/hide the background pattern
- `showControls` (Bool; optional): Show/hide the control panel
- `showDevTools` (Bool; optional): Show/hide the developer tools panel
- `showMiniMap` (Bool; optional): Show/hide the minimap navigation component
- `style` (Dict; optional): Array of nodes to display in the flow
/
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
Array of edges defining connections between nodes
/
    edges: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        source: PropTypes.string.isRequired,
        target: PropTypes.string.isRequired,
        type: PropTypes.string,
        data: PropTypes.object,
        style: PropTypes.object
    })),

     /**
Custom CSS styles for the container div
- `wholeGraph` (String; optional): wakawaka
"""
function dashflows(; kwargs...)
        available_props = Symbol[:id, :className, :elementsSelectable, :layoutOptions, :nodesConnectable, :nodesDraggable, :showBackground, :showControls, :showDevTools, :showMiniMap, :style, :wholeGraph]
        wild_props = Symbol[]
        return Component("dashflows", "DashFlows", "dash_flows", available_props, wild_props; kwargs...)
end

