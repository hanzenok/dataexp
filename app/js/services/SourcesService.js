angular.module('MainApp')
	.service('SourcesService', function($resource){
		
		this.getRes = function(){

			var res = $resource('/api/sources', {}, 
				{
					post: {method: 'POST', isArray: true}
				}
			);

			return res;

		}

	});