angular.module('MainApp')
	.controller('StoresListController', function($scope, $http, stores){

		//get all the stores from the server
		stores.promise.then(function(res){

			var stores = res.data;
			stores.forEach(function(store, index, array){
				store.wanted = false;
			});
			$scope.stores = stores;

			console.log('res.data:');
			console.log(res.data);
		});

		//get the states of all the checkboxes
		//triggers the 
		$scope.refreshStores = function() {

			stores.promise.then(function(res){

				console.log('test: ');
				var stores = res.data;
				stores.forEach(function(store, index, array){
					console.log(store);
				});
			});

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
					
					$scope.stores_with_fields = data;

				}).error(function(err, status){

					throw new Error(err);
				});
			}
			else{
				$scope.stores_with_fields = [];
			}
		};

	});