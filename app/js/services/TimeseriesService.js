/**
 * Angualr.js services.
 * @module client
 * @submodule Services
 */

/**
 * A service that talks
 * to the REST api of the back-end
 * to query timeseries, <code>tsproc</code> module statistics
 * and configuration.
 * @class TimeseriesService
 */
angular.module('MainApp')
	.service('TimeseriesService', function($resource){
		
		var res = $resource('/api/timeseries', {}, 
			{
				post: {method: 'POST', isArray: true}
			}
		);

		var res2 = $resource('/api/stats');
		var res3 = $resource('/api/config');

		/**
		* A public method that queries the timeseries
		* with the fields specified in the 
		* <code>fields</code> config.
		* @method post
		* @param {array} fields An array of field configurations to be in the timeseries
		* @param {callback} succes_cb Success callback with timeseries
		* @param {callback} error_cb Error callback
		*/
		this.post = function(fields, success_cb, error_cb){

			res.post(fields, success_cb, error_cb);
		}

		/**
		* A public method that queries the 
		* <code>tsproc</code> module 
		* statistics.
		* @method stats
		* @param {callback} succes_cb Success callback with statistics
		*/
		this.stats = function(success_cb){

			res2.query(success_cb);
		}

		/**
		* A public method that queries the 
		* <code>tsproc</code> module 
		* configuration.
		* @method config
		* @param {callback} succes_cb Success callback with config
		*/
		this.config = function(success_cb){

			res3.query(success_cb);
		}
	});