feedcourt.controller("orderCtrl",function(slugIdentity,$rootScope,$scope,$routeParams,$location,Auth,ordersHttpFacade){
  var orderCtrl = this;
  function init(){
    if(slugIdentity=='orderLists'){
      ordersHttpFacade.getOrders().
      success(function(data,status,headers,config){
        $scope.orders=data;
        })
        .error(function(data,status,headers,config){
          console.log("Internal Server Error.");
        });
      }
      else if(slugIdentity=='restaurantOrders'){
        var ID=$routeParams.id;
        ordersHttpFacade.getRestaurantOrders(ID).
        success(function(data,status,headers,config){
          $scope.orders=data;
          })
          .error(function(data,status,headers,config){
            console.log("Internal Server Error.");
          });
        }
  }
  init();
  orderCtrl.changeStatus = function(order){
    order.status = order.status==1?0:1;
    ordersHttpFacade.changeStatus(order).
    success(function(){

      })
      .error(function(data,status,headers,config){
        console.log("Internal Server Error.");
      });
  }
});
