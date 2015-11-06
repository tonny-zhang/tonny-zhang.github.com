(function(angular) {
  'use strict';
	var myApp = angular.module('spicyApp1', ['myService']);

	myApp.controller('SpicyController', ['$scope', 'One', function($scope, One) {
	    $scope.spice = 'very';

	    $scope.chiliSpicy = function() {
	        $scope.spice = 'chili';
	    };

	    $scope.jalapenoSpicy = function() {
	        $scope.spice = 'jalape帽o';
	    };

	    console.log(One.get());
	}]);
	myApp.service('Two', [function(){
		return {
			get: function(){
				return 'Two';
			}
		};
	}]);
})(window.angular);