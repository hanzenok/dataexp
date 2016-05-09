angular.module('MainApp')
	.controller('StoresListController', function($scope, stores){

		stores.promise.then(function(res){

			$scope.stores = res.data;
		});

	});