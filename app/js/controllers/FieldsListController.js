angular.module('MainApp')
	.controller('FieldsListController', function($scope, fields){

		/*fields.promise.then(function(res){

			var stores = res.data;
			$scope.stores = stores;
		});*/
		$scope.stores = fields.data;

	});