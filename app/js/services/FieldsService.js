angular.module('MainApp')
	.service('FieldsService', function($resource){
		
		this.getRes = function(){

			var res = $resource('/api/fields', {}, 
				{
					post: {method: 'POST', isArray: true}
				}
			);

			return res;

		}

	});