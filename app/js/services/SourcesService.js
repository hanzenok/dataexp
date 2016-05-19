angular.module('MainApp')
	.service('SourcesService', function($resource){
		
		var res = $resource('/api/sources', {}, 
			{
				post: {method: 'POST', isArray: true}
			}
		);

		this.query = function(success_cb, error_cb){

			res.query(success_cb, error_cb);
		}

		this.post = function(source_conf, success_cb, error_cb){

			res.post(source_conf, success_cb, error_cb);
		}

	});