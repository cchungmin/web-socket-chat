const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    ws.send('Okay, let me check it.');
  });

  ws.send('We can help you!');
});

fs.readFile('./index.html', function (err, html) {
  if (err) {
    throw err;
  }

  http.createServer(function(request, response) {
    response.writeHeader(200, {"Content-Type": "text/html"});
    response.write(html);
    response.end();
  }).listen(8000);
});

