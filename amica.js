const getJSON = require('./http-helpers.js').getJSON;

class Amica {
  constructor(restaurantPageId) {
    const today = new Date();
    const dateRepresentationUS = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    const restaurantDataUrl = 'http://www.amica.fi/api/restaurant/menu/day?language=fi&restaurantPageId=' + restaurantPageId + '&date=' + dateRepresentationUS;

    this.todaysMenu = getJSON(restaurantDataUrl).then((data) => {
      return this.handleRestaurantData(data);
    });
  }

  generateReplyMessageFromLunches(lunches) {
    var replyMessage = '';
    _.each(lunches, function (lunch) { replyMessage = replyMessage + lunch + '\n'})
    return replyMessage;
  }

  handleRestaurantData(data) {
    const lunchMeals = _.find(data.LunchMenu.SetMenus, function(menu) { return menu.Name === 'Buffetlounas' });
    const lunches = _.map(lunchMeals.Meals, function(lunch) { return lunch.Name });
    return this.generateReplyMessageFromLunches(lunches);
  }
};

module.exports = Amica;
