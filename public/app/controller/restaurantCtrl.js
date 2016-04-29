feedcourt.controller("restaurantCtrl",function(slugIdentity,$rootScope,$scope,$routeParams,$location,Auth,restaurantsHttpFacade){
  var restaurantCtrl = this;
    function init(){
      if(slugIdentity=='restaurants'){
        restaurantsHttpFacade.getRestaurants().
        success(function(data,status,headers,config){
          $scope.restaurants=data;
          })
          .error(function(data,status,headers,config){
            console.log("Internal Server Error.");
          });
      }else if(slugIdentity=='foodcourt_restaurants'){
        var ID=$routeParams.id;
        restaurantsHttpFacade.getFoodcourtRestaurants(ID).
        success(function(data,status,headers,config){
          $scope.restaurants=data;
          })
          .error(function(data,status,headers,config){
            console.log("Internal Server Error.");
          });
      }
    }
    init();
    restaurantCtrl.changeStatus = function(restaurant){
      restaurant.status = restaurant.status==1?0:1;
      restaurantsHttpFacade.changeStatus(restaurant).
      success(function(){

        })
        .error(function(data,status,headers,config){
          console.log("Internal Server Error.");
        });
    }
    restaurantCtrl.viewDetail = function(restaurant){
      restaurantCtrl.restaurantDetail = restaurant;
    }
});
