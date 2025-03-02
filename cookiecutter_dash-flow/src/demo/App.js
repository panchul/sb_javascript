/* eslint no-magic-numbers: 0 */
import React, { useState, Component } from 'react';
//import React from 'react-dom/client';
import { DashFlows } from '../lib';

const initialWholeGraphData={
    nodes : [
    {
        id: "1",
        type: "banana",
        data: {
            label: "something"
        },
        position: { x: 250, y: 25 },
        style: {
            width: 300,
            height: 200,
        }
    },
    {
        id: "2",
        type: "banana",
        data: {
            label: "something else"
        },
        position: { x: 270, y: 45 },
        style: {
            width: 300,
            height: 200,
        }
    }
    ],
    edges : [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'animated',
        data: {
            animatedNode: 'animated1'  // Reference the dedicated animated node
        },
        style: {
            strokeWidth: 2,
            stroke: '#555'
        }
    },
]};

class App extends Component {
    constructor() {
        super();
        this.state = {
            id: "dash-flows-example",
            wholeGraph: JSON.stringify(initialWholeGraphData),
            layoutOptions: null,
            style: { height: "600px" },
            showDevTools: true,
        };
        this.setProps = this.setProps.bind(this);
    }

    setProps = (newProps) => {
        this.setState(newProps);
    };

    //const[state, setState] = useState({
    //    value:'',
    //    label:'Type Here',
    //    nodes: initial_nodes,
    //});

    render = () => {
        return (
            <div>
                <DashFlows
                    setProps={this.setProps}
                    {...this.state}
                />
            </div >
        );
    }
};


export default App;
