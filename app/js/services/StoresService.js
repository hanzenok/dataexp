angular.module('MainApp')
	.service('StoresService', function($resource){
		
		this.getRes = function(){

			var res = $resource('/api/stores', {}, 
				{
					post: {method: 'POST', isArray: true}
				}
			);

			return res;

		}

	});