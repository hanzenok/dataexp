angular.module('MainApp')
	.service('SourcesService', function($resource){
		
		var res = $resource('/api/sources', {}, 
			{
				post: {method: 'POST', isArray: true}
			}
		);

		var res2 = $resource('/api/sources/:source_name', 
			{
				source_name: 'name'
			},
			{
				delete: {method: 'DELETE', isArray: true}
			}
		);

		this.query = function(success_cb, error_cb){

			res.query(success_cb, error_cb);
		}

		this.post = function(source_conf, success_cb, error_cb){

			res.post(source_conf, success_cb, error_cb);
		}

		this.delete = function(source_name, success_cb, error_cb){

			res2.delete({source_name: source_name}, success_cb, error_cb);
		}

	});