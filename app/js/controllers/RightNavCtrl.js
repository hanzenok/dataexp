angular.module('MainApp')
	.controller('RightNavCtrl', function($scope, $rootScope){

		$scope.transform_type = 'interp';
		$scope.interp_type = 'linear';
		$scope.reduc_type = 'skip';
		$scope.reduc_size = 1;
		$scope.from_date = new Date();
		$scope.to_date = new Date();

		$rootScope.getConfigs = function(){

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
			config.date_borders.from.date = $scope.from_date.toString();
			config.date_borders.from.format = "ISO";
			config.date_borders.to.date = $scope.to_date.toString();
			config.date_borders.to.format = "ISO";

			console.log(config);

		}

		$rootScope.$watch('testWatch', function(){

			console.log('testWatch changed!');
		});

	})