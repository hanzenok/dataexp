angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope, $http, $mdToast) {


		/*********On dropping chart*******/
		$scope.onDropChart = function(data){

			var filtered_fields = [];

			//check the format
			var err_message='';
			if (!data.format) {

				err_message = err_message + data.chart + ': format is missing';
			}

			//filtering all the dropped fields
			var fields = $rootScope.droppedFields;
			var n = fields.length;
			for (var i=0; i<n; i++){

				if (fields[i].chart === data.chart){
					
					filtered_fields.push(fields[i]);
				}
			}

			//check quantity of fields
			if (filtered_fields.length !== 2) {

				if(err_message.length)

					err_message = err_message + ', 2 fields should be specified';
				else
					err_message = err_message + '2 fields should be specified';
			}

			//if the are erros, show them in a toaster
			if(err_message.length){

				//show a error toaster
				$mdToast.show(
					$mdToast.simple()
						.textContent(err_message)
						.action('OK')
						.position('bottom')
						.hideDelay(4000)
				);

				//empty the erros list
				err_message = '';

				return;
			}

			//sending all the info to the server
			//and waiting for the merged dataset
			$http.post("/api/dataset", filtered_fields).success(function(data, status) {
				
				console.log('sent:');
				console.log(filtered_fields);
				//$scope.fields = data;

			}).error(function(err, status){

				throw new Error(err);
			});
		}

	});