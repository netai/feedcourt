function controllersFactory () {

    var controllers = Object.create({});
    controllers.customers = require('./customersController.js');
    controllers.site = require('./siteController');
    controllers.foodcourts = require('./foodcourtsController');
    controllers.restaurants = require('./restaurantsController');
    controllers.orders = require('./ordersController');
    controllers.cuisines = require('./cuisinesController');
    controllers.menues = require('./menuesController');
    controllers.reviews= require('./reviewsController');
    controllers.menue_group= require('./menueGroupController');
    return controllers;
};

module.exports = controllersFactory();
