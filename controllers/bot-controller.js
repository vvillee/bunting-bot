var Antell = require("./../models/antell");
var Leijona = require("./../models/leijona");
var Amica = require("./../models/amica");
var Somebody = require("./../models/somebody");
var Botkit = require('botkit');
var controller = Botkit.slackbot({
  debug: false
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_TOKEN,
}).startRTM();

// give the bot something to listen for
controller.hears(
  'keltasirkku',
  ['direct_message','direct_mention','mention'],
  function (bot, message) {
    const keltasirkku = new Leijona('4fd75ded-e510-e511-892b-78e3b50298fc');
    keltasirkku.todaysMenu.then(function(menuMessage) {
      bot.reply(message, menuMessage);
    });
  }
);

controller.hears(
  'asemamies',
  ['direct_message','direct_mention','mention'],
  function (bot, message) {
    const asemamies = new Leijona('b9ab95ae-4834-e611-87ed-78e3b50298fc');
    asemamies.todaysMenu.then(function(menuMessage) {
      bot.reply(message, menuMessage);
    });
  }
);

controller.hears(
  'viherlatva',
  ['direct_message','direct_mention','mention'],
  function(bot, message) {
    const viherlatva = new Amica('7303');
    viherlatva.todaysMenu.then(function(menuMessage) {
      bot.reply(message, menuMessage);
    });
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
    Antell.lunch(function (parsedResult) {
      bot.reply(message, parsedResult);
    });
  }
);
