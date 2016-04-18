feedcourt.controller("restaurantCtrl",function($rootScope,$scope,$location,Auth,restaurantsHttpFacade){
  var restaurantCtrl = this;
    function init(){
      if($location.path()=='/restaurants')
      {
        restaurantsHttpFacade.getRestaurants().
        success(function(data,status,headers,config){
          $scope.restaurants=data.data;
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
});
