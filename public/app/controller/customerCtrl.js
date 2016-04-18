feedcourt.controller("customerCtrl",function($rootScope,$scope,$location,Auth,customersHttpFacade){
  var customerCtrl = this;
  function init(){
    if($location.path()=='/customers')
    {
      customersHttpFacade.getCustomers().
      success(function(data,status,headers,config){
          $scope.customers=data.data;
        })
        .error(function(data,status,headers,config){
          console.log("Internal Server Error.");
        });
    }
  }
  init();
  customerCtrl.changeStatus = function(customer){
    customer.status = customer.status==1?0:1;
    customersHttpFacade.changeStatus(customer).
    success(function(){

      })
      .error(function(data,status,headers,config){
        console.log("Internal Server Error.");
      });
  }
});
