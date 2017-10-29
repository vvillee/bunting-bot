var http = require('http');
var cheerio = require('cheerio');
var miss = require('mississippi');
var antell = {};
var restaurantId = 268;
var antellUrl = "http://www.antell.fi/lounaslistat/lounaslista.html?owner=" + restaurantId;
var weekdayIndexHashMap = {
  0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5
};

antell.parseDay = function(callback, finder) {
  antell.parseRaw(function (html) {
    var $ = cheerio.load(html);
    var day = finder($("#lunch-content-table"));
    var lunch = day.find("td").map(function (i, el) {
      return cheerio.load(el).text().trim();
    }).get().filter(function (t) {
      return t.length > 0;
    }).map(function (t) {
      return t.replace(/[\n\r\t]/g, "").replace(/\(/, " (");
    }).join("\n");
    callback(lunch);
  });
};

antell.parseRaw = function (callback) {
  http.get(antellUrl, function (incomingMessage) {
    var streamHandler = miss.concat(function (buffer) {
      return callback(buffer.toString("utf8"));
    });
    incomingMessage.pipe(streamHandler);
  });
};

antell.menuForDay = function (count, callback) {
  antell.parseDay(callback, function (lunchContentTable) {
    return lunchContentTable.find("table").slice(count).first();
  });
};

antell.lunch = function (callback) {
  antell.menuForDay(weekdayIndexHashMap[new Date().getDay()], callback);
};

for(var f in antell) {
  exports[f] = antell[f];
}
