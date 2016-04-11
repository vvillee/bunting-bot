if (!process.env.SLACK_TOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var fetchJson = function (url, callback) {
  http.get(url, function (res) {
    var body = '';
    res.on('data', function (chunk) { body += chunk; });
    res.on('end', function () { callback(JSON.parse(body)) });
  }).on('error', function (e) { console.log("Got an error: ", e) });
};

var Botkit = require('botkit');
var http = require('http');
var controller = Botkit.slackbot({
  debug: false
});
var _ = require('underscore');

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_TOKEN,
}).startRTM();

// give the bot something to listen for.
controller.hears(
  'keltasirkku',
  ['direct_message','direct_mention','mention'],
  function (bot, message) {
    var restaurantDataUrl = 'http://ruokalistat.leijonacatering.fi/AromiStorage/blob/main/AromiMenusJsonData';
    var restaurantId = '4fd75ded-e510-e511-892b-78e3b50298fc';

    var reply = function (replyMessage) {
      bot.reply(message, replyMessage);
    };

    var restaurantFilter = function (restaurant) {
      return restaurant.RestaurantId === restaurantId;
    };

    var parseRestaurantMenuUrl = function (data) {
      return 'http:' + data.Restaurants.filter(restaurantFilter)[0].JMenus[0].LinkUrl;
    };

    var replyMessageFromMenu = function (data) {
      var today = new Date();
      var replyMessage = '';
      try {
        data.Days[today.getDay() - 1].Meals.forEach(function(meal){
          replyMessage = replyMessage + meal.MealType + ': ' + meal.Name + '\n';
        });
        return replyMessage;
      } catch (e) {
        return 'Ei ruokaa tälle päivälle :(';
      }
    };

    var handleRestaurantMenuData = function (data) {
      reply(replyMessageFromMenu(data));
    };

    var handleRestaurantData = function (data) {
      var restaurantMenuUrl = parseRestaurantMenuUrl(data);
      fetchJson(restaurantMenuUrl, handleRestaurantMenuData);
    };

    fetchJson(restaurantDataUrl, handleRestaurantData);
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
  'joku',
  ['ambient'],
  function(bot, message) {

    var handleSelectedMember = function (memberId) {
      if (memberId !== undefined){
        bot.api.users.info({'user': memberId}, function (err, response) { bot.reply(message, "Joku eli @"+response.user.name) })
      } else {
        bot.reply(message, "Joku eli ei kukaan :(");
      }
    };

    var selectMember = function (members) {
      var membersWithoutCaller = _.filter(members, function (memberId) { return (memberId !== message.user && memberId !== bot.identity.id)});
      var memberId = _.sample(membersWithoutCaller);
      handleSelectedMember(memberId);
    };

    var handleChannelData = function (channelId) {
      bot.api.channels.info({'channel': channelId}, function (err, response) { selectMember(response.channel.members) });
    };

    handleChannelData(message.channel);
  }
);

// to avoid heroku error, listen port process.env.PORT
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('it is running\n');
}).listen(process.env.PORT || 5000);
