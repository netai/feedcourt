feedcourt.controller("siteCtrl",function($rootScope,$location,Auth){
  var siteCtrl = this;
  siteCtrl.error = '';

  siteCtrl.doLogin = function(){
    siteCtrl.processing = true;
    siteCtrl.error = '';
    Auth.login(siteCtrl.loginData.email,siteCtrl.loginData.password)
      .success(function(data){
        siteCtrl.processing = false;
        if(data.status == 'success'){
          $location.path('/');
        } else {
          siteCtrl.error = data.message;
        }
      });
  }

  siteCtrl.doLogout = function(){
    Auth.logout();
    $location.path('/logout');
  }
});
