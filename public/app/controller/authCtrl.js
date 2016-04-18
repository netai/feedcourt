feedcourt.controller("authCtrl",function($rootScope,$scope,$location,Auth){
  var authCtrl = this;
  authCtrl.error = '';
  authCtrl.processing = false;

  authCtrl.doLogin = function(){
    authCtrl.processing = true;
    authCtrl.error = '';
    Auth.login(authCtrl.loginData.email,authCtrl.loginData.password)
      .success(function(data){
        authCtrl.processing = false;
        if(data.status == 'success'){
          $location.path('/dashboard');
        } else {
          authCtrl.error = '* Wrong email/password';
        }
      });
  }

  authCtrl.doLogout = function(){
    Auth.logout();
    $location.path('/logout');
  }
});
