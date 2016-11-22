var Leijona = function(restaurantId, fetchJson, reply, bot, message) {
  this.restaurantDataUrl = 'http://ruokalistat.leijonacatering.fi/AromiStorage/blob/main/AromiMenusJsonData';

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
    reply(replyMessageFromMenu(data), bot, message);
  };

  var handleRestaurantData = function (data) {
    var restaurantMenuUrl = parseRestaurantMenuUrl(data);
    fetchJson(restaurantMenuUrl, handleRestaurantMenuData);
  };

  fetchJson(this.restaurantDataUrl, handleRestaurantData);
};

module.exports = Leijona;
