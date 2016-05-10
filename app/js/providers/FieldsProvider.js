angular.module('MainApp')
	.service('fields', function($http, $rootScope){

		this.promise = $http.get('/api/fields');

		console.log('FiedsProvider: ');
		this.data = $rootScope.stores;

	});