/**
 * Angualr.js controllers.
 * @module client
 * @submodule Services
 */

/**
 * A service that talks
 * to the REST api of the back-end
 * to query, modify, send, delete sources.
 * @class SourcesService
 */
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

		/**
		* A method that queries all the sources
		* from the back-end.
		* @method query
		* @param {callback} succes_cb Success callback with sources
		* @param {callback} error_cb Error callback
		*/
		this.query = function(success_cb, error_cb){

			res.query(success_cb, error_cb);
		}

		/**
		* A method that pushes the sources
		* <code>source_conf</code> to the back-end.
		* @method send
		* @param {json} source_conf A source configuration to add to the back-end
		* @param {callback} succes_cb Success callback
		* @param {callback} error_cb Error callback
		*/
		this.send = function(source_conf, success_cb, error_cb){

			//adding a new source
			if (!source_conf.data) source_conf.source.isNew = true;

			res.post(source_conf, success_cb, error_cb);

		}

		/**
		* A method that deletes the source with the name
		* <code>source_name</code> from the back-end.
		* @method delete
		* @param {json} source_name A name of the source to be deleted from the back-end
		* @param {callback} succes_cb Success callback
		* @param {callback} error_cb Error callback
		*/
		this.delete = function(source_name, success_cb, error_cb){

			res2.delete({source_name: source_name}, success_cb, error_cb);
		}

		/**
		* A method that modifies an existing
		* source configuration in the back-end.
		* @method modify
		* @param {json} source_conf A new source configuration
		* @param {callback} succes_cb Success callback
		* @param {callback} error_cb Error callback
		*/
		this.modify = function(source_conf, success_cb, error_cb){

			//modifying an existing source
			source_conf.source.isNew = false;
			source_conf.source.wanted = false;

			res.post(source_conf, success_cb, error_cb);
		}

	});