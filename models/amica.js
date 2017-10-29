const getJSON = require('./../helpers/http-helpers').getJSON;

const DateFormatter = require('./../helpers/date-formatter');

class Amica {
  constructor(restaurantPageId) {
    const restaurantDataUrl = 'http://www.amica.fi/api/restaurant/menu/day?language=fi&restaurantPageId=' + restaurantPageId + '&date=' + DateFormatter.representationUS(new Date());

    this.todaysMenu = getJSON(restaurantDataUrl).then((data) => {
      return this.handleRestaurantData(data);
    });
  }

  generateReplyMessageFromLunches(lunches) {
    var replyMessage = '';
    _.each(lunches, function (lunch) { replyMessage = replyMessage + lunch + '\n'; });
    return replyMessage;
  }

  handleRestaurantData(data) {
    const lunchMeals = _.find(data.LunchMenu.SetMenus, function(menu) { return menu.Name === 'Buffetlounas'; });
    const lunches = _.map(lunchMeals.Meals, function(lunch) { return lunch.Name; });
    return this.generateReplyMessageFromLunches(lunches);
  }

}

module.exports = Amica;
