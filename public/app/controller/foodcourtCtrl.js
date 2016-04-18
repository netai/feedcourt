feedcourt.controller("foodcourtCtrl",function($rootScope,$scope,$location,Auth,foodcourtsHttpFacade){
  var foodcourtCtrl = this;
  function init(){
    if($location.path()=='/foodcourts')
    {
      foodcourtsHttpFacade.getFoodcourts().
      success(function(data,status,headers,config){
        $scope.foodcourts=data.data;
        })
        .error(function(data,status,headers,config){
          console.log("Internal Server Error.");
        });
    }
  }
  init();
  foodcourtCtrl.changeStatus = function(foodcourt){
    foodcourt.status = foodcourt.status==1?0:1;
    foodcourtsHttpFacade.changeStatus(foodcourt).
    success(function(){

      })
      .error(function(data,status,headers,config){
        console.log("Internal Server Error.");
      });
  }
});