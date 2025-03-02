//// Updated, see https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
//
//import React from 'react';
//import ReactDOM from 'react-dom';
//ReactDOM.render(<App />, document.getElementById('root'));

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// container is our DomNode
//const container = document.getElementById('app');
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

// root.render(<App tab="home" />);
root.render(<App/>);
