angular.module('MainApp')
	.service('SourcesService', function($resource){
		
		this.getRes= function(){

			return $resource('/api/sources');
		}

	});