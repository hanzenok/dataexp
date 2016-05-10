angular.module('MainApp')
	.service('sources', function($http, $resource){
		
		//sources list for controller
		this.data = $resource('/api/sources').query();

	});