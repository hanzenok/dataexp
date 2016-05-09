angular.module('MainApp')
	.service('sources', function($http){

		this.promise = $http.get('/api/sources');

	});