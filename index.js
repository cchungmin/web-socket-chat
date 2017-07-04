const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
var adminWS;
var clientWS;

var setAdminServer = function(request, response) {
  fs.readFile('./admin/' + request.url, function(err, data) {
    if (!err) {
      var dotoffset = request.url.lastIndexOf('.');
      var mimetype = dotoffset == -1 ?
          'text/plain': {
            '.html' : 'text/html',
            '.ico' : 'image/x-icon',
            '.jpg' : 'image/jpeg',
            '.png' : 'image/png',
            '.gif' : 'image/gif',
            '.css' : 'text/css',
            '.js' : 'text/javascript'
          }[ request.url.substr(dotoffset) ];
      response.setHeader('Content-type' , mimetype);
      response.end(data);
      console.log( request.url, mimetype );
    } else {
      console.log ('file not found: ' + request.url);
      response.writeHead(404, "Not Found");
      response.end();
    }
  });
};

var setClientServer = function(request, response) {
  fs.readFile('./client/' + request.url, function(err, data) {
    if (!err) {
      var dotoffset = request.url.lastIndexOf('.');
      var mimetype = dotoffset == -1 ?
          'text/plain': {
            '.html' : 'text/html',
            '.ico' : 'image/x-icon',
            '.jpg' : 'image/jpeg',
            '.png' : 'image/png',
            '.gif' : 'image/gif',
            '.css' : 'text/css',
            '.js' : 'text/javascript'
          }[ request.url.substr(dotoffset) ];
      response.setHeader('Content-type' , mimetype);
      response.end(data);
      console.log( request.url, mimetype );
    } else {
      console.log ('file not found: ' + request.url);
      response.writeHead(404, "Not Found");
      response.end();
    }
  });
};


var adminServer = http.createServer(setAdminServer).listen(8080);
var clientServer = http.createServer(setClientServer).listen(8081);

const wssAdmin = new WebSocket.Server({
  server: adminServer
});

const wssClient = new WebSocket.Server({
  server: clientServer
});

wssAdmin.on('connection', function connection(ws) {
  adminWS = ws;
  adminWS.on('message', function incoming(message) {
    console.log('Admin received: %s', message);

    clientWS.send(message);
  });

  adminWS.send('I need your help!');
});

wssClient.on('connection', function connection(ws) {
  clientWS = ws;
  clientWS.on('message', function incoming(message) {
    console.log('Client received: %s', message);

    adminWS.send(message);
  });

  clientWS.send('We can help you!');
});
