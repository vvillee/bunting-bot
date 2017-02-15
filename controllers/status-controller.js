var http = require('http');

// to avoid heroku error, listen port process.env.PORT
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('it is running\n');
}).listen(process.env.PORT || 5000);
