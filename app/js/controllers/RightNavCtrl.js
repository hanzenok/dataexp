angular.module('MainApp')
	.controller('RightNavCtrl', function($scope, $rootScope){

		//stats
		$scope.homogen = '?'
		$scope.size = '?';
		$scope.per_day = '?';

		//options
		$scope.transform_type = 'interp';
		$scope.interp_type = 'linear';
		$scope.reduc_type = 'skip';
		$scope.reduc_size = 1;
		$scope.from_date = null;
		$scope.to_date = null;

		//dates switcher
		$scope.enableDates = false;

		//monitoring the loaded timeseries size
		$scope.size_status = 'normal';

		//returns the current config
		$rootScope.getConfig = function(){

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

				console.log('from:');
				console.log($scope.from_date.getDate() + ', ' + $scope.from_date.getMonth() + ', ' + $scope.from_date.getFullYear());
				console.log(new Date($scope.from_date.getFullYear(), $scope.from_date.getMonth() + 1, $scope.from_date.getDate()));
				console.log(new Date($scope.from_date).toString());

				console.log('to:');
				console.log($scope.to_date.getDate() + ', ' + $scope.to_date.getMonth() + ', ' + $scope.to_date.getFullYear());
				console.log($scope.to_date);
				console.log(new Date($scope.to_date).toString());

				config.date_borders.from.date = new Date($scope.from_date).toString();
				config.date_borders.to.date = new Date($scope.to_date).toString();
			}
			else{

				config.date_borders.from.date = '';
				config.date_borders.to.date = '';
			}

			console.log('getConfig():');
			console.log(config);

			return config;

		}

		//shows the stats
		$rootScope.setConfig = function(config){

			//size
			$scope.size = config.size;
			$scope.size_status = ($scope.size > 2500) ? 'overflow' : 'normal';

			//instances per day
			$scope.per_day = config.per_day.toFixed(5);

			//homogenity
			if (config.homogen)
				$scope.homogen = 'yes';
			else
				$scope.homogen = 'no';

			//setting the dates
			$scope.from_date = new Date(config.from);
			$scope.to_date = new Date(config.to);


			console.log('setConfig():');
			console.log(config);


		}

		//target field for the reduction
		$scope.target_field = '';
		$scope.short = '';
		$scope.onDroppedField = function(data){

			//if it is not a timestamp field
			if (!data.format){

				//real target field
				$scope.target_field = data.field.name;
			}
		}

		//size color

		// console.log($scope.size + ': ' + typeof $scope.size);

		// if ($scope.size > 2000){

		// 	console.log('supper');
		// }
		// else{

		// 	console.log('infer');
		// }

	})