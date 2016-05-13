angular.module('MainApp')
	.service('StoresService', function($resource){
		
		this.getData = function(){

			return $resource('/api/stores').query();

		}

	});