angular.module('MainApp')
	.service('SourcesService', function($resource){
		
		this.getData = function(){

			return $resource('/api/sources').query();
		}

	});