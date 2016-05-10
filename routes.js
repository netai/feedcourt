var auth = require('./middlewares/auth');

exports.setup = function (params) {
    var app = params.app
    var controllers = params.controllers;
    var v1_api = '/api/v1';
    
    /*****************portal router*********************/
    
    //site router
	app.get('/portal/dashboard', auth.portal_authenticated, controllers.site.dashboard);
    app.all('/portal/login', controllers.site.portal_login);
    
    //orders route
    app.get('/portal/orders',controllers.orders.getOrders);
    app.get('/portal/restaurant/orders/:id',controllers.orders.getRestaurantOrders);
    
    //foodcourts route
    app.get('portal/foodcourts',controllers.foodcourts.getFoodcourts);
    //app.put('/portal/foodcourts/changestatus',controllers.foodcourts.changeStatus);
    //app.post('/portal/foodcourts/add',controllers.foodcourts.addFoodcourt);



};
