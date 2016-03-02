if (!process.env.SLACK_TOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var http = require('http');
var controller = Botkit.slackbot({
  debug: false
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_TOKEN,
}).startRTM()

// give the bot something to listen for.
controller.hears(
  'keltasirkku',
  ['direct_message','direct_mention','mention'],
  function (bot, message) {
    var reply = function (replyMessage) {
      bot.reply(message, replyMessage);
    };
    var fetchMenu = function () {
      var url = 'http://ruokalistat.leijonacatering.fi/AromiStorage/blob/menu/4e605ac2-acdb-e511-8349-78e3b50298fc';

      http.get(url, function (res) {
        var body = '';
        
        res.on('data', function (chunk) {
          body += chunk;
        });
        
        res.on('end', function () {
          var response = JSON.parse(body);
          var today = new Date();
          var replyMessage = '';
          try {
            response.Days[today.getDay() - 1].Meals.forEach(function(meal){
              console.log(meal.Name);
              replyMessage = replyMessage + meal.MealType + ': ' + meal.Name + '\n';
            });
          } catch (e) {
            replyMessage = 'Ei ruokaa tälle päivälle :(';
          }
          reply(replyMessage);
        });
      
      }).on('error', function (e) { console.log("Got an error: ", e) });
    };
    fetchMenu();
  }
);

controller.hears(
  'vaunu',
  ['direct_message','direct_mention','mention'],
  function(bot, message) {
    bot.reply(message, 'EI');
  }
);

// to avoid heroku error, listen port process.env.PORT
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.send('it is running\n');
}).listen(process.env.PORT || 5000);
