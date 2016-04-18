feedcourt.factory('Auth',function($http,$q,AuthToken,feedcourtConstant){
  var _login = function(email,password,user_type){
    return $http.post('/api/'+feedcourtConstant.v_1_api+'/login',{
      email: email,
      password: password,
      user_type:user_type
    })
    .success(function(data){
      AuthToken.setToken(data.token);
      return data;
    });
  };

  var _logout = function(){
    AuthToken.setToken();
  };

  var _isLoggedIn = function(){
    if(AuthToken.getToken()){
      return true;
    } else {
      return false;
    }
  };

  return {
    login: _login,
    logout: _logout,
    isLoggedIn: _isLoggedIn
  };
});

feedcourt.factory('AuthToken', function($window){
  var authTokenFactory = {}

  var _getToken = function(){
    return $window.localStorage.getItem('token');
  };

  var _setToken = function(token){
    if(token){
      $window.localStorage.setItem('token',token);
    } else {
      $window.localStorage.removeItem('token');
    }
  };

  return {
    getToken: _getToken,
    setToken: _setToken
  };
});
