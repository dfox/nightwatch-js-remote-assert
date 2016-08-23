const express = require('express');
const serveStatic = require('serve-static');
const app = express();
const port = 8082;

app.use(serveStatic('example', {'index': ['index.html']}));
app.use('/scripts/jquery', serveStatic('node_modules/jquery/dist'));

const start = function start () {

  console.log(['Example app running on port:', port].join(' '));

};

app.listen(port, start);
