feedcourt.config(function($httpProvider,$routeProvider,$locationProvider){
  $httpProvider.interceptors.push('httpTimestampInterceptor');
  $httpProvider.interceptors.push('httpUnauthorizedInterceptor');
  $httpProvider.interceptors.push('AuthInterceptor');

  $routeProvider.
  when("/login",{
    templateUrl: "templates/site/login.html",
    controller: "siteCtrl"
  }).
    otherwise({
      redirectTo: '/login'
    });

    //$locationProvider.html5Mode(true);
});
