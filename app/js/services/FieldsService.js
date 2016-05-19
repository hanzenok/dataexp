angular.module('MainApp')
	.service('FieldsService', function($resource){
		
		var res = $resource('/api/fields', {}, 
			{
				post: {method: 'POST', isArray: true}
			}
		);

		this.post = function(wanted_stores, success_cb, error_cb){

			res.post(wanted_stores, success_cb, error_cb);
		}

	});