feedcourt.config(function($httpProvider,$routeProvider,$locationProvider){
  $httpProvider.interceptors.push('httpTimestampInterceptor');
  $httpProvider.interceptors.push('httpUnauthorizedInterceptor');
  $httpProvider.interceptors.push('AuthInterceptor');

  $routeProvider.
  when("/dashboard",{
    templateUrl: "templates/site/dashboard.html",
    controller: "siteCtrl",
    controllerAs: "siteCtrl"
  }).
  when("/login",{
    templateUrl: "templates/site/login.html",
    controller: "authCtrl",
    controllerAs: "authCtrl"
  }).
  when("/customers",{
    templateUrl: "templates/customer/customer_list.html",
    controller: "customerCtrl",
    controllerAs: "customerCtrl",
    resolve: {slugIdentity: function(){return 'customers'}}
  }).
  when("/restaurants",{
    templateUrl: "templates/restaurant/restaurant_list.html",
    controller: "restaurantCtrl",
    controllerAs: "restaurantCtrl",
    resolve: {slugIdentity: function(){return 'restaurants'}}
  }).
  when("/foodcourts/restaurants/:id",{
    templateUrl: "templates/restaurant/restaurant_list.html",
    controller: "restaurantCtrl",
    controllerAs: "restaurantCtrl",
    resolve: {slugIdentity: function(){return 'foodcourt_restaurants'}}
  }).
  when("/foodcourts",{
    templateUrl: "templates/foodcourt/foodcourt_list.html",
    controller: "foodcourtCtrl",
    controllerAs: "foodcourtCtrl",
    resolve: {slugIdentity: function(){return 'foodcourts'}}
  }).
  when("/foodcourt/add",{
    templateUrl: "templates/foodcourt/foodcourt_add.html",
    controller: "foodcourtCtrl",
    controllerAs: "foodcourtCtrl",
    resolve: {slugIdentity: function(){return 'foodcourtAdd'}}
  }).
  when("/restaurant/orders/:id",{
    templateUrl: "templates/order/order_list.html",
    controller: "orderCtrl",
    controllerAs: "orderCtrl",
    resolve: {slugIdentity: function(){return 'restaurantOrders'}}
  }).
  when("/orders",{
    templateUrl: "templates/order/order_list.html",
    controller: "orderCtrl",
    controllerAs: "orderCtrl",
    resolve: {slugIdentity: function(){return 'orderLists'}}
  }).
  otherwise({
      redirectTo: '/login'
    });

    //$locationProvider.html5Mode(true);
});
