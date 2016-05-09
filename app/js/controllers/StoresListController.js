angular.module('MainApp')
	.controller('StoresListController', function($scope, $http, stores){

		stores.promise.then(function(res){

			var stores = res.data;
			stores.forEach(function(store, index, array){
				store.wanted = false;
			});
			$scope.stores = stores;
		});

		$scope.test = function(store) {

			var wanted_stores = [];
			$scope.stores.forEach(function(store, index, array){

				if (store.wanted){

					wanted_stores.push(store);
				}
			});

			$http.post("/api/fields", wanted_stores).success(function(data, status) {
				console.log(data);
			});
		};

	});