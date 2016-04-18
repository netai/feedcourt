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
    controllerAs: "customerCtrl"
  }).
  when("/restaurants",{
    templateUrl: "templates/restaurant/restaurant_list.html",
    controller: "restaurantCtrl",
    controllerAs: "restaurantCtrl"
  }).
  when("/foodcourts",{
    templateUrl: "templates/foodcourt/foodcourt_list.html",
    controller: "foodcourtCtrl",
    controllerAs: "foodcourtCtrl"
  }).
  otherwise({
      redirectTo: '/login'
    });

    //$locationProvider.html5Mode(true);
});
