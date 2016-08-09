/**
 * Angualr.js controllers.
 * @module client
 * @submodule Controllers
 */

/**
 * A controller that serves the delete zone
 * (where all the Drag&Drop objects can be dropped)
 * in the footer of  <code>index.html</code> view.
 * @class DeleteZoneCtrl
 */
angular.module('MainApp')
	.controller('DeleteZoneCtrl', function($scope, $rootScope){

		/**
		* A <b>local scope</b> method tha removes 
		* a dropped object from the list of objects
		* of its type.
		* <br/>
		* Dropped objects could be:
		* - normal fields
		* - timestamp fields
		* - DC.js or Canvas.js charts
		* - movable charts
		* @method onDropRemove
		* @param data A dropped object 
		*/
		$scope.onDropRemove = function(data){

			//if it is a field
			if (data.field && data.store && data.source){

				//timestamp field
				if (data.field.format !== undefined){

					//delete timestamp field
					var index = $rootScope.droppedTSFields.indexOf(data);
					if (index > -1){

						$rootScope.droppedTSFields.splice(index, 1);
					}
				}
				else{
					
					var index = $rootScope.droppedFields.indexOf(data);
					if (index > -1){

						$rootScope.droppedFields.splice(index, 1);
					}
				}

				//clear the dataset
				if ($rootScope.dataset !== undefined && data.field.status === 'loaded' && $rootScope.loaded){

					//delete the dataset
					delete $rootScope.dataset;
					$rootScope.dataset = [];

					//mark all fields as ready (=not loaded)
					data.field.status = 'ready';
					$rootScope.droppedTSFields.forEach(function(field_conf, index){field_conf.field.status = 'ready';});
					$rootScope.droppedFields.forEach(function(field_conf, index){field_conf.field.status = 'ready';});

					//mark the dataset as not loaded
					$rootScope.loaded = false;

					//clear stats&options
					$rootScope.setStats(null);

					//claer movable charts
					$rootScope.chartFields = [];
				}
			}
			//charts
			else{
				
				//DC.js or Canvas.js charts
				if (data.id !== undefined){

					var index = $rootScope.droppedCharts.indexOf(data);
					if (index > -1){

						$rootScope.droppedCharts.splice(index, 1);
					}
				}
				//movable charts
				else{

					for (var i=0; i<$rootScope.chartFields.length; i++){

						if ($rootScope.chartFields[i].chart === data.chart){

							$rootScope.chartFields.splice(i, 1);
							i--;
						}
					}
				}
			}
		}


		/**
		* A <b>local scope</b> method that fires 
		* when the delete zone (placed in the footer of <code>index.html</code>)
		* is clicked.
		* <br/>
		* It clears all the Drag&Drop objects from
		* their respective lists.
		* It also deletes a loaded dataset.
		* @method clearAll
		*/
		$scope.clearAll = function(){

			//delete dataset
			delete $rootScope.dataset;
			$rootScope.dataset = [];

			//dropped fields on the loader were not clonned
			$rootScope.droppedFields.forEach(function(field_conf, index){field_conf.field.status = 'ready';});

			//clear all the droppable objects
			$rootScope.droppedCharts = []; //DC charts
			$rootScope.chartFields = []; //movable charts
			$rootScope.droppedTSFields = []; //timestamp fields
			$rootScope.droppedFields = []; //fields

			//clear stats&options
			$rootScope.setStats(null);
		}
	});