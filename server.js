const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;


//app as a request handler
const server = http.createServer(app);

server.listen(port);
