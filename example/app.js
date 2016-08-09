const express = require('express');
const serveStatic = require('serve-static');
const cors = require('cors');
const app = express();
const port = 8082

app.use(serveStatic('public', {'index': ['index.html']}));
app.use('/scripts/jquery', serveStatic('node_modules/jquery/dist'));

app.listen(port, function () {
  console.log('Example app running on port: ' + port);
});
