# AUTO GENERATED FILE - DO NOT EDIT

export resizablenode

"""
    resizablenode(;kwargs...)

A ResizableNode component.
ddd
Keyword arguments:
- `data` (required): ddd. data has the following type: lists containing elements 'label'.
Those elements have the following types:
  - `label` (Bool | Real | String | Dict | Array; optional)
- `selected` (Bool; optional): ddd
"""
function resizablenode(; kwargs...)
        available_props = Symbol[:data, :selected]
        wild_props = Symbol[]
        return Component("resizablenode", "ResizableNode", "dash_flows", available_props, wild_props; kwargs...)
end

