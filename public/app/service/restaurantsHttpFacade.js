feedcourt.factory("restaurantsHttpFacade",function($http,feedcourtConstant){
  var _getRestaurants = function(){
    return $http.get("/api/"+feedcourtConstant.v_1_api+"/restaurants");
  };
  var _changeStatus= function(restaurant){
    return $http.put("/api/"+feedcourtConstant.v_1_api+"/restaurants/changestatus",restaurant);
  };
  var _getFoodcourtRestaurants= function(foodcourt_id){
    return $http.get("/api/"+feedcourtConstant.v_1_api+"/foodcourts/restaurants/"+foodcourt_id);
  };
  return {
    getRestaurants: _getRestaurants,
    getFoodcourtRestaurants:_getFoodcourtRestaurants,
    changeStatus:_changeStatus
  };
});
