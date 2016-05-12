angular.module('MainApp')
	.controller('LoaderCtrl', function($scope, $rootScope){

		$scope.onDropComplete = function(data){

			console.log('onDropComplete');
			console.log(data);			
		}

		$scope.onPrimaryDropComplete = function(data){

			console.log('onPrimaryDropComplete');
			console.log(data);
		}
	});