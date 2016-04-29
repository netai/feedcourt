parking.directive("alert",function(){
  return {
    restrict: 'E',
    scope: {
      topic: '@'
    },
    template: '<div class="alert alert-danger alert-dismissible" role="alert">'+
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
              '<strong>{{topic}}</strong> <span data-ng-transclude></span>'+
              '</div>',
    replace: true,
    transclude: true
  };
});
