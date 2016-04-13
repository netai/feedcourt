feedcourt.factory('Auth',function($http,$q,AuthToken){

  var _login = function(email,password){
    return $http.post('/login',{
      email: email,
      password: password
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
