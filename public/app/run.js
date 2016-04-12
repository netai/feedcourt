feedcourt.run(function($http,$rootScope,$window,$location,Auth){
  $http.defaults.headers.common.Accept = "application/json";
  $http.defaults.cache = true;

  $rootScope.$on('$routeChangeStart',function(event,current,previous,rejection){
    $rootScope.loading = true;
    $window.loggedIn = Auth.isLoggedIn();
    if(!$window.loggedIn){
      $location.path('/login');
    }
  });

  $rootScope.$on('$routeChangeSuccess',function(event,current,previous,rejection){
    $rootScope.loading = false;
  });

  $rootScope.$on('$routeChangeError',function(event,current,previous,rejection){
    $location.path('/error');
  });
});
