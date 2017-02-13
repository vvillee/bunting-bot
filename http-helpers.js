var http = require('http');

const fetchJson = function (url, callback) {
  http.get(url, function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () { callback(JSON.parse(body)); });
  }).on('error', function (e) { console.log("Got an error: ", e); });
};

exports.fetchJson = fetchJson;

exports.getJSON = function(url) {
  return new Promise((resolve, reject) => {
    fetchJson(url, resolve);
  });
};
