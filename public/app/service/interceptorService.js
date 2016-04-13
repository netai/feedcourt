feedcourt.factory('httpTimestampInterceptor',function(){
  return{
    'request':function(config){
      var timestamp = Date.now();
      config.url = config.url+"?x="+timestamp;
      return config;
    }
  }
});

feedcourt.factory('httpUnauthorizedInterceptor',function($q,$rootScope){
  return{
    'responseError':function(rejection){
      if(rejection.status===401){
        $rootScope.login = true;
      }
      return $q.reject(rejection);
    }
  }
});

feedcourt.factory('AuthInterceptor', function($q,$location, AuthToken){
  return {
    'request': function(config){
      var token = AuthToken.getToken();
      if(token){
        config.headers['x-access-token'] = token;
      }
      return config;
    },
    'responseError': function(response){
      if(response.status == 403){
        $location.path('/login');
      }
      return $q.reject(response);
    }
  };
});
