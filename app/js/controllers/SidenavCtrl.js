angular.module('MainApp')
	.controller('SidenavCtrl', function($scope, $rootScope, $mdDialog, $mdToast, SourcesService, StoresService, FieldsService){

		$rootScope.stores_conf = [];
		$rootScope.addStore = function(stores){

			stores.forEach(function(store, index){

				$rootScope.stores_conf.push(store);
			});
		}

		$rootScope.removeStore = function(source){

			//get the indexes
			var indexes = [];
			$rootScope.stores_conf.forEach(function(store, index){

				if(store.source.name === source.name)
					indexes.push(index);
			});

			//remove sources
			indexes.forEach(function(index, i){

				$rootScope.stores_conf.splice(index - i, 1);
			});
		}

		/***************Progress Bar****************/
		$rootScope.activatePB = '';
		$rootScope.showPB = function(activate){

			if (activate)
				$rootScope.activatePB = 'indeterminate';
			else{
				$rootScope.activatePB = '';
			}
		}

		/***************Sources List****************/
		$rootScope.loadSources = function(){

			//show the progress bar
			$rootScope.showPB(true);

			SourcesService.query(
				function(sources_conf){

					//consle.log('sources_conf:');
					//consle.log(sources_conf);
					$scope.sources_conf = sources_conf;
					$rootScope.showPB(false);
				},
				function(err){

					$rootScope.showPB(false);
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

		$rootScope.loadStores = function(source){

			if (source.wanted){

				//show the progress bar
				$rootScope.showPB(true);

				//load a store
				StoresService.post([source], 
					function(stores_conf){

						//add to the stores list
						$rootScope.addStore(stores_conf);
						$rootScope.showPB(false);

					},
					function(err){

						$rootScope.showPB(false);
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

				$rootScope.removeStore(source);
			}
		}

		$scope.getSourceType = function(source_conf){

			var types = {

				mongo: 'MongoDB',
				sql: 	'SQL'
			};

			return types[source_conf.type];
		}

		//dialog to modify the source
		$scope.modifySource = function(event, source_conf){

			//consle.log('modifySource:');
			//consle.log(source_conf);

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
		$scope.loadFields = function() {

			//determine the choosen stores
			var wanted_stores = [];
			$scope.stores_conf.forEach(function(store, index, array){

				if (store.wanted){

					wanted_stores.push(store);
				}
			});

			//show the fields list
			if (wanted_stores.length){

				//launch the progress bar
				$rootScope.showPB(true);

				//get the fields of wanted stores
				FieldsService.post(wanted_stores, function(fields_conf){

					//process each field
					fields_conf.forEach(function(field_conf, index){

						//dataset is not loaded yet
						field_conf.status = 'ready';

						//check the field name
						field_conf.short = (field_conf.field.length > 6) ? field_conf.field.slice(0,6) + '..' : field_conf.field;
					});

					//save
					//consle.log('fields_conf:');
					//consle.log(fields_conf);
					$scope.fields_conf = fields_conf;
					$rootScope.showPB(false);

				});

			}
			else{
				$scope.fields_conf = [];
				$rootScope.showPB(false);
			}
		};

	})