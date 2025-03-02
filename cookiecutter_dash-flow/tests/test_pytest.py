# interacting with selenium

import dash
from dash import dcc, html
from dash.testing.application_runners import import_app
from selenium import webdriver

def test_one(dash_duo):
    app = dash.Dash(__name__)
    app.layout = html.Div(
        [
            html.Button("click me", id="my-button", n_clicks=0),
            html.Div(id="display-clicks"),
            html.H3("PALM BLOSUM")
        ]
    )

    dash_duo.start_server(app)
    assert dash_duo.find_element("h3").text == "PALM BLOSUM"

    return None