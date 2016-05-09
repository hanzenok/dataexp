angular.module('MainApp')
	.controller('StoresListController', function($scope, stores){

		stores.promise.then(function(res){

			var stores = res.data;
			stores.forEach(function(store, index, array){
				store.wanted = false;
			});
			$scope.stores = stores;
		});

		$scope.test = function(store) {

			var i,n = $scope.stores.length;
			console.log('===');
			for (i=0; i<n; i++){

				if ($scope.stores[i].wanted)
					console.log($scope.stores[i].name);
			}
			console.log('==');
		};

	});