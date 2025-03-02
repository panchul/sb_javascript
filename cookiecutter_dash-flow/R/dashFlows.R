# AUTO GENERATED FILE - DO NOT EDIT

#' @export
dashFlows <- function(id=NULL, className=NULL, elementsSelectable=NULL, layoutOptions=NULL, nodesConnectable=NULL, nodesDraggable=NULL, showBackground=NULL, showControls=NULL, showDevTools=NULL, showMiniMap=NULL, style=NULL, wholeGraph=NULL) {
    
    props <- list(id=id, className=className, elementsSelectable=elementsSelectable, layoutOptions=layoutOptions, nodesConnectable=nodesConnectable, nodesDraggable=nodesDraggable, showBackground=showBackground, showControls=showControls, showDevTools=showDevTools, showMiniMap=showMiniMap, style=style, wholeGraph=wholeGraph)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DashFlows',
        namespace = 'dash_flows',
        propNames = c('id', 'className', 'elementsSelectable', 'layoutOptions', 'nodesConnectable', 'nodesDraggable', 'showBackground', 'showControls', 'showDevTools', 'showMiniMap', 'style', 'wholeGraph'),
        package = 'dashFlows'
        )

    structure(component, class = c('dash_component', 'list'))
}
