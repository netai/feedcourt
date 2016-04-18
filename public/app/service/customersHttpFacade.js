feedcourt.factory("customersHttpFacade",function($http,feedcourtConstant){
  var _getCustomers = function(){
    return $http.get("/api/"+feedcourtConstant.v_1_api+"/customers");
  };
  var _changeStatus= function(customer){
    return $http.put("/api/"+feedcourtConstant.v_1_api+"/customers/changestatus",customer);
  };
  return {
    getCustomers: _getCustomers,
    changeStatus:_changeStatus
  };
});
