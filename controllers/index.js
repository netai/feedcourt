function controllersFactory () {

    var controllers = Object.create({});
    controllers.customers = require('./customersController.js');
    controllers.site = require('./siteController');
    controllers.foodcourts = require('./foodcourtsController');
    controllers.restaurants = require('./restaurantsController');
    controllers.orders = require('./ordersController');

    return controllers;
};

module.exports = controllersFactory();
