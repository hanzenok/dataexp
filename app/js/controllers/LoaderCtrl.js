angular.module('MainApp')
	.controller('LoaderCtrl', function($scope, $rootScope, $mdDialog, $http){

		//containers
		$rootScope.droppedFields = [];//dropped fields container
		$rootScope.droppedTSFields = []; //dropped primary fields container

		//a field dropped
		$scope.onDropComplete = function(data){

			var index = $rootScope.droppedFields.indexOf(data);
			if (index == -1){

				$rootScope.droppedFields.push(data);
			}		
		};

		//a primary field dropped
		$scope.onTSDropComplete = function(data){

			var index = $rootScope.droppedTSFields.indexOf(data);
			if (index == -1){

				//ask the format of the timestamp field
				$mdDialog.show({
					templateUrl: '../../templates/SaveFormat.html',
					parent: angular.element(document.body),
					clickOutsideToClose: true
				}).then(function(answer){

					data.format = answer;
					console.log(data);
				});

				$rootScope.droppedTSFields.push(data);
			}	
		};

		//load one merged dataset
		$scope.load = function(){

			//compose all the fields that needs to be downloaded into one
			var all_fields = [$rootScope.droppedTSFields, $rootScope.droppedFields];

			//send them to the server
			$http.post("/api/dataset", all_fields).success(function(data, status) {
				console.log(data);

			}).error(function(err, status){

				throw new Error(err);
			});

		};
	});