angular.module('MainApp')
	.controller('LeftNavCtrl', function($scope, $rootScope, $mdDialog, $mdToast, SourcesService, StoresService, FieldsService){

		$rootScope.stores_conf = [];
		$rootScope.fields_conf = [];
		$rootScope.addStores = function(stores_conf){

			stores_conf.forEach(function(store_conf, index){

				$rootScope.stores_conf.push(store_conf);
			});
		}

		$rootScope.removeStores = function(source_conf){

			//get the indexes and clear the fields
			var indexes = [];
			$rootScope.stores_conf.forEach(function(store_conf, index){

				if (store_conf.source.name === source_conf.source.name){
					
					$rootScope.removeFields(store_conf);
					indexes.push(index);
				}
			});

			//remove sources
			indexes.forEach(function(index, i){

				$rootScope.stores_conf.splice(index - i, 1);
			});
		}

		$rootScope.clearStores = function(){

			$rootScope.stores_conf = [];
		}

		$rootScope.addFields = function(fields_conf){

			fields_conf.forEach(function(field_conf, index){

				$rootScope.fields_conf.push(field_conf);
			});
		}

		$rootScope.removeFields = function(store_conf){

			//get the indexes
			var indexes = [];
			$rootScope.fields_conf.forEach(function(field_conf, index){

				if (field_conf.store.name === store_conf.store.name)
					indexes.push(index);
			});

			//remove sources
			indexes.forEach(function(index, i){

				$rootScope.fields_conf.splice(index - i, 1);
			});	
		}

		$rootScope.clearFields = function(){

			$rootScope.fields_conf = [];
		}

		/***************Sources List****************/
		$rootScope.loadSources = function(){

			//show the progress bar
			$rootScope.showPB(true);

			SourcesService.query(
				function(sources_conf){

					console.log('sources_conf:');
					console.log(sources_conf);
					$scope.sources_conf = sources_conf;
					$rootScope.showPB(false);
				},
				function(err){

					$rootScope.showPB(false);
					if (!err.data) err.data = 'Server is unreachable';
					
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
		$rootScope.loadSources();

		$rootScope.loadStores = function(source_conf){

			if (source_conf.source.wanted){

				//show the progress bar
				$rootScope.showPB(true);

				//load a store
				//input is an array of sources
				StoresService.post([source_conf], 
					function(stores_conf){

						//add a short store name
						var store_name;
						stores_conf.forEach(function(store_conf, index){

							store_name = store_conf.store.name;
							store_conf.store.short = (store_name.length > 15) ? store_name.slice(0,15) + '..' : store_name;
						});
						//var name = sto
						//stores_conf.store.short = (store_conf.store.name.length > 6) ? field_conf.field.slice(0,6) + '..' : field_conf.field;



						//add to the stores list
						console.log('stores_conf:');
						console.log(stores_conf);
						$rootScope.addStores(stores_conf);
						$rootScope.showPB(false);

					},
					function(err){

						$rootScope.showPB(false);
						if (!err.data) err.data = 'Server is unreachable';

						$mdToast.show(
							$mdToast.simple()
								.textContent(err.data)
								.action('OK')
								.position('bottom')
								.hideDelay(4000)
						);
					}
				);
			}else{

				$rootScope.removeStores(source_conf);
			}

		}

		$scope.getSourceType = function(source_conf){

			var types = {

				mongo: 'MongoDB',
				mysql: 	'MySQL',
				json: 'JSON',
				csv: 'CSV'
			};

			return types[source_conf.source.type];
		}

		//dialog to modify the source
		$scope.modifySource = function(event, source_conf){

			//used to pass data to the 
			//DialogController
			var shareSourceCtrl = function ($scope, source_conf) {

				$scope.source_conf = source_conf;
			}

			$mdDialog.show({

				templateUrl: '../../templates/AddSource.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: true,
				controller: shareSourceCtrl,
				locals: {'source_conf': source_conf}
			});
		};

		/****************Fields List********************/
		$scope.loadFields = function(store_conf) {

			if (store_conf.wanted){

				//launch the progress bar
				$rootScope.showPB(true);

				//load the stores fields
				FieldsService.post([store_conf], 
					function(fields_conf){

						console.log('fields_conf:');
						console.log(fields_conf);

						//process each field
						fields_conf.forEach(function(field_conf, index){

							//dataset is not loaded yet
							field_conf.field.status = 'ready';

							//check the field name
							field_conf.field.short = (field_conf.field.name.length > 6) ? field_conf.field.name.slice(0,6) + '..' : field_conf.field.name;
						});

						//add the fields to the list
						$rootScope.addFields(fields_conf);
						$rootScope.showPB(false);

					});

			}
			else{

				$rootScope.removeFields(store_conf);
			}

		};

		$scope.clear = function(){

			$scope.sources_conf.forEach(function(source_conf, index){

				source_conf.source.wanted = false;
			});

			$rootScope.clearStores();
			$rootScope.clearFields();
		}

	})