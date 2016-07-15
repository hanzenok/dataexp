angular.module('MainApp')
	.controller('MovableChartsCtrl', function ($scope, $rootScope) {

		$scope.onDropComplete = function(data, type){
			console.log('Object:');
			console.log(data);
			console.log('type:');
			console.log(type);

			if (data.field && data.field.status === 'loaded' && (!data.field.format || type === 'Row')){

				//clone the object and set the type
				var clone = JSON.parse(JSON.stringify(data));
				clone.chart = type;

				console.log('clone:');
				console.log(clone);

				//check if exists exists
				var index = -1;
				$rootScope.chartFields.forEach(function(field_conf, ind){

					if (clone.field.name === field_conf.field.name && 
						clone.source.name === field_conf.source.name &&
						clone.chart === field_conf.chart){

						index = ind;
						return;
					}
				});

				//add if not exists
				if (index == -1){

					//add to the list
					$rootScope.chartFields.push(clone);
				}
			}
		}
	});