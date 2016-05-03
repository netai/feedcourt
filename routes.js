var auth = require('./middlewares/auth');

exports.setup = function (params) {
    var app = params.app
    var controllers = params.controllers;
    var v_1_api = '/api/1.0';
	   app.get('/', controllers.site.home);
    //site route
    app.post(v_1_api+'/adminlogin', controllers.site.adminlogin);
    //app.post(v_1_api+'/subadminlogin', auth.authenticated, auth.isSubAdmin, controllers.site.subadminlogin);
    app.post(v_1_api+'/login', controllers.site.login);

    //restaurants route
    app.get(v_1_api+'/restaurants', auth.authenticated, controllers.restaurants.getRestaurants);
    app.get(v_1_api+'/foodcourts/restaurants/:id', auth.authenticated, controllers.restaurants.getFoodcourtRestaurant);
    app.put(v_1_api+'/restaurants/changestatus', auth.authenticated, controllers.restaurants.changeStatus);

    //foodcourts route
    app.get(v_1_api+'/foodcourts', auth.authenticated, controllers.foodcourts.getFoodcourts);
    //app.get(v_1_api+'/foodcourts/restaurants/:id', auth.authenticated, controllers.foodcourts.getRestaurant);
    app.put(v_1_api+'/foodcourts/changestatus', auth.authenticated, controllers.foodcourts.changeStatus);
    app.post(v_1_api+'/foodcourts/add', auth.authenticated, controllers.foodcourts.addFoodcourt);
    app.get(v_1_api+'/foodcourts/states', auth.authenticated, controllers.foodcourts.getStates);
    app.get(v_1_api+'/foodcourts/cities/:id', auth.authenticated, controllers.foodcourts.getCities);



    // Customer Routes
    app.get(v_1_api+'/customers', auth.authenticated, controllers.customers.getCustomers);
    app.put(v_1_api+'/customers/changestatus', auth.authenticated, controllers.customers.changeStatus);

    //orders route
    app.get(v_1_api+'/orders', auth.authenticated, controllers.orders.getOrders);
    app.get(v_1_api+'/restaurant/orders/:id', auth.authenticated, controllers.orders.getRestaurantOrders);
    //app.put(v_1_api+'/order/changestatus', auth.authenticated, controllers.ordersController.changeStatus);


};
