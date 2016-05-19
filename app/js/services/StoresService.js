angular.module('MainApp')
	.service('StoresService', function($resource){

		var res = $resource('/api/stores', {}, 
			{
				post: {method: 'POST', isArray: true}
			}
		);

		this.post = function(wanted_sources, success_cb, error_cb){

			res.post(wanted_sources, success_cb, error_cb);
		}

	});