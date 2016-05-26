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

			//date borders
			config.date_borders = {};
			config.date_borders.from = {};
			config.date_borders.to = {};

			if ($scope.from_date && $scope.to_date){

				config.date_borders.from.date = $scope.from_date.toString();
				config.date_borders.from.format = "ISO";
				config.date_borders.to.date = $scope.to_date.toString();
				config.date_borders.to.format = "ISO";
			}
			else{

				config.date_borders.from.date = '';
				config.date_borders.to.date = '';
			}

			return config;

		}

		$rootScope.setConfig = function(config){

			//setting the stats
			$scope.size = config.size;
			$scope.per_day = config.per_day.toFixed(5);

			if (config.homogen)
				$scope.homogen = 'yes';
			else
				$scope.homogen = 'no';

			//setting the dates
			$scope.enableDates = true;
			$scope.from_date = new Date(config.from);
			$scope.to_date = new Date(config.to);


			console.log(config);

		}

		// $rootScope.$watch('testWatch', function(){

		// 	console.log('testWatch changed!');
		// });

	})