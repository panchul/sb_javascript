import json
import base64

import dash
from dash import callback, html, Input, Output, State, clientside_callback, _dash_renderer, dcc
import dash_mantine_components as dmc

import dash_flows
import pandas as pd
import plotly.express as px

# temporary patch, some dmc things won't work otherwise
_dash_renderer._set_react_version("18.2.0")

"""
whole_graph = {
    "nodes": [
    {
        'id': '1',
        'type': 'resizable',
        'data': {
            'label': "something"
            #html.Div([
            #    html.Img(src="tbd",
            #             style={'width': '100%', 'height': '100%'}),
            #], style={
            #    'display': 'flex',
            #    'flexDirection': 'column',
            #    'alignItems': 'center',
            #    'gap': '10px',
            #    'padding': '10px'
            #})
        },
        'position': {'x': 250, 'y': 25},
        'style': {
            'width': 300,
            'height': 300,
        }
    },
    {
        'id': '2',
        'type': 'resizable',
        'data': {'label': "shit_on_a_stick"},
        'position': {'x': 250, 'y': 150},
        'style': {
            'width': 300,
            'height': 300,
        }
    },
    {
        'id': 'animated1',
        'type': 'circle',
        'data': {'label': 'round thingie'},
        'position': {'x': 250, 'y': 150},
        'style': {
            'width': 60,
            'height': 60,
        }
    },
    {
        'id': '3',
        'type': 'resizable',
        'data': {
            'label': "another one"
        },
        'position': {'x': 210, 'y': 210},
        'style': {
            'width': 300,
            'height': 300,
            'minHeight': 200
        }
    },
    {
        'id': '4',
        'type': 'banana',
        'data': {
            'label': 'banana4',
            'metric':  "20.0 m",
            'depends_on': []
             },
        'position': {'x': 250, 'y': 250},
        'style': {
            'width': 300,
            'height': 300,
            'minHeight': 200
        }
    },
    {
        'id': '5',
        'type': 'banana',
        'data': {
            'label': 'banana5',
            'metric': "10.0 m",
            'depends_on': ['4']
             },
        'position': {'x': 270, 'y': 270},
        'style': {
            'width': 300,
            'height': 300,
            'minHeight': 200
        }
    }
],
"edges" : [
    {
        'id': 'e1-2',
        'source': '1',
        'target': '2',
        'type': 'animated',
        'data': {
            'animatedNode': 'animated1'  # Reference the dedicated animated node
        },
        'style': {
            'strokeWidth': 2,
            'stroke': '#555'
        }
    },
    {
        'id': 'e2-3',
        'source': '2',
        'target': '3',
        'type': 'default',  # Changed to default type
        'style': {
            'strokeWidth': 2,
            'stroke': '#555'
        }
    }
]
}
"""

whole_graph = {
    "nodes": [
    {
        'id': '4',
        'type': 'banana',
        'data': {
            'label': 'banana4',
            'metric':  "20.0 m",
            'depends_on': []
             },
        'position': {'x': 250, 'y': 250},
        'style': {
            'width': 300,
            'height': 300,
            'minHeight': 200
        }
    },
    {
        'id': '5',
        'type': 'banana',
        'data': {
            'label': 'banana5',
            'metric': "10.0 m",
            'depends_on': ['4']
             },
        'position': {'x': 270, 'y': 270},
        'style': {
            'width': 300,
            'height': 300,
            'minHeight': 200
        }
    }
],
"edges" : []
}

#get_nodes_from_graph = lambda whole_graph : [
#    {
#        "id": node["id"],
#        #"type" : "BnanaNode" if node["type"] == "whatever_I_use_there" else node["type"],
#        "type" : node["type"],
#        "position": node["position"],
#        "data": {
#            "label": node["data"].get("label","something")
#        }        
#    } for node in whole_graph["nodes"]]
#
#get_edges_from_graph = lambda whole_graph : [
#    {
#        "id": edge["id"],
#        "source" : edge["source"],
#        "target" : edge["target"],
#    } for edge in whole_graph["edges"]]

app = dash.Dash(__name__, assets_folder='assets',
                 external_stylesheets=dmc.styles.ALL)

