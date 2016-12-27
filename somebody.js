let Somebody = function (bot) {
  this.bot = bot;
};

Somebody.prototype.handleChannelData = function (message) {
  let channelId = message.channel;

  let createReply = function (err, response) {
    this.bot.reply(message, `Joku eli @${response.user.name}`);
  };

  let handleSelectedMember = function (memberId) {
    if (memberId !== undefined){
      this.bot.api.users.info({'user': memberId}, createReply.bind(this));
    } else {
      this.bot.reply(message, "Joku eli ei kukaan :(");
    }
  };

  let callerOrBotFilter = function (memberId) {
    return (memberId !== message.user && memberId !== this.bot.identity.id);
  };

  let filterMembers = function (members) {
    return _.filter(members, callerOrBotFilter.bind(this));
  };

  let selectRandomMember = function (members) {
    return _.sample(filterMembers.bind(this, members));
  };

  let handleChannelResponse = function (response) {
    let memberId = null;
    if (response.channel !== undefined) {
      memberId = selectRandomMember.call(this, response.channel.members);
    } else {
      memberId = selectRandomMember.call(this, response.group.members);
    }

    if (memberId !== null) {
      handleSelectedMember.call(this, memberId);
    }
  };

  let handleChannelCallback = function (err, response) {
    if (err) {
      console.log(err);
    } else {
      handleChannelResponse.call(this, response);
    }
  };

  this.bot.api.channels.info({'channel': channelId}, handleChannelCallback.bind(this));
  this.bot.api.groups.info({'channel': channelId}, handleChannelCallback.bind(this));
};

module.exports = Somebody;
