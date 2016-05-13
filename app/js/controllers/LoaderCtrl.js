angular.module('MainApp')
	.controller('LoaderCtrl', function($scope, $rootScope, $mdDialog, $http, $mdToast){

		//containers
		$rootScope.droppedFields = [];//fields that are dropped to the loader
		$rootScope.droppedTSFields = []; //timestamp fields that are dropped to the loader
		$rootScope.chartFields = []; //loaded fields that are dropped to any chart

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

				//mark all the fields as loaded
				all_fields.forEach(function(fields, index){
					
					fields.forEach(function(field, index){
						field.loaded = true;
					});

				});

				//console.log(data);
				$rootScope.dataset = data;

			}).error(function(err, status){

				$mdToast.show(
					$mdToast.simple()
						.textContent(err)
						.action('OK')
						.position('bottom')
						.hideDelay(4000)
				);
			});

		};

		$scope.getLoaded = function(){

			if($rootScope.dataset)
				return 'loaded';
			else
				return '';
		}
	});