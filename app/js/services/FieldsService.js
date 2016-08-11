/**
 * Angualr.js services.
 * @module client
 * @submodule Services
 */

/**
 * A service that talks
 * to the REST api of the back-end
 * to query the fields.
 * @class FieldsService
 */
angular.module('MainApp')
	.service('FieldsService', function($resource){
		
		var res = $resource('/api/fields', {}, 
			{
				post: {method: 'POST', isArray: true}
			}
		);

		/**
		* A public method that queries the fields
		* present in stores from <code>wanted_stores</code>.
		* @method post
		* @param {array} wanted_stores An array of store configurations to determine their fields
		* @param {callback} succes_cb Success callback with fields
		* @param {callback} error_cb Error callback
		*/
		this.post = function(wanted_stores, success_cb, error_cb){

			res.post(wanted_stores, success_cb, error_cb);
		}

	});