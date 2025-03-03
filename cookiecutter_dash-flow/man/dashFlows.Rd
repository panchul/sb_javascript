% Auto-generated: do not edit by hand
\name{dashFlows}

\alias{dashFlows}

\title{DashFlows component}

\description{
ddd
}

\usage{
dashFlows(id=NULL, className=NULL, elementsSelectable=NULL,
layoutOptions=NULL, nodesConnectable=NULL,
nodesDraggable=NULL, showBackground=NULL, showControls=NULL,
showDevTools=NULL, showMiniMap=NULL, style=NULL,
wholeGraph=NULL)
}

\arguments{
\item{id}{Character. The ID used to identify this component in Dash callbacks.}

\item{className}{Character. CSS class name for the container div}

\item{elementsSelectable}{Logical. Enable/disable the ability to select elements}

\item{layoutOptions}{Character. Layout options for arranging nodes using the ELK layout engine}

\item{nodesConnectable}{Logical. Enable/disable the ability to make new connections between nodes}

\item{nodesDraggable}{Logical. Enable/disable node dragging behavior}

\item{showBackground}{Logical. Show/hide the background pattern}

\item{showControls}{Logical. Show/hide the control panel}

\item{showDevTools}{Logical. Show/hide the developer tools panel}

\item{showMiniMap}{Logical. Show/hide the minimap navigation component}

\item{style}{Named list. Array of nodes to display in the flow
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
Custom CSS styles for the container div}

\item{wholeGraph}{Character. wakawaka}
}

\value{named list of JSON elements corresponding to React.js properties and their values}

