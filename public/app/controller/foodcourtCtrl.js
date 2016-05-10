feedcourt.controller("foodcourtCtrl",function(slugIdentity,$rootScope,$scope,$routeParams,$location,Auth,foodcourtsHttpFacade,AuthToken){
  var foodcourtCtrl = this;

  function init(){
    if(slugIdentity=='foodcourts'){
      foodcourtsHttpFacade.getFoodcourts().
      success(function(data,status,headers,config){
        $scope.foodcourts=data;
        })
        .error(function(data,status,headers,config){
          console.log("Internal Server Error.");
        });
    }
    else if(slugIdentity == 'foodcourtAdd'){
      foodcourtsHttpFacade.getStateList().
      success(function(data,status,headers,config){
        $scope.states=data;
        })
        .error(function(data,status,headers,config){
          console.log("Internal Server Error.");
        });
        $scope.token = AuthToken.getToken();
    }

  }
  init();

  foodcourtCtrl.getCities = function(stateId){
    foodcourtsHttpFacade.getCityList(stateId).
    success(function(data,status,headers,config){
      $scope.cities=data;
      })
      .error(function(data,status,headers,config){
        console.log("Internal Server Error.");
      });
  },
  foodcourtCtrl.changeStatus = function(foodcourt){
    foodcourt.status = foodcourt.status==1?0:1;
    foodcourtsHttpFacade.changeStatus(foodcourt).
    success(function(){

      })
      .error(function(data,status,headers,config){
        console.log("Internal Server Error.");
      });
  },
  foodcourtCtrl.viewDetail = function(foodcourt){
    foodcourtCtrl.foodcourtDetail = foodcourt;
  },
  foodcourtCtrl.addFoodcourt = function(){
    alert(addFoodcourtForm.dataInput);
    // $scope.response = content; // Presumed content is a json string!

    // foodcourtsHttpFacade.addFoodcourt($scope.dataInput)
    // .success(function(data,status,headers,config){
    //     $scope.addreturn=data;
    //     $scope.dataInput={};
    //   })
    //   .error(function(data,status,headers,config){
    //     console.log("Internal Server Error.");
    //   });
  }






});
