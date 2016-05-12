var auth = require('./middlewares/auth');

exports.setup = function (params) {
    var app = params.app
    var controllers = params.controllers;
    var v1_api = '/api/v1';
    
    /*****************portal router*********************/
    
    //site router
	app.get('/portal', auth.portal_authenticated, controllers.site.dashboard);
    app.all('/portal/login', controllers.site.portal_login);
    app.all('/portal/changepassword', auth.portal_authenticated, controllers.site.change_password);
    app.get('/portal/logout', controllers.site.portal_logout);
    app.all('/portal/state', controllers.site.state_list);
    app.all('/portal/city/:id', controllers.site.city_list);
    
    
    
    //customers router
    app.get('/portal/customers', auth.portal_authenticated, controllers.customers.customers_list);
    app.get('/portal/customers/view/:id', auth.portal_authenticated, controllers.customers.customer_detail);
    app.get('/portal/customers/changestatus/:id', auth.portal_authenticated, controllers.customers.change_status);
    
    //restaurants router
    app.get('/portal/restaurants', auth.portal_authenticated, controllers.restaurants.restaurants_list);
    app.get('/portal/restaurants/view/:id', auth.portal_authenticated, controllers.restaurants.restaurants_detail);
    app.get('/portal/restaurants/changestatus/:id', auth.portal_authenticated, controllers.restaurants.change_status);
    
    //orders route
    app.get('/portal/orders',controllers.orders.order_list);
    app.get('/portal/restaurant/orders/:id',controllers.orders.getRestaurantOrders);
    app.get('/portal/order/view/:id',controllers.orders.order_detail);
    
    //foodcourts route
    app.get('/portal/foodcourts',controllers.foodcourts.foodcourt_list);
    app.get('/portal/feedcourt/view/:id',controllers.foodcourts.foodcourt_detail);
    app.get('/portal/foodcourt/changestatus/:id',controllers.foodcourts.change_status);
    app.get('/portal/foodcourt/restaurants/:id',controllers.foodcourts.restaurant_list);
    app.all('/portal/foodcourt/add',controllers.foodcourts.add_foodcourt);
    
    



};
