angular.module('MainApp')
	.service('DatasetService', function($resource){
		
		var res = $resource('/api/dataset', {}, 
			{
				post: {method: 'POST', isArray: true}
			}
		);

		this.post = function(fields, success_cb, error_cb){

			res.post(fields, success_cb, error_cb);
		}

	});