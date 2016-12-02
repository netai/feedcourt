function controllersFactory () {

    var controllers = Object.create({});
    controllers.site = require('./siteController');
    controllers.foodcourts = require('./foodcourtsController');
    controllers.restaurants = require('./restaurantsController');
    controllers.reviews = require('./reviewsController');
    controllers.orders = require('./ordersController');

    return controllers;
};

module.exports = controllersFactory();
