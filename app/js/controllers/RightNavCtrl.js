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

		/**
		* @property max_size
		* @type integer
		* @description A <b>global scope</b> variable
		* that holds the maximal size of the 
		* timeseries accepted by DC.js in order
		* to explore the data interactively.
		*/
		$rootScope.max_size = 300000;

		/**
		* @property size_status
		* @type string
		* @description A <b>global scope</b> variable
		* that holds the state of the timeseries size.
		* It is equal to 'overflow' when the size is bigger
		* than <code>$rootScope.max_size</code> or 'normal'
		* otherwise.
		*/
		$rootScope.size_status = 'normal';

		/**
		* @property stats
		* @type json
		* @description A <b>local scope</b> variable
		* that holds three timeseries statistics:
		* - <i>homogen</i>: wheater or not 
		* one or multiple timeseries where 
		* homogeneous before the merge
		* - <i>size</i>: a size of the final fused timeseries
		* - <i>per_day</i>: an average number of datapoints
		* per day in the timeseries 
		*/
		$scope.stats = {};
		$scope.stats.homogen = '?';
		$scope.stats.size = '?';
		$scope.stats.per_day = '?';

		/**
		* @property options
		* @type json
		* @description A <b>local scope</b> variable
		* that holds some <code>tsproc</code> configurations.
		* <br/>Transformation configs:
		* - <i>transform_type</i>: the type
		* of transformation to apply in order
		* to synchronise multiple timeseries.
		* Possible values are 'interp' (interpolation)
		* and 'inters' (intersection)
		* - <i>interp_type</i>: interpolation method.
		* Possible values are: 'linear', 'cubic', <a href="https://en.wikipedia.org/wiki/Lanczos_resampling">
		* 'lanczos'</a>, 'nearest' (nearest neighbor)
		*
		* Reduction configs:
		* - <i>reduc_type</i>: the reduction method to combine <code>$scope.options.reduc_size</code>
		* datapoints into one. Possible values are: 'skip', 'sum', 'avg', 'max', 'min'
		* - <i>reduc_size</i>: the number of datapoints to be reduced into one 
		* the <code>$scope.options.reduc_type</code> method
		* - <i>target_field</i>: a target field used for 'max' and 'min' methods
		* 
		* Date configs:
		* - <i>from_date</i>: a date from which to cut the dates
		* - <i>to_date</i>: a date till withc to cut the dates
		*
		* Correlation configs:
		* - <i>count_negative</i>: wheather or not to count 
		* the negative correlation as a correaltion
		* - <i>max_coef</i>: wheather or not to use the
		* maximum correlation value as a criteria to consider
		* the set of datapoints as correlated. If <code>max_coef</code>
		* is false, use max number of datapoints as a criteria
		*
		* Quantification config:
		* - <i>tsfield_quantum</i>: the quantum of the 
		* timestamp attribute. Possible values are: 
		* 'none', 'day', 'month', 'year'
		*/
		$scope.options = {};
		$scope.options.transform_type = 'interp';
		$scope.options.interp_type = 'linear';
		$scope.options.reduc_type = 'skip';
		$scope.options.reduc_size = 1;
		$scope.options.target_field = '';
		$scope.options.from_date = null;
		$scope.options.to_date = null;
		$scope.options.count_negative = false;
		$scope.options.max_coef = true;
		$scope.options.tsfield_quantum = 'none';

		/**
		* @property enableDates
		* @type boolean
		* @description A <b>local scope</b> variable
		* that serves the right panel 
		* in the <code>index.html</code> view and
		* is used to enable/disable the dates
		* section.
		*/
		$scope.enableDates = false;

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
			config.transform.type = $scope.options.transform_type;
			if ($scope.options.transform_type === 'interp')
				config.transform.interp_type = $scope.options.interp_type;

			//reduction type
			config.reduction = {};
			config.reduction.type = $scope.options.reduc_type;
			config.reduction.size = $scope.options.reduc_size;
			config.reduction.target_field = $scope.options.target_field;

			//date borders
			config.date_borders = {};
			config.date_borders.from = {};
			config.date_borders.to = {};
			if ($scope.enableDates && $scope.options.from_date && $scope.options.to_date){

				config.date_borders.from.date = new Date($scope.options.from_date).toString();
				config.date_borders.to.date = new Date($scope.options.to_date).toString();
			}
			else{

				config.date_borders.from.date = '';
				config.date_borders.to.date = '';
			}

			//correlation detection options
			if ($scope.toogled_correlation){

				config.correlation = {};
				config.correlation.count_negative = $scope.options.count_negative;
				config.correlation.max_coef = $scope.options.max_coef;
			}
			else{
				config.correlation = null;
			}

			//quantification options
			config.tsfield_quantum = $scope.options.tsfield_quantum;

			return config;

		}

		/**
		* A <b>root scope</b> method, that
		* is binded to all the options in the right panel 
		* of <code>index.html</code> view and
		* sets them from the <code>config</code>
		* json.
		* @method setStats
		* @param {json} config A json with options to set
		*/
		$rootScope.setStats = function(config){

			if (!config){

				$rootScope.size_status = 'normal';

				$scope.stats = {};
				$scope.stats.homogen = '?'
				$scope.stats.size = '?';
				$scope.stats.per_day = '?';

				$scope.options = {};
				$scope.options.transform_type = 'interp';
				$scope.options.interp_type = 'linear';
				$scope.options.reduc_type = 'skip';
				$scope.options.reduc_size = 1;
				$scope.options.target_field = '';
				$scope.options.from_date = null;
				$scope.options.to_date = null;
				$scope.options.count_negative = false;
				$scope.options.max_coef = true;
				$scope.options.tsfield_quantum = 'none';

				return;
			}

			//size
			$scope.stats.size = (config.size) ? config.size : '?';
			$rootScope.size_status = ($scope.stats.size > $rootScope.max_size) ? 'overflow' : 'normal';

			//instances per day
			$scope.stats.per_day = (config.per_day) ? config.per_day.toFixed(5) : '?';

			//homogenity
			if (config.homogen)
				$scope.stats.homogen = 'yes';
			else
				$scope.stats.homogen = 'no';

			//setting the dates
			$scope.options.from_date = new Date(config.from);
			$scope.options.to_date = new Date(config.to);

		}

		/**
		* A <b>local scope</b> method, that
		* serves the righ panel of <code>index.html</code>
		* view and fires when the dragged field is dropped
		* on the input in the 'Reduction' section.
		* When it is done, the input would have the name 
		* of the field on it.
		* @method onDroppedField
		* @param {json} data A dropped field
		*/
		$scope.onDroppedField = function(data){

			//if it is not a timestamp field
			if (!data.format && data.field){

				//real target field
				$scope.options.target_field = data.field.name;
			}
		}


		/**
		* A <b>local scope</b> method, attached to 
		* right panel of the <code>index.html</code>
		* that shows a dialog (templated by <code>Alert.html</code>)
		* with alert message about the size of a timeseries.
		* @method showAlert
		* @param ev Event
		*/
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

		/**
		* A <b>local scope</b> $watch method, attached
		* to the right panel in the <code>index.html</code> that
		* fires when the 'Correlation' section is toogled.
		* It then forces the values of the 
		* <code>$scope.options.count_negative</code> 
		* and <code>$scope.options.max_coef</code>.
		*/
		$scope.$watch('toogled_correlation', function(){

			if (!$scope.toogled_correlation){

				$scope.options.count_negative = false;
				$scope.options.max_coef = true;
			}
		});

		/**
		* A <b>root scope</b> $watch method, attached 
		* to the right panel in the <code>index.html</code>
		* that disables the correlation detection when 
		* the usage of Canvas.js is forced.t
		*/
		$rootScope.$watch('force_canvasjs', function(){

			if ($rootScope.force_canvasjs){

				$scope.toogled_correlation = false;
			}
		});

		/**
		* @property hide_dataset
		* @type boolean
		* @description A <b>local scope</b> variable
		* that serves the right panel 
		* in the <code>index.html</code> view and
		* is used to indicate the state of the
		* section 'Dataset' (wheather it is 
		* activated or not).
		*/
		$scope.hide_dataset = false;

		/**
		* A <b>local scope</b> method that
		* serves the righ panel of <code>index.html</code>
		* view and attached to the switch in the 
		* 'Dataset' section.
		* It is used to show/hide the dataset (
		* in a form of a table).
		*/		
		$scope.toggleDataset = function(){

			$scope.hide_dataset = !$scope.hide_dataset;

			$scope.hide_trans = $scope.hide_dataset;
			$scope.hide_redu = $scope.hide_dataset;
			$scope.hide_dates = $scope.hide_dataset;
			$scope.hide_quant = $scope.hide_dataset;
		};

	})