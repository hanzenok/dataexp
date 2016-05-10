angular.module('MainApp')
	.service('sources', function($resource){
		
		//sources list for controller
		this.data = $resource('/api/sources').query();

	});