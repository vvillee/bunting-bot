var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: xoxb-20033792914-3LxaaHa2D8pKLtuM3dQ8OgfN
})
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});
controller.hears(["keyword","^pattern$"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  // do something to respond to message
  // all of the fields available in a normal Slack message object are available
  // https://api.slack.com/events/message
  bot.reply(message,'You used a keyword!');
});

