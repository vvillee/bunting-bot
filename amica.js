var Amica = function(restaurantPageId, fetchJson, reply, bot, message) {
  var restaurantPageId = restaurantPageId;
  var fetchJson = fetchJson;
  var reply = reply;
  var bot = bot;
  var message = message;

  var today = new Date();

  var dateRepresentationUS = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  var restaurantDataUrl = 'http://www.amica.fi/api/restaurant/menu/day?language=fi&restaurantPageId=' + restaurantPageId + '&date=' + dateRepresentationUS;

  var generateReplyMessageFromLunches = function (lunches) {
    var replyMessage = '';
    _.each(lunches, function (lunch) { replyMessage = replyMessage + lunch + '\n'})
    return replyMessage;
  }

  var handleRestaurantData = function (data) {
    var lunchMeals = _.find(data.LunchMenu.SetMenus, function(menu) { return menu.Name === 'Buffetlounas' });
    var lunches = _.map(lunchMeals.Meals, function(lunch) { return lunch.Name });
    reply(generateReplyMessageFromLunches(lunches), bot, message);
  };

  fetchJson(restaurantDataUrl, handleRestaurantData);
};

module.exports = Amica;
