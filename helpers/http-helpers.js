var http = require('http');

exports.getJSON = function(url) {
  return new Promise((resolve, reject) => {
    http.get(url, function (res) {
      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () { resolve(JSON.parse(body)); });
    }).on('error', function (e) { reject(e); });
  });
};
