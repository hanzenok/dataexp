angular.module('MainApp')
	.service('DatasetService', function($resource){
		
		this.getRes = function(){

			var res = $resource('/api/dataset', {}, 
				{
					post: {method: 'POST', isArray: true}
				}
			);

			return res;

		}

	});