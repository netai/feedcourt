feedcourt.factory("foodcourtsHttpFacade",function($http,feedcourtConstant){
  var _getFoodcourts = function(){
    return $http.get("/api/"+feedcourtConstant.v_1_api+"/foodcourts");
  };
  var _changeStatus= function(foodcourt){
    return $http.put("/api/"+feedcourtConstant.v_1_api+"/foodcourts/changestatus",foodcourt);
  };
  return {
    getFoodcourts: _getFoodcourts,
    changeStatus:_changeStatus
  };
});
