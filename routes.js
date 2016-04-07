var auth = require('./middlewares/auth');

exports.setup = function (params) {
    var app = params.app
    var controllers = params.controllers;
    var v_1_api = '/api/1.0';

    // User Routes
    app.post(v_1_api+'/users', controllers.users.saveUser);
    app.get(v_1_api+'/users', auth.authenticated, controllers.users.getUsers);
    app.get(v_1_api+'/users/:id', controllers.users.getUser);
    app.post(v_1_api+'/login', controllers.site.login);

};
