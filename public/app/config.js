feedcourt.config(function($httpProvider,$routeProvider,$locationProvider){
  $httpProvider.interceptors.push('httpTimestampInterceptor');
  $httpProvider.interceptors.push('httpUnauthorizedInterceptor');
  $httpProvider.interceptors.push('AuthInterceptor');

  $routeProvider.
  when("/dashboard",{
    templateUrl: "templates/site/home.html",
    controller: "siteCtrl",
    controllerAs: "siteCtrl"
  }).
  when("/login",{
    templateUrl: "templates/site/login.html",
    controller: "authCtrl",
    controllerAs: "authCtrl"
  }).
    otherwise({
      redirectTo: '/login'
    });

    //$locationProvider.html5Mode(true);
});
