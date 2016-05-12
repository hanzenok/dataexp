angular.module('MainApp')
	.controller('StoresListController', function($scope, $http, stores){

		$scope.fields = [];

		//get all the stores from the provider
		$scope.stores = stores.data;

		//get the states of all the checkboxes
		//triggers the 
		$scope.refreshStores = function() {

			//sort the stores
			var wanted_stores = [];
			$scope.stores.forEach(function(store, index, array){

				if (store.wanted){

					wanted_stores.push(store);
				}
			});

			//trigger the fields list
			if (wanted_stores.length){
				
				//get the fields of wanted stores from server
				$http.post("/api/fields", wanted_stores).success(function(data, status) {
					
					$scope.fields = data;

				}).error(function(err, status){

					throw new Error(err);
				});
			}
			else{
				$scope.fields = [];
			}
		};

		$scope.loadFields = function(){

			console.log($scope.fields);
		}

	});