angular.module('MainApp')
	.controller('MovableChartsCtrl', function ($scope, $rootScope) {

		$scope.onDropComplete = function(data, type){
			console.log('Object:');
			console.log(data);
			console.log('type:');
			console.log(type);

			if (data.field && data.field.status === 'loaded' && (!data.field.format || type === 'Bar')){

				//only bar chart can have ts fields
				//and bar chart can have only one ts field
				//check if the ts field is already in the list
				//if it already exists, do not add another one
				if (data.field.format){

					//check
					var n = $rootScope.chartFields.length;
					for (var i=0; i<n; i++){

						if ($rootScope.chartFields[i].field.format)
							return;
					}
				}

				//clone the object and set the type
				var clone = JSON.parse(JSON.stringify(data));
				clone.chart = type;

				console.log('clone:');
				console.log(clone);

				//check if exists
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