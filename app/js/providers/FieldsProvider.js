angular.module('MainApp')
	.service('fields', function($http){

		this.promise = $http.get('/api/fields');

	});