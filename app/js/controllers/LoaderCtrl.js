angular.module('MainApp')
	.controller('LoaderCtrl', function($scope, $rootScope, $mdDialog){

		$rootScope.droppedFields = [];//dropped fields container
		$rootScope.droppedTSFields = []; //dropped primary fields container

		//a field dropped
		$scope.onDropComplete = function(data){

			var index = $rootScope.droppedFields.indexOf(data);
			if (index == -1){

				$rootScope.droppedFields.push(data);
			}		
		}

		//a primary field dropped
		$scope.onTSDropComplete = function(data){

			var index = $rootScope.droppedTSFields.indexOf(data);
			if (index == -1){

				//ask the format of the timestamp field
				$mdDialog.show({
					templateUrl: '../../templates/AddFormat.html',
					parent: angular.element(document.body),
					clickOutsideToClose: true
				});

				$rootScope.droppedTSFields.push(data);
			}	
		}
	});