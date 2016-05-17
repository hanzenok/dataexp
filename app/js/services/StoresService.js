angular.module('MainApp')
	.service('StoresService', function($resource){
		
		this.getRes = function(){

			return $resource('/api/stores');

		}

	});