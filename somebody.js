var Somebody = function (reply, bot, message) {
  var createReply = function (err, response) {
    bot.reply(message, "Joku eli @"+response.user.name);
  };

  var handleSelectedMember = function (memberId) {
    if (memberId !== undefined){
      bot.api.users.info({'user': memberId}, createReply);
    } else {
      bot.reply(message, "Joku eli ei kukaan :(");
    }
  };

  var callerOrBotFilter = function (memberId) {
    return (memberId !== message.user && memberId !== bot.identity.id);
  };

  var filterMembers = function (members) {
    return _.filter(members, callerOrBotFilter);
  };

  var selectRandomMember = function (members) {
    return _.sample(filterMembers(members));
  };

  var handleChannelResponse = function (response) {
    var memberId = null;
    if (response.channel !== undefined) {
      memberId = selectRandomMember(response.channel.members);
    } else {
      memberId = selectRandomMember(response.group.members);
    }

    if (memberId !== null) {
      handleSelectedMember(memberId);
    }
  };

  var handleChannelCallback = function (err, response) {
    if (err) {
      console.log(err);
    } else {
      handleChannelResponse(response);
    }
  };

  var handleChannelData = function (channelId) {
    bot.api.channels.info({'channel': channelId}, handleChannelCallback);
    bot.api.groups.info({'channel': channelId}, handleChannelCallback);
  };

  handleChannelData(message.channel);
};

module.exports = Somebody;
