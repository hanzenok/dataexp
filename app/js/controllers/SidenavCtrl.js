angular.module('MainApp')
	.controller('SidenavCtrl', function($scope, $rootScope, $mdDialog, $mdToast, SourcesService, StoresService, FieldsService){

		$scope.mouseTest = function(){
			console.log('mouse!!');
		}

		/***************Sources List****************/
		$rootScope.loadSources = function(){

			SourcesService.query(
				function(sources_conf){

					console.log('sources_conf:');
					console.log(sources_conf);
					$scope.sources_conf = sources_conf;
				},
				function(err){
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

			//filter the choosen sources
			var wanted_sources = [];
			$scope.sources_conf.forEach(function(source_conf, index){

				if(source_conf.wanted)
					wanted_sources.push(source_conf);
			});

			console.log('wanted_sources:');
			console.log(wanted_sources);

			if (wanted_sources.length){

				//get the fields of wanted stores
				StoresService.post(wanted_sources, 
					function(stores_conf){

						console.log('from server:');
						console.log(stores_conf);
						$scope.stores_conf = stores_conf;
					},
					function(err){

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
			else{
				$scope.stores_conf = [];
			}
		}

		$scope.getSourceType = function(source_conf){

			var types = {

				mongo: 'MongoDB'
			};

			return types[source_conf.type];
		}

		//dialog to modify the source
		$scope.modifySource = function(event, source_conf){

			console.log('modifySource:');
			console.log(source_conf);

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

		/****************Stores List*****************/
		/*StoresService.getRes().query(
			function(stores_conf){

				console.log('stores_conf:');
				console.log(stores_conf);
				$scope.stores_conf = stores_conf;
		},
			function(err){

				$mdToast.show(
					$mdToast.simple()
						.textContent(err.data)
						.action('OK')
						.position('bottom')
						.hideDelay(4000)
				);

				$scope.stores_conf = [];
			}
		);*/

		/****************Fields List********************/
		$scope.fields_conf = []; 
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
					console.log('fields_conf:');
					console.log(fields_conf);
					$scope.fields_conf = fields_conf;

				});

			}
			else{
				$scope.fields_conf = [];
			}
		};

	})