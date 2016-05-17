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
    app.all('/portal/state',auth.portal_authenticated, controllers.site.state_list);
    app.all('/portal/city/:id',auth.portal_authenticated, controllers.site.city_list);
    app.all('/portal/foodcourt_list/',auth.portal_authenticated, controllers.site.foodcourt_list);
    app.all('/portal/emailexist/', controllers.site.email_exist);
    
    
    
    //customers router
    app.get('/portal/customers', auth.portal_authenticated, controllers.customers.customers_list);
    app.get('/portal/customers/view/:id', auth.portal_authenticated, controllers.customers.customer_detail);
    app.get('/portal/customers/changestatus/:id', auth.portal_authenticated, controllers.customers.change_status);
    
    //restaurants router
    app.get('/portal/restaurants', auth.portal_authenticated, controllers.restaurants.restaurants_list);
    app.get('/portal/restaurants/view/:id', auth.portal_authenticated, controllers.restaurants.restaurants_detail);
    app.get('/portal/restaurants/changestatus/:id', auth.portal_authenticated, controllers.restaurants.change_status);
    app.all('/portal/restaurant/add',auth.portal_authenticated,controllers.restaurants.add_restaurant);
    
    //orders route
    app.get('/portal/orders',auth.portal_authenticated,controllers.orders.order_list);
    app.get('/portal/restaurant/orders/:id',auth.portal_authenticated,controllers.orders.getRestaurantOrders);
    app.get('/portal/order/view/:id',auth.portal_authenticated,controllers.orders.order_detail);
    
    //foodcourts route
    app.get('/portal/foodcourts',auth.portal_authenticated,controllers.foodcourts.foodcourt_list);
    app.get('/portal/feedcourt/view/:id',auth.portal_authenticated,controllers.foodcourts.foodcourt_detail);
    app.get('/portal/foodcourt/changestatus/:id',auth.portal_authenticated,controllers.foodcourts.change_status);
    app.get('/portal/foodcourt/restaurants/:id',auth.portal_authenticated,controllers.foodcourts.restaurant_list);
    app.all('/portal/foodcourt/add',controllers.foodcourts.add_foodcourt);
    
    



};
