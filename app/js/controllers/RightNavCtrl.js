/**
 * Angualr.js controllers.
 * @module client
 * @submodule Controllers
 */

/**
 * A controller that serves all the 
 * right panel in the <code>index.html</code> view.
 * @class RightNavCtrl
 */
angular.module('MainApp')
	.controller('RightNavCtrl', function($scope, $rootScope, $mdDialog){

		//used to monitor with 
		//oversized datasets
		$rootScope.max_size = 3000;
		$rootScope.size_status = 'normal';

		//stats
		$scope.homogen = '?';
		$scope.size = '?';
		$scope.per_day = '?';

		//options
		$scope.transform_type = 'interp';
		$scope.interp_type = 'linear';
		$scope.reduc_type = 'skip';
		$scope.reduc_size = 1;
		$scope.target_field = '';
		$scope.from_date = null;
		$scope.to_date = null;
		$scope.count_negative = false;
		$scope.max_coef = true;
		$scope.tsfield_quantum_size = 0;
		$scope.tsfield_quantum = 'none';

		//dates switcher
		$scope.enableDates = false;

		//returns the current config
		/**
		* A <b>root scope</b> method, that
		* collects all the choosen options
		* from the right panel in 
		* the <code>index.html</code>, and returns them 
		* compacted into one json
		* @method getOptions
		* @return {json} All the options from the right panel
		*/
		$rootScope.getOptions = function(){

			//config json
			var config = {};

			//transformation type
			config.transform = {};
			config.transform.type = $scope.transform_type;
			if ($scope.transform_type === 'interp')
				config.transform.interp_type = $scope.interp_type;

			//reduction type
			config.reduction = {};
			config.reduction.type = $scope.reduc_type;
			config.reduction.size = $scope.reduc_size;
			config.reduction.target_field = $scope.target_field;

			//date borders
			config.date_borders = {};
			config.date_borders.from = {};
			config.date_borders.to = {};
			if ($scope.enableDates && $scope.from_date && $scope.to_date){

				config.date_borders.from.date = new Date($scope.from_date).toString();
				config.date_borders.to.date = new Date($scope.to_date).toString();
			}
			else{

				config.date_borders.from.date = '';
				config.date_borders.to.date = '';
			}

			//correlation detection options
			if ($scope.toogled_correlation){

				config.correlation = {};
				config.correlation.count_negative = $scope.count_negative;
				config.correlation.max_coef = $scope.max_coef;
			}
			else{
				config.correlation = null;
			}

			//quantification options
			config.tsfield_quantum = $scope.tsfield_quantum;

			return config;

		}

		//shows the stats
		$rootScope.setStats = function(config){

			if (!config){

				$scope.size = '?';
				$rootScope.size_status = 'normal';
				$scope.per_day = '?';
				$scope.homogen = '?'
				$scope.size = '?';
				$scope.per_day = '?';
				$scope.transform_type = 'interp';
				$scope.interp_type = 'linear';
				$scope.reduc_type = 'skip';
				$scope.reduc_size = 1;
				$scope.target_field = '';
				$scope.from_date = null;
				$scope.to_date = null;
				$scope.count_negative = false;
				$scope.max_coef = true;

				return;
			}

			//size
			$scope.size = (config.size) ? config.size : '?';
			$rootScope.size_status = ($scope.size > $rootScope.max_size) ? 'overflow' : 'normal';

			//instances per day
			$scope.per_day = (config.per_day) ? config.per_day.toFixed(5) : '?';

			//homogenity
			if (config.homogen)
				$scope.homogen = 'yes';
			else
				$scope.homogen = 'no';

			//setting the dates
			$scope.from_date = new Date(config.from);
			$scope.to_date = new Date(config.to);

		}

		//target field for the reduction
		$scope.target_field = '';
		$scope.onDroppedField = function(data){

			//if it is not a timestamp field
			if (!data.format){

				//real target field
				$scope.target_field = data.field.name;
			}
		}


		//show a tips alert
		$scope.showAlert = function(ev){

			$mdDialog.show({

				templateUrl: '../../templates/Alert.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
			});
		};

		/*left here because it could be useful*/
		//done like this because of the
		//event propagation
		//used with 'ng-click="toogleDates($event)"'
		/*$scope.toogleDates = function(event){

			$scope.enableDates = !$scope.enableDates;

			//http://stackoverflow.com/questions/20300866/angularjs-ng-click-stoppropagation
			event.stopPropagation();
		}*/

		//done this way to fix
		//the options when correlation disabled
		$scope.$watch('toogled_correlation', function(){

			if (!$scope.toogled_correlation){

				$scope.count_negative = false;
				$scope.max_coef = true;
			}
		});

		//desactivate the correlation detection
		//if Canvas.js is forced
		$rootScope.$watch('force_canvasjs', function(){

			if ($rootScope.force_canvasjs){

				$scope.toogled_correlation = false;
			}
		});

		$scope.hide_dataset = false;
		$scope.toggleDataset = function(){

			$scope.hide_dataset = !$scope.hide_dataset;

			$scope.hide_trans = $scope.hide_dataset;
			$scope.hide_redu = $scope.hide_dataset;
			$scope.hide_dates = $scope.hide_dataset;
			$scope.hide_quant = $scope.hide_dataset;
		};

	})