function controllersFactory () {

    var controllers = Object.create({});
    controllers.customers = require('./customersController.js');
    controllers.site = require('./siteController');
    controllers.foodcourts = require('./foodcourtsController');
    controllers.restaurants = require('./restaurantsController');

    return controllers;
};

module.exports = controllersFactory();
