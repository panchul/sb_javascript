# AUTO GENERATED FILE - DO NOT EDIT

export banananode

"""
    banananode(;kwargs...)

A BananaNode component.
ddd
Keyword arguments:
- `id` (String; optional): ddd
- `data` (optional): ddd. data has the following type: lists containing elements 'label', 'metric', 'depends_on', 'node_id', 'onChange', 'onDelete', 'updateNodeData', 'dependsOnOptions'.
Those elements have the following types:
  - `label` (Bool | Real | String | Dict | Array; optional)
  - `metric` (String; optional)
  - `depends_on` (Array; optional)
  - `node_id` (String; optional)
  - `onChange` (optional)
  - `onDelete` (optional)
  - `updateNodeData` (required)
  - `dependsOnOptions` (Array; optional)
- `selected` (Bool; optional): ddd
"""
function banananode(; kwargs...)
        available_props = Symbol[:id, :data, :selected]
        wild_props = Symbol[]
        return Component("banananode", "BananaNode", "dash_flows", available_props, wild_props; kwargs...)
end

