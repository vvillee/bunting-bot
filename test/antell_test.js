var fs = require("fs");
var antell = require("../models/antell.js");
var nock = require("nock");

function setResult(result) {
	return nock("https://www.antell.fi").
		filteringPath(function (path) {
			return "/all";
		}).
		get("/all").
		reply(200, result);
}

function setCommonResult () {
	var common = fs.readFileSync("test/antell.html");
	return setResult(common);
}

function removeResult(r) {
	nock.removeInterceptor(r);
}


exports.testAntellParseRawExists = function (test) {
	test.expect(1);
	test.notEqual(antell.parseRaw, undefined);
	test.done();
};

exports.testConnection = function (test) {
	var r = setResult("lol");
  antell.parseRaw(function (data) {
		test.equal("lol", data);
		removeResult(r);
		test.done();
	});
};

exports.testMonday = function (test) {
	var lunch = 'Maanantai\nKukkoa viinissä (M, G*, A)\nKebablihaa chilikastikkeessa ja jogurttia (M, G*, A)\nKikherne-ratatouillea (L, G*, A)\nPersikkarahkaa (L, G*, A)\nDelisalaatti (A)\nMustajuurikeittoa (L, G*, A)';
	var r = setCommonResult();
	antell.menuForDay(0, function (data) {
		test.equal(lunch, data);
		removeResult(r);
		test.done();
	});
};

exports.testTuesday = function (test) {
	var lunch = 'Tiistai\nSavulohi-nuudeliwokkia (M, A)\nKeittiömestarin kausimakkaraa ja hapankaalia (L, G*, A)\nKukkakaali-kookoscurrya (M, G*, A)\nMarjapaistosta ja vaniljavaahtoa (L, A)\nDelisalaatti (A)\nPapu-tomaattikeittoa (L, G*, A)';
	var r = setCommonResult();
	antell.menuForDay(1, function (data) {
		test.equal(lunch, data);
		removeResult(r);
		test.done();
	});
};
