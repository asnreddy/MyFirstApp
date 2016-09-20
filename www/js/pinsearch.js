			
var pinApp = angular.module("pinsearch", [ 'ngResource' ]);

pinApp.controller("PinSearchCtrl", [ '$scope', '$resource','PINCode',
       		function($scope, $resource,PINCode) {			
       			// GET Action Method
       	
       			$scope.zipcode = 500032;
       			$scope.radius = 1000;
       			$scope.search = function(){
       				PINCode.query({}, {zipcode:$scope.zipcode,radius:$scope.radius}, 
       					function(pincodes){
       						$scope.pincodelist = pincodes;
       					}
       				);
       			};
       		} ]);

pinApp.factory('PINCode', function ($resource) {
    return $resource('/pinsearch/:zipcode/:radius',{zipcode: "@zipcode",radius: "@radius" });
});



