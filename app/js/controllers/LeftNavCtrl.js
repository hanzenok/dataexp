/**
 * Angualr.js controllers.
 * @module client
 * @submodule Controllers
 */

/**
 * A controller that serves all the left panel
 * in the <code>index.html</code> view.
 * <br/>
 * It uses three custom angular services:
 * - <b>SourcesService</b>: deals with getting/sendig/adding/deleting sources from/to/to/from the backend
 * - <b>StoresService</b>: deals with getting stores from the backend
 * - <b>FieldsService</b>: deals with getting fields from the backend
 * @class LeftNavCtrl
 */
angular.module('MainApp')
	.controller('LeftNavCtrl', function($scope, $rootScope, $mdDialog, $mdToast, SourcesService, StoresService, FieldsService){

		$rootScope.stores_conf = []; //stores configs container
		$rootScope.fields_conf = []; //fields configs container
		//sources configs are loaded by the $rootScope.loadSources() method

		/**
		* A <b>root scope</b> method that is used by 
		* <b>$rootScope.loadStores()</b> to add the store configs from
		* the <code>stores_conf</code> to the <code>$rootScope.stores_conf</code> list.
		* @method addStores
		* @param {json array} stores_conf A list of store configs to add to the <code>$rootScope.stores_conf</code> list
		*/
		$rootScope.addStores = function(stores_conf){

			stores_conf.forEach(function(store_conf, index){

				$rootScope.stores_conf.push(store_conf);
			});
		}

		/**
		* A <b>root scope</b> method that removes the store configs
		* that are part of source config <code>source_conf</code> from the
		* <code>$rootScope.sources_conf</code> list.
		* @method removeStores
		* @param {json} source_conf Source config whoose store configs should be removed from the <code>$rootScope.sources_conf</code> list
		*/
		$rootScope.removeStores = function(source_conf){

			//get the indexes and clear the fields
			var indexes = [];
			$rootScope.stores_conf.forEach(function(store_conf, index){

				if (store_conf.source.name === source_conf.source.name){
					
					$rootScope.removeFields(store_conf);
					indexes.push(index);
				}
			});

			//remove sources
			indexes.forEach(function(index, i){

				$rootScope.stores_conf.splice(index - i, 1);
			});
		}

		/**
		* A <b>root scope</b> method that clears the 
		* <code>$rootScope.stores_conf</code> list.
		* @method clearStores
		*/
		$rootScope.clearStores = function(){

			$rootScope.stores_conf = [];
		}

		/**
		* A <b>root scope</b> method that is used by 
		* <b>$rootScope.loadFields()</b> to add the field configs from
		* the <code>fields_conf</code> to the <code>$rootScope.fields_conf</code> list.
		* @method addFields
		* @param {json array} fields_conf A list of field configs to add to the <code>$rootScope.fields_conf</code> list
		*/
		$rootScope.addFields = function(fields_conf){

			fields_conf.forEach(function(field_conf, index){

				$rootScope.fields_conf.push(field_conf);
			});
		}

		/**
		* A <b>root scope</b> method that removes the field configs
		* that are part of store config <code>store_conf</code> from the
		* <code>$rootScope.fields_conf</code> list.
		* @method removeFields
		* @param {json} store_conf Store config whoose field configs should be removed from the <code>$rootScope.fields_conf</code> list
		*/		
		$rootScope.removeFields = function(store_conf){

			//get the indexes
			var indexes = [];
			$rootScope.fields_conf.forEach(function(field_conf, index){

				if (field_conf.store.name === store_conf.store.name)
					indexes.push(index);
			});

			//remove sources
			indexes.forEach(function(index, i){

				$rootScope.fields_conf.splice(index - i, 1);
			});	
		}

		/**
		* A <b>root scope</b> method that clears the 
		* <code>$rootScope.fields_conf</code> list.
		* @method clearFields
		*/
		$rootScope.clearFields = function(){

			$rootScope.fields_conf = [];
		}

		/**
		* A <b>root scope</b> method that is 
		* using a <b>SourcesService</b> service to query
		* a list of source configs from the back-end and
		* loads it to the <code>$scope.sources_conf</code>
		* @method loadSources
		*/
		$rootScope.loadSources = function(){

			//show the progress bar
			$rootScope.showPB(true);

			//loading
			SourcesService.query(
				function(sources_conf){

					//set source configs
					$scope.sources_conf = sources_conf;
					$rootScope.showPB(false);
				},
				function(err){

					$rootScope.showPB(false);
					if (!err.data) err.data = 'Server is unreachable';
					
					$mdToast.show(

						$mdToast.simple()
							.textContent(err.data)
							.action('OK')
							.position('bottom')
							.hideDelay(4000)
					);
				}
			);
		}

		//automatically load the sources
		$rootScope.loadSources();

		/**
		* A <b>root scope</b> method that is using
		* the <b>StoresServie</b> service to query
		* a list of store configs that are part 
		* of the source config <code>source_conf</code>.
		* Then by using the <b>$rootScope.addStores()</b> method
		* it adds them to the <code>$rootScope.stores_conf</code>.
		* @method loadStores
		* @param {json} source_conf A source config whoose stores configs should be loaded
		*/
		$rootScope.loadStores = function(source_conf){

			if (source_conf.source.wanted){

				//show the progress bar
				$rootScope.showPB(true);

				//load a store
				//input is an array of sources
				StoresService.post([source_conf], 
					function(stores_conf){

						//add a short store name
						var store_name;
						stores_conf.forEach(function(store_conf, index){

							store_name = store_conf.store.name;
							store_conf.store.short = (store_name.length > 15) ? store_name.slice(0,15) + '..' : store_name;
						});

						//add to the stores list
						$rootScope.addStores(stores_conf);
						$rootScope.showPB(false);

					},
					function(err){

						$rootScope.showPB(false);
						if (!err.data) err.data = 'Server is unreachable';

						$mdToast.show(
							$mdToast.simple()
								.textContent(err.data)
								.action('OK')
								.position('bottom')
								.hideDelay(4000)
						);
					}
				);
			}else{

				$rootScope.removeStores(source_conf);
			}

		}

		/**
		* A <b>local scope</b> method that returns
		* a formatted name of the type of source specified
		* by <code>source_conf</code>.
		* @method getSourceType
		* @param {json} source_conf A source config to get the type from
		* @return {string} A type name
		*/
		$scope.getSourceType = function(source_conf){

			var types = {

				mongo: 'MongoDB',
				mysql: 	'MySQL',
				json: 'JSON',
				csv: 'CSV'
			};

			return types[source_conf.source.type];
		}

		//dialog to modify the source
		/**
		* A <b>local scope</b> method that launches
		* a dialog to modify a source config.
		* <br/>
		* The template used by dialog is <code>AddSource.html</code>.
		* @method modifySource
		* @param event Event
		* @param {json} source_conf A source config to modify
		*/
		$scope.modifySource = function(event, source_conf){

			//used to pass data to the 
			//DialogController
			var shareSourceCtrl = function ($scope, source_conf) {

				$scope.source_conf = source_conf;
			}

			$mdDialog.show({

				templateUrl: '../../templates/AddSource.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: true,
				controller: shareSourceCtrl,
				locals: {'source_conf': source_conf}
			});
		};

		/**
		* A <b>local scope</b> method that is using 
		* a <code>FieldsService</code> service to query
		* a list of field config that are part of the 
		* store config <code>store_config</code>.
		* Then by using the <b>$rootScope.addFields()</b> method
		* it adds them to the <code>$scope.fields_conf</code>.
		* @method loadFields
		* @param {json} store_conf A store config whoose field configs should be loaded into <code>$scope.fields_conf</code>
		*/
		$scope.loadFields = function(store_conf) {

			if (store_conf.wanted){

				//launch the progress bar
				$rootScope.showPB(true);

				//load the stores fields
				FieldsService.post([store_conf], 
					function(fields_conf){

						//process each field
						fields_conf.forEach(function(field_conf, index){

							//dataset is not loaded yet
							field_conf.field.status = 'ready';

							//check the field name
							field_conf.field.short = (field_conf.field.name.length > 6) ? field_conf.field.name.slice(0,6) + '..' : field_conf.field.name;
						});

						//add the fields to the list
						$rootScope.addFields(fields_conf);
						$rootScope.showPB(false);

					});

			}
			else{

				$rootScope.removeFields(store_conf);
			}

		};

		/**
		* A <b>local scope</b> method that is 
		* called by clicking on the 'clear all' link
		* on the left panel. It clears all the 
		* choosen sources, stores and fields.
		* @method clear
		*/
		$scope.clear = function(){

			//set the sources as unwanted
			$scope.sources_conf.forEach(function(source_conf, index){

				source_conf.source.wanted = false;
			});

			//clear stores and fields list
			$rootScope.clearStores();
			$rootScope.clearFields();
		}

	})