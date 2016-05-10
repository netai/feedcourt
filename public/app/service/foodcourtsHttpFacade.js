feedcourt.factory("foodcourtsHttpFacade",function($http,feedcourtConstant){
  var _getFoodcourts = function(){
    return $http.get("/api/"+feedcourtConstant.v_1_api+"/foodcourts");
  };
  var _addFoodcourt = function(dataInput){
    return $http.post("/api/"+feedcourtConstant.v_1_api+"/foodcourts/add",dataInput);
  };
  var _changeStatus = function(foodcourt){
    return $http.put("/api/"+feedcourtConstant.v_1_api+"/foodcourts/changestatus",foodcourt);
  };
  var _getStateList = function(){
    return $http.get("/api/"+feedcourtConstant.v_1_api+"/foodcourts/states");
  };
  var _getCityList = function(stateId){
    return $http.get("/api/"+feedcourtConstant.v_1_api+"/foodcourts/cities/"+stateId);
  };

  return {
    getFoodcourts: _getFoodcourts,
    addFoodcourt: _addFoodcourt,
    getStateList: _getStateList,
    getCityList: _getCityList,
    changeStatus: _changeStatus
  };
});
