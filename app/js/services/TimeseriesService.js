angular.module('MainApp')
	.service('TimeseriesService', function($resource){
		
		var res = $resource('/api/timeseries', {}, 
			{
				post: {method: 'POST', isArray: true}
			}
		);

		var res2 = $resource('/api/stats');

		this.post = function(fields, success_cb, error_cb){

			res.post(fields, success_cb, error_cb);
		}

		this.stats = function(success_cb){

			res2.query(success_cb);
		}
	});