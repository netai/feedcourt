var auth = require('./middlewares/auth');

exports.setup = function (params) {
    var app = params.app
    var controllers = params.controllers;
    var v1_api = '/api/v1';
    
    /*****************portal router*********************/
    
    //site router
	app.get('/portal', auth.portal_authenticated, controllers.site.dashboard);
    app.all('/portal/login', controllers.site.portal_login);
    app.get('/portal/logout', controllers.site.portal_logout);
    
    //customers router
    app.get('/portal/customers', auth.portal_authenticated, controllers.customers.customers_list);
    app.get('/portal/customers/view/:id', auth.portal_authenticated, controllers.customers.customer_detail);
    
    //orders route
    app.get('/portal/orders',controllers.orders.getOrders);
    app.get('/portal/restaurant/orders/:id',controllers.orders.getRestaurantOrders);
    
    //foodcourts route
    app.get('/portal/foodcourts',controllers.foodcourts.getFoodcourts);
    //app.put('/portal/foodcourts/changestatus',controllers.foodcourts.changeStatus);
    //app.post('/portal/foodcourts/add',controllers.foodcourts.addFoodcourt);



};
