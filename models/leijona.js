const getJSON = require('./../helpers/http-helpers').getJSON;

class Leijona {
  constructor(restaurantId) {
    this.restaurantId = restaurantId;
    this.restaurantDataUrl = 'http://ruokalistat.leijonacatering.fi/AromiStorage/blob/main/AromiMenusJsonData';

    this.todaysMenu = getJSON(this.restaurantDataUrl)
    .then((data) => {
      return 'http:' + data.Restaurants.filter(this.restaurantFilter, this.restaurantId)[0].JMenus.pop().LinkUrl;
    })
    .then(getJSON)
    .then(this.replyMessageFromMenu)
    .catch((err) => { console.log(err); });
  }

  restaurantFilter(restaurant) {
    return restaurant.RestaurantId === this;
  }

  replyMessageFromMenu(data) {
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
  }
}

module.exports = Leijona;
