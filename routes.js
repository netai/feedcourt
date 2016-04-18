var auth = require('./middlewares/auth');

exports.setup = function (params) {
    var app = params.app
    var controllers = params.controllers;
    var v_1_api = '/api/1.0';
	   app.get('/', controllers.site.home);
    //login
    //app.post(v_1_api+'/adminlogin', auth.authenticated, auth.isAdmin, controllers.site.adminlogin);
    //app.post(v_1_api+'/subadminlogin', auth.authenticated, auth.isSubAdmin, controllers.site.subadminlogin);
    app.post(v_1_api+'/login', controllers.site.login);

    //restaurants route
    app.get(v_1_api+'/restaurants', auth.authenticated, controllers.restaurants.getRestaurants);
    app.put(v_1_api+'/restaurants/changestatus', auth.authenticated, controllers.customers.changeStatus);

    //foodcourts route
    app.get(v_1_api+'/foodcourts', auth.authenticated, controllers.foodcourts.getFoodcourts);
    app.put(v_1_api+'/foodcourts/changestatus', auth.authenticated, controllers.customers.changeStatus);
    // Customer Routes
    app.get(v_1_api+'/customers', auth.authenticated, controllers.customers.getCustomers);
    app.put(v_1_api+'/customers/changestatus', auth.authenticated, controllers.customers.changeStatus);
};
