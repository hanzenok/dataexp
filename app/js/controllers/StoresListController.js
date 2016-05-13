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
					
					//process each field information
					data.forEach(function(field, index){

						//dataset is not loaded yet
						field.status = 'ready';

						//check the field name
						field.html={};
						field.html.name = (field.name.length > 6) ? field.name.slice(0,6) + '..' : field.name;
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