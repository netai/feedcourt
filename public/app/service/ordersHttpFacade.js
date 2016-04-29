feedcourt.factory("ordersHttpFacade",function($http,feedcourtConstant){
  var _getOrders = function(){
    return $http.get("/api/"+feedcourtConstant.v_1_api+"/orders");
  };
  var _changeStatus= function(order){
    return $http.put("/api/"+feedcourtConstant.v_1_api+"/order/changestatus",order);
  };
  var _getRestaurantOrders= function(restaurant_id){
    return $http.get("/api/"+feedcourtConstant.v_1_api+"/restaurant/orders/"+restaurant_id);
  };
  return {
    getOrders: _getOrders,
    changeStatus:_changeStatus,
    getRestaurantOrders:_getRestaurantOrders
  };
});
