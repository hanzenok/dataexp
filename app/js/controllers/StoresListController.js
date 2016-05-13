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
					
					//mark all the fields as unloaded
					data.forEach(function(field, index){
						field.status = 'ready';
					});

					$scope.fields = data;

				}).error(function(err, status){

					throw new Error(err);
				});
			}
			else{
				$scope.fields = [];
			}
		};

	});