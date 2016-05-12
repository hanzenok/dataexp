angular.module('MainApp')
	.controller('LoaderCtrl', function($scope, $rootScope){

		$rootScope.droppedFields = [];//dropped fields container
		$rootScope.droppedPrimaryFields = []; //dropped primary fields container

		//a field dropped
		$scope.onDropComplete = function(data){

			var index = $rootScope.droppedFields.indexOf(data);
			if (index == -1){

				$rootScope.droppedFields.push(data);
			}		
		}

		//a primary field dropped
		$scope.onPrimaryDropComplete = function(data){

			var index = $rootScope.droppedPrimaryFields.indexOf(data);
			if (index == -1){

				$rootScope.droppedPrimaryFields.push(data);
			}	
		}
	});