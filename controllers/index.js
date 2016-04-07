function controllersFactory () {

    var controllers = Object.create({});
    controllers.users = require('./usersController');
    controllers.site = require('./siteController');

    return controllers;
};

module.exports = controllersFactory();
