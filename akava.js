var http = require('http');
var cheerio = require('cheerio');
var miss = require('mississippi');
var akava = {};

var akavaUrl = "http://www.antell.fi/lounaslistat/lounaslista.html?owner=268";

function parseDay (callback, finder) {
  akava.parseRaw(function (html) {
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

akava.parseRaw = function (callback) {
	http.get(akavaUrl, function (incomingMessage) {
		var streamHandler = miss.concat(function (buffer) {
			return callback(buffer.toString("utf8"));
		});
		incomingMessage.pipe(streamHandler);
	});
};


akava.monday = function (callback) {
  parseDay(callback, function (lunchContentTable) {
		return lunchContentTable.find("table").first();
	});
};

akava.tuesday = function (callback) {
	parseDay(callback, function (lunchContentTable) {
		return lunchContentTable.find("table").slice(1).first();
	});
};

akava.wednesday = function (callback) {
	parseDay(callback, function (lunchContentTable) {
		return lunchContentTable.find("table").slice(2).first();
	});
};

akava.thursday = function (callback) {
	parseDay(callback, function (lunchContentTable) {
		return lunchContentTable.find("table").slice(3).first();
	});
};

akava.friday = function (callback) {
	parseDay(callback, function (lunchContentTable) {
		return lunchContentTable.find("table").slice(4).first();
	});
};

for(f in akava) {
	exports[f]= akava[f];
}
