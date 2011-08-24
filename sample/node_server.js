var util = require('util'),
    URL = require('url'),
    http = require('http'),
    httpStatic = require('node-static'),
    staticServer = new httpStatic.Server('');


function handle(req, res) {
  var url = URL.parse(req.url),
      path = url.pathname;

  if ( /^\/static/.test(path) || /\.html$/.test(path) ) {
    serveStatic(req, res, path);
  }
}

function serveStatic(req, res, path) {
  staticServer.serve(req, res, function(err, result) {
    if (err) {
      util.error("Error serving " + staticServer.root + path + " - " + err.message);

      res.writeHead(err.status, err.headers);
      res.end();
    }
  });
}

var server = http.createServer(handle);
var io = require("socket.io").listen(server);
var clients = [];


io.sockets.on('connection', function(socket) {
  clients.push(socket);

  socket.on('message', function(data) {
      socket.broadcast.json.send(JSON.parse(data));
  });
});

io.on('disconnection', function(client) {
  delete clients[clients.indexOf(client)];
});


server.listen(7000);
