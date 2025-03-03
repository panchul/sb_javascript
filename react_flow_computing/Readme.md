
The initial sandbos was from the React Flow tutorial https://reactflow.dev/learn/advanced-use/computing-flows

Here's a quick starti path:

```bash
$ npm install
```

```bash
$ npm run build


> react_flow_computing@1.0.0 build
> react-scripts build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  112.18 kB  build/static/js/main.3bfe7b98.js
  2.86 kB    build/static/css/main.85c35ed7.css

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  https://cra.link/deployment

```

```bash
$ npm install -g serve

added 88 packages in 2s

24 packages are looking for funding
  run `npm fund` for details
```


```bash
$ serve -s build      

   ┌──────────────────────────────────────────┐
   │                                          │
   │   Serving!                               │
   │                                          │
   │   - Local:    http://localhost:3000      │
   │   - Network:  http://192.168.1.11:3000   │
   │                                          │
   │   Copied local address to clipboard!     │
   │                                          │
   └──────────────────────────────────────────┘

 HTTP  3/2/2025 7:04:08 PM ::1 GET /
 HTTP  3/2/2025 7:04:08 PM ::1 Returned 200 in 9 ms
 HTTP  3/2/2025 7:04:08 PM ::1 GET /static/js/main.3bfe7b98.js
 HTTP  3/2/2025 7:04:08 PM ::1 GET /static/css/main.85c35ed7.css
 HTTP  3/2/2025 7:04:08 PM ::1 GET /index.jsx
 HTTP  3/2/2025 7:04:08 PM ::1 Returned 200 in 1 ms
 HTTP  3/2/2025 7:04:08 PM ::1 Returned 200 in 3 ms
 HTTP  3/2/2025 7:04:08 PM ::1 Returned 200 in 4 ms
 HTTP  3/2/2025 7:04:08 PM ::1 GET /favicon.ico
 HTTP  3/2/2025 7:04:08 PM ::1 Returned 200 in 1 ms
```