app.layout = dmc.MantineProvider(
    id="whole_thing",
    children=[
        dmc.JsonInput(
            id="wholegraph-json-input",
            label="Here's the initial input (json):",
            placeholder="Textarea will autosize to fit the content",
            validationError="Invalid JSON",
            # formatOnBlur=True,
            autosize=True,
            minRows=3,
            maxRows=4,
            w = 800,
            value = json.dumps(whole_graph)
        ),

        dcc.Upload(id="upload-data",
            children=html.Button("Upload",
                id="upload-button"),
            multiple=False),

        html.Button("Download",
                id="btn-download-txt"),

        dcc.Download(id="download-text"),

        dmc.Group([
            dmc.Button("Vertical Layout", id="btn-vertical", variant="outline"),
            dmc.Button("Horizontal Layout", id="btn-horizontal", variant="outline"),
            dmc.Button("Radial Layout", id="btn-radial", variant="outline"),
            dmc.Button("Force Layout", id="btn-force", variant="outline"),
        ], mt="md", mb="md"),

        dash_flows.DashFlows(
            id="react-flow-example",
            wholeGraph=json.dumps(whole_graph),
            #nodes=get_nodes_from_graph(whole_graph),
            #edges=get_edges_from_graph(whole_graph),
            showDevTools=True,
            style={"height": "400px"},
            #layoutOptions=None  # Add this prop
        ),
        # Hidden div for storing layout options
        html.Div(id="layout-options", style={"display": "none"}),
        dcc.Dropdown(["metric"],
                     "metric",
                     id="dropdown-selection"),
        dcc.Graph(id="graph-content",
                  style={"height": "400px"},)
    ]
)

# Create a clientside callback to handle layout changes
app.clientside_callback(
    """
    function(n_vertical, n_horizontal, n_radial, n_force) {
        const triggered = dash_clientside.callback_context.triggered[0];
        if (!triggered) return window.dash_clientside.no_update;

        const btnId = triggered.prop_id.split('.')[0];
        let options = {};

        switch(btnId) {
            case 'btn-vertical':
                options = {
                    'elk.algorithm': 'layered',
                    'elk.direction': 'DOWN',
                    'elk.spacing.nodeNode': 80,
                    'elk.layered.spacing.nodeNodeBetweenLayers': 100
                };
                break;
            case 'btn-horizontal':
                options = {
                    'elk.algorithm': 'layered',
                    'elk.direction': 'RIGHT',
                    'elk.spacing.nodeNode': 80,
                    'elk.layered.spacing.nodeNodeBetweenLayers': 100
                };
                break;
            case 'btn-radial':
                options = {
                    'elk.algorithm': 'org.eclipse.elk.radial',
                    'elk.radial.radius': 200
                };
                break;
            case 'btn-force':
                options = {
                    'elk.algorithm': 'org.eclipse.elk.force',
                    'elk.force.iterations': 300,
                    'elk.spacing.nodeNode': 80
                };
                break;
            default:
                return window.dash_clientside.no_update;
        }
        return JSON.stringify(options);
    }
    """,
    Output("react-flow-example", "layoutOptions"),  # Change output target to DashFlows's layoutOptions
    Input("btn-vertical", "n_clicks"),
    Input("btn-horizontal", "n_clicks"),
    Input("btn-radial", "n_clicks"),
    Input("btn-force", "n_clicks"),
    prevent_initial_call=True
)

@callback(Output('react-flow-example','wholeGraph'),
          Input("wholegraph-json-input", "value"),
          )
def display_output(value):
    return value


@callback(Output('download-text','data'),
        Input('btn-download-txt',"n_clicks"),
        State("wholegraph-json-input", "value"),
        prevent_initial_call=True,
)
def func(n_clicks, value):
    return dict(content=value, filename="aaa.json")


def parse_contents(contents, filename):
    content_type, content_string = contents.split(',')
    decoded = base64.b64decode(content_string)
    try:
        if 'json' in filename:
            newgraph = decoded.decode('utf-8')
            return newgraph
        else:
            return "not supporting that yet"
    except Exception as e:
        print(e)
        return "there was an error: " + str(e)

@callback(Output("wholegraph-json-input", "value"),
          Input("upload-data", "contents"),
          State('upload-data', 'filename'),
          State('upload-data', 'last_modified'),
          prevent_initial_call=True
          )
def update_output(content, filename, date):
    print(f"uploading file {filename}")
    if content is not None:
        return parse_contents(content, filename)
    else:
        return "no file uploaded"


@callback(
    Output("graph-content", "figure"),
    Input("dropdown-selection", "value"),
    Input("react-flow-example", "wholeGraph"),
)
def update_graph_char(value, wholeGraph):

    print(f"wholeGraph: {wholeGraph}")
    wholeGraph_dict = json.loads(wholeGraph)

    print(f"wholeGraph_dict: {wholeGraph_dict}")

    nodeids = []
    values=[]

    for node in wholeGraph_dict["nodes"]:
        if value in node["data"]:
            nodeids.append(node["id"])
            values.append(float(node["data"][value].split()[0]))

    print(f"nodeids: {nodeids}")
    print(f"values: {values}")

    node_df = pd.DataFrame({"node id": nodeids, value: values})

    fig = px.bar(
        node_df, x="node id", y=value, title=f"node Id vs {value}", text_auto=True
    )

    return fig

@callback(Output("wholegraph-json-input", "value", allow_duplicate=True),
        Input("react-flow-example", "wholeGraph"),
        prevent_initial_call=True, # maybe false?
)
def updateJsonInput(value):
    return value


if __name__ == '__main__':
    app.run_server(debug=True, port=8080)
    # app.run_server(debug=False, port=8080)