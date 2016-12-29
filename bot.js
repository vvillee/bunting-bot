if (!process.env.SLACK_TOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

_ = require('underscore');

var akava = require("./akava");
var Leijona = require("./leijona");
var Amica = require("./amica");
var Somebody = require("./somebody");
var Botkit = require('botkit');
var http = require('http');
var controller = Botkit.slackbot({
  debug: false
});

var fetchJson = function (url, callback) {
  http.get(url, function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () { callback(JSON.parse(body)); });
  }).on('error', function (e) { console.log("Got an error: ", e); });
};

var reply = function (replyMessage, bot, message) {
  bot.reply(message, replyMessage);
};

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_TOKEN,
}).startRTM();

// give the bot something to listen for
controller.hears(
  'keltasirkku',
  ['direct_message','direct_mention','mention'],
  function (bot, message) {
    new Leijona('4fd75ded-e510-e511-892b-78e3b50298fc', fetchJson, reply, bot, message);
  }
);

controller.hears(
  'asemamies',
  ['direct_message','direct_mention','mention'],
  function (bot, message) {
    new Leijona('b9ab95ae-4834-e611-87ed-78e3b50298fc', fetchJson, reply, bot, message);
  }
);

controller.hears(
  'viherlatva',
  ['direct_message','direct_mention','mention'],
  function(bot, message) {
    new Amica('7303', fetchJson, reply, bot, message);
  }
);

controller.hears(
  'vaunu',
  ['direct_message','direct_mention','mention'],
  function(bot, message) {
    bot.reply(message, 'EI');
  }
);

controller.hears(
  '@joku',
  ['ambient'],
  function(bot, message) {
    var somebody = new Somebody(bot);
    somebody.handleChannelData(message);
  }
);

controller.hears(
  'akava',
  ['direct_message','direct_mention','mention'],
  function (bot, message) {
    akava.lunch(function (parsedResult) {
      bot.reply(message, parsedResult);
    });
  }
);

// to avoid heroku error, listen port process.env.PORT
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('it is running\n');
}).listen(process.env.PORT || 5000);
