feedcourt.factory("restaurantsHttpFacade",function($http,feedcourtConstant){
  var _getRestaurants = function(){
    return $http.get("/api/"+feedcourtConstant.v_1_api+"/restaurants");
  };
  var _changeStatus= function(restaurant){
    return $http.put("/api/"+feedcourtConstant.v_1_api+"/restaurants/changestatus",restaurant);
  };
  return {
    getRestaurants: _getRestaurants,
    changeStatus:_changeStatus
  };
});
