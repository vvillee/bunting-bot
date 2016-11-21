var Somebody = function (reply, bot, message) {
  var reply = reply;
  var bot = bot;
  var message = message;
  var handleSelectedMember = function (memberId) {
    if (memberId !== undefined){
      bot.api.users.info({'user': memberId}, function (err, response) { bot.reply(message, "Joku eli @"+response.user.name) });
    } else {
      bot.reply(message, "Joku eli ei kukaan :(");
    }
  };

  var selectMember = function (members) {
    var membersWithoutCaller = _.filter(members, function (memberId) { return (memberId !== message.user && memberId !== bot.identity.id)});
    var memberId = _.sample(membersWithoutCaller);
    handleSelectedMember(memberId);
  };

  var handleChannelResponse = function (err, response) {
    if (err) {
      console.log(err);
    } else {
      selectMember(response.channel.members);
    }
  };

  var handleChannelData = function (channelId) {
    bot.api.channels.info({'channel': channelId}, handleChannelResponse);
  };

  handleChannelData(message.channel);
};

module.exports = Somebody;
