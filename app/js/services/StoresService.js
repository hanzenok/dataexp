/**
 * Angualr.js services.
 * @module client
 * @submodule Services
 */

/**
 * A service that talks
 * to the REST api of the back-end
 * to query the stores.
 * @class StoresService
 */
angular.module('MainApp')
	.service('StoresService', function($resource){

		var res = $resource('/api/stores', {}, 
			{
				post: {method: 'POST', isArray: true}
			}
		);

		/**
		* A public method that queries the stores
		* present in sources from <code>wanted_sources</code>.
		* @method post
		* @param {array} wanted_sources An array of source configurations to determine their stores
		* @param {callback} succes_cb Success callback with stores
		* @param {callback} error_cb Error callback
		*/
		this.post = function(wanted_sources, success_cb, error_cb){

			res.post(wanted_sources, success_cb, error_cb);
		}

	});