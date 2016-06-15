angular.module('MainApp')
	.controller('DialogCtrl', function($scope, $rootScope, $mdDialog, $mdToast, SourcesService){

		/*******AddSource.html********/
		$scope.showHints = false; //managin the error hints

		//deletable if dialog gives the possibility
		//to modify the existing source
		//false if adding a new source (via fab button)
		$scope.deletable = true;

		//if adding the new source,
		//initialase the source_conf
		if (!$scope.source_conf){

			$scope.source_conf = {

				source:{
					name: '',
					type: 'mongo',
					user: '',
					passw: '',
					server: 'localhost',
					port: null,
					db:'',
					wanted: false
				}
			};

			$scope.deletable = false;
		}

		//save the initial value of source_conf
		//to detect if it was modified
		var old_source_conf = null;
		if ($scope.deletable){
			
			old_source_conf = JSON.parse(JSON.stringify($scope.source_conf));
		}

		$scope.getToolbarTitle = function(){

			if ($scope.deletable)
				return 'Modifying a source';
			else
				return 'Adding a new source';
		}

		$scope.getButtonLabel = function(){

			if ($scope.deletable)
				return 'Modify';
			else
				return 'Save';
		}

		$scope.connect = function() {
			
			$scope.showHints = true;
			
			console.log('DialogController:');
			console.log($scope.source_conf);

			//if we are modifying the existing source
			if ($scope.deletable){

				//if the source was modified
				if (JSON.stringify($scope.source_conf) !== JSON.stringify(old_source_conf)){

					//if all the inputs are specified
					if ($scope.source_conf.source.name && $scope.source_conf.source.type && 
					$scope.source_conf.source.server && $scope.source_conf.source.db){

						//modify the source in the backend
						//var wanted = $scope.source_conf.source.wanted;
						SourcesService.modify($scope.source_conf, 
							function(result){

								//reload sources, clear all
								$rootScope.loadSources();
								$rootScope.clearStores();
								$rootScope.clearFields();

								$mdDialog.hide();

							},
							function(err){

								$mdDialog.hide();

								$mdToast.show(
									$mdToast.simple()
										.textContent(err.data)
										.action('OK')
										.position('bottom')
										.hideDelay(4000)
								);
							}
						);						
					}
				}
				//the source was not modified
				//close the dialog
				else{

					$mdDialog.hide();
				}
			}
			//if we are adding a new source
			else{

				console.log('not deletable!!');

				//if all the inputs are specified
				if ($scope.source_conf.source.name && $scope.source_conf.source.type && 
					$scope.source_conf.source.server && $scope.source_conf.source.db){

					SourcesService.post($scope.source_conf, 
						function(result){

							//reload sources, clear all
							$rootScope.loadSources();
							$rootScope.clearStores();
							$rootScope.clearFields();

							$mdDialog.hide();

						},
						function(err){

							$mdDialog.hide();

							$mdToast.show(
								$mdToast.simple()
									.textContent(err.data)
									.action('OK')
									.position('bottom')
									.hideDelay(4000)
							);
						}
					);
				}
				//not all fields are specified
				//show the error hints
				else{
					console.log('here1');
					$scope.showHints = true;
				}
			}
		};

		$scope.deleteSource = function(){

			console.log('delete!!');
			console.log($scope.source_conf);
			SourcesService.delete($scope.source_conf.source.name, 
				function(){

					//reload sources, clear all
					$rootScope.loadSources();
					$rootScope.clearStores();
					$rootScope.clearFields();

					$mdDialog.hide();
				},
				function(err){

					$mdDialog.hide();

					$mdToast.show(
						$mdToast.simple()
							.textContent(err.data)
							.action('OK')
							.position('bottom')
							.hideDelay(4000)
					);
				}
			);
		}

		/*******SaveFormat.html********/
		$scope.format = 'ISO';
		$scope.saveFormat = function(){
			
			$mdDialog.hide($scope.format);
			console.log($scope.data);
		};

		/***********Both***********/
		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.readFile = function(element){

			//if the file was specified
			if ($scope.source_conf.source.name) {

				//get the file (only one)
				var file = element.files[0];

				//check the type
				if (file.type.split('/')[1] !== $scope.source_conf.source.type){

					$mdDialog.hide();

					$mdToast.show(
						$mdToast.simple()
							.textContent('Incorrect file extension')
							.action('OK')
							.position('bottom')
							.hideDelay(4000)
					);

					return;
				}
		
				//file reader
				var reader = new FileReader();
				reader.onload = function(e){

					var data = e.target.result;

					//mark the 'server' and 'db' of the source
					$scope.source_conf.source.db = file.name;
					$scope.source_conf.source.server = 'file';

					if ($scope.source_conf.source.type === 'csv'){
						console.log('csv:');
						console.log(data);
						console.log('json:');
						console.log(csv2json(data));
					}

					//send the dataset to the server
					var dataset = {};
					dataset.name = $scope.source_conf.source.name;
					dataset.data = ($scope.source_conf.source.type === 'json') ? JSON.parse(data) : csv2json(data);
					SourcesService.post(dataset, function(res){}, function(err){});
				}

				//read the file
				reader.readAsText(file);
			}
		}

		//https://gist.github.com/iwek/7154578
		function csv2json(csv){

			var lines=csv.split("\n");
			var result = [];
			var headers=lines[0].split(",");

			var n = lines.length;
			var m = headers.length;

			for (var i=1; i<n; i++){

				var obj = {};
				var currentline=lines[i].split(",");

				for (var j=0; j<m; j++){
					obj[headers[j]] = currentline[j];
				}

				result.push(obj);

			}

			return result;
		}
	});

