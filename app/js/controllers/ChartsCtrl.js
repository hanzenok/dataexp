angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope, $http, $mdToast) {


		/*********On dropping chart*******/
		$scope.onDropChart = function(data){

			var filtered_fields = [];

			//check the format
			// var err_message='';
			// if (!data.format) {

			// 	err_message = err_message + data.chart + ': format is missing';
			// }

			//filtering all the dropped fields
			var fields = $rootScope.chartFields;
			var n = fields.length;
			for (var i=0; i<n; i++){

				if (fields[i].chart === data.chart){
					
					filtered_fields.push(fields[i]);
				}
			}

			console.log('filtered_fields:');
			console.log(filtered_fields);
			console.log('dataset:');
			console.log($rootScope.dataset);

			//check quantity of fields
			// if (filtered_fields.length !== 2) {

			// 	if(err_message.length)

			// 		err_message = err_message + ', 2 fields should be specified';
			// 	else
			// 		err_message = err_message + '2 fields should be specified';
			// }

			// //if the are erros, show them in a toaster
			// if(err_message.length){

			// 	//show a error toaster
			// 	$mdToast.show(
			// 		$mdToast.simple()
			// 			.textContent(err_message)
			// 			.action('OK')
			// 			.position('bottom')
			// 			.hideDelay(4000)
			// 	);

			// 	//empty the erros list
			// 	err_message = '';

				return;

		}

	});