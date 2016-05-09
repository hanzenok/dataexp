angular.module('MainApp')
	.service('stores', function($http){

		this.promise = $http.get('/api/stores');

	});