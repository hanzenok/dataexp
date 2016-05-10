angular.module('MainApp')
	.service('stores', function($http, $resource){

		this.promise = $http.get('/api/stores');

	});