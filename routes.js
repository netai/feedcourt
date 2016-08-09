var auth = require('./middlewares/auth');
var multer = require('multer');

exports.setup = function (params) {
    var upload = multer({ dest: './temp' });
    var app = params.app;
    var controllers = params.controllers;
    var api_controllers = params.api_controllers;
    var v1_api = '/api/v1';
    
    /*****************API router*********************/
    
    //site router
    app.all(v1_api+'/', api_controllers.site.home);
    app.post(v1_api+'/login', api_controllers.site.login);
    app.post(v1_api+'/signup', api_controllers.site.signup);
    app.post(v1_api+'/facebook_signup', api_controllers.site.facebook_signup);
    app.get(v1_api+'/search', api_controllers.site.search);
    
    //restaurants router
    app.get(v1_api+'/restaurant/:id', auth.api_authenticated, api_controllers.restaurants.restaurantDetail);
    
    
    /*****************portal router*********************/
    
    //site router
    app.get('/', controllers.site.home);
	app.get('/portal', auth.portal_authenticated, controllers.site.dashboard);
    app.all('/portal/login', controllers.site.portal_login);
    app.all('/portal/changepassword', auth.portal_authenticated, controllers.site.change_password);
    app.get('/portal/logout', controllers.site.portal_logout);
    app.all('/portal/state',auth.portal_authenticated, controllers.site.state_list);
    app.all('/portal/city/:id',auth.portal_authenticated, controllers.site.city_list);
    app.all('/portal/foodcourt_list/',auth.portal_authenticated, controllers.site.foodcourt_list);
    app.all('/portal/cuisines_list/', controllers.site.cuines_list);
    app.get('/portal/unit_list/', controllers.site.unit_list);
    app.all('/portal/menu_list/', controllers.site.menu_list);
    
    app.all('/portal/emailexist/', controllers.site.email_exist);
    
    
    
    //customers router
    app.get('/portal/customers', auth.portal_authenticated, controllers.customers.customers_list);
    app.get('/portal/customers/view/:id', auth.portal_authenticated, controllers.customers.customer_detail);
    app.get('/portal/customers/changestatus/:id', auth.portal_authenticated, controllers.customers.change_status);
    
    //restaurants router
    app.get('/portal/restaurants', auth.portal_authenticated, controllers.restaurants.restaurants_list);
    app.get('/portal/restaurants/view/:id', auth.portal_authenticated, controllers.restaurants.restaurants_detail);
    app.get('/portal/restaurants/changestatus/:id', auth.portal_authenticated, controllers.restaurants.change_status);
    app.all('/portal/restaurant/edit/:id',auth.portal_authenticated,upload.single('image'),controllers.restaurants.edit_restaurant);
    app.all('/portal/restaurant/add',auth.portal_authenticated,upload.single('image'),controllers.restaurants.add_restaurant);
    app.all('/portal/restaurant_images/view/:id',auth.portal_authenticated,upload.single('image'),controllers.restaurants.resturant_images);
    app.post('/portal/restaurant_image_status/default',auth.portal_authenticated,controllers.restaurants.default_image_status);
    app.post('/portal/restaurant_image/delete',auth.portal_authenticated,controllers.restaurants.delete_image);
    
    
    //orders route
    app.get('/portal/orders',auth.portal_authenticated,controllers.orders.order_list);
    app.get('/portal/restaurant/orders/:id',auth.portal_authenticated,controllers.orders.getRestaurantOrders);
    app.get('/portal/order/view/:id',auth.portal_authenticated,controllers.orders.order_detail);
    
    //foodcourts route
    app.get('/portal/foodcourts',auth.portal_authenticated,controllers.foodcourts.foodcourt_list);
    app.get('/portal/feedcourt/view/:id',auth.portal_authenticated,controllers.foodcourts.foodcourt_detail);
    app.get('/portal/foodcourt/changestatus/:id',auth.portal_authenticated,controllers.foodcourts.change_status);
    app.get('/portal/foodcourt/restaurants/:id',auth.portal_authenticated,controllers.foodcourts.restaurant_list);
    app.all('/portal/foodcourt/add',auth.portal_authenticated,upload.single('image'),controllers.foodcourts.add_foodcourt);
    app.all('/portal/foodcourt/edit/:id',auth.portal_authenticated,upload.single('image'),controllers.foodcourts.edit_foodcourt);
    
    //cuisines route
    app.get('/portal/cuisines',auth.portal_authenticated,controllers.cuisines.cuisines_list);
    app.get('/portal/cuisines/view/:id',auth.portal_authenticated,controllers.cuisines.cuisines_detail);
    app.get('/portal/cuisines/changestatus/:id',auth.portal_authenticated,controllers.cuisines.change_status);
    app.get('/portal/cuisines/delete/:id',auth.portal_authenticated,controllers.cuisines.cuisines_delete);
    app.all('/portal/cuisines/add',auth.portal_authenticated,controllers.cuisines.add_cuisines);
    app.all('/portal/cuisines/edit/:id',auth.portal_authenticated,controllers.cuisines.edit_cuisines);
    
    //Menu Route
    app.get('/portal/menu/:id',auth.portal_authenticated,controllers.menues.menu_list);
    app.get('/portal/menu/:feedcourt/:id',auth.portal_authenticated,controllers.menues.menu_list);
    app.get('/portal/menu/view/:restaurant/:id',auth.portal_authenticated,controllers.menues.menu_view);
    app.get('/portal/menu/delete/:id',auth.portal_authenticated,controllers.menues.menu_delete);
    app.get('/portal/menu/changestatus/:id',auth.portal_authenticated,controllers.menues.change_status);
    app.all('/portal/add_menu/:id',auth.portal_authenticated,upload.single('image'),controllers.menues.menu_add);
    app.all('/portal/edit_menu/:restaurant/:id',auth.portal_authenticated,upload.single('image'),controllers.menues.menu_edit);
    app.all('/portal/menu_images/view/:restaurant/:id',auth.portal_authenticated,upload.single('image'),controllers.menues.menu_images);
    app.post('/portal/menu_images/default',auth.portal_authenticated,controllers.restaurants.default_image_status);
    app.post('/portal/menu_images/delete',auth.portal_authenticated,controllers.restaurants.delete_image);
    
    //Menu Group
    //app.get('/portal/menu_group_list/',auth.portal_authenticated,controllers.menue_group.menu_group_list);
    // app.all('/portal/menu_group_add/',auth.portal_authenticated,upload.single('image'),auth.portal_authenticated,controllers.menue_group.menu_group_add);
    // app.all('/portal/menu_group_edit/:id',auth.portal_authenticated,upload.single('image'),auth.portal_authenticated,controllers.menue_group.menu_group_edit);
    // app.get('/portal/menu_group_view/:id',auth.portal_authenticated,controllers.menue_group.menu_group_view);
    // app.get('/portal/menu_group_change_status/:id',auth.portal_authenticated,controllers.menue_group.menu_group_change_status);
    // app.get('/portal/menu_group_delete/:id',auth.portal_authenticated,controllers.menue_group.menu_group_delete);
    // app.get('/portal/menu_group_list_data',controllers.menue_group.menu_group_list_data);
    
    
    app.get('/portal/menu_group_list/:restaurant',auth.portal_authenticated,controllers.menue_group.menu_group_list);
    app.get('/portal/menu_group_list/:feedcourt/:restaurant',auth.portal_authenticated,controllers.menue_group.menu_group_list);
    
    app.all('/portal/menu_group_add/:restaurant',auth.portal_authenticated,upload.single('image'),auth.portal_authenticated,controllers.menue_group.menu_group_add);
    app.all('/portal/menu_group_edit/:restaurant/:id',auth.portal_authenticated,upload.single('image'),auth.portal_authenticated,controllers.menue_group.menu_group_edit);
    app.get('/portal/menu_group_view/:restaurant/:id',auth.portal_authenticated,controllers.menue_group.menu_group_view);
    app.get('/portal/menu_group_change_status/:restaurant/:id',auth.portal_authenticated,controllers.menue_group.menu_group_change_status);
    app.get('/portal/menu_group_delete/:restaurant/:id',auth.portal_authenticated,controllers.menue_group.menu_group_delete);
    app.get('/portal/menu_group_list_data/:restaurant',controllers.menue_group.menu_group_list_data);
    
    
    //Review 
     app.get('/portal/reviews',auth.portal_authenticated,controllers.reviews.review_list);
     app.get('/portal/review/changestatus',auth.portal_authenticated,controllers.reviews.change_status);
     
     //My-Profile
     app.all('/portal/profile',auth.portal_authenticated,controllers.site.edit_profile);
     
     
     
     app.get('/portal/sent_mail',controllers.site.mail_test);
    
};
