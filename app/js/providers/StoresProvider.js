angular.module('MainApp')
	.service('stores', function($resource){
		
		this.data = $resource('/api/stores').query();

	});