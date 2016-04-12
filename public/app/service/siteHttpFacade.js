feedcourt.factory("siteHttpFacade",function($http){
  var _getCars = function(){
    return $http.get("/cars");
  };

  var _getCar = function(id){
    return $http.get("/car/"+id);
  };

  var _saveCar = function(car){
    return $http.post("/cars",car);
  };

  var _deleteCar = function(id){
    return $http.delete("/car/"+id);
  };

  return {
    getCars: _getCars,
    getCar: _getCar,
    saveCar: _saveCar,
    deleteCar: _deleteCar
  };
});
