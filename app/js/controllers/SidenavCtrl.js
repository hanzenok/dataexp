angular.module('MainApp')
	.controller('SidenavCtrl', function($scope, $mdDialog, SourcesService, StoresService, FieldsService){

		/*Sources List*/
		SourcesService.getRes().query(function(sources){

			$scope.sources = sources;
			console.log(sources);
		});

		//dialog to modify the source
		$scope.modifySource = function(event, source){

			console.log('modifySource:');
			console.log(source);

			//used to pass data to the 
			//DialogController
			var shareSourceCtrl = function ($scope, source) {

				$scope.source = source;
			}

			$mdDialog.show({
				templateUrl: '../../templates/AddSource.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: true,
				controller: shareSourceCtrl,
				locals: {'source': source}
			});
		};

		/*Stores List*/
		StoresService.getRes().query(function(stores){

			$scope.stores = stores;
		});

		/*Fields List*/
		$scope.fields = []; 
		$scope.loadFields = function() {

			//determine the choosen stores
			var wanted_stores = [];
			$scope.stores.forEach(function(store, index, array){

				if (store.wanted){

					wanted_stores.push(store);
				}
			});

			//show the fields list
			if (wanted_stores.length){

				//get the fields of wanted stores
				FieldsService.getRes().post(wanted_stores, function(fields){

					//process each field
					fields.forEach(function(field, index){

						//dataset is not loaded yet
						field.status = 'ready';

						//check the field name
						field.shortname = (field.name.length > 6) ? field.name.slice(0,6) + '..' : field.name;
					});

					//save
					$scope.fields = fields;

				});

			}
			else{
				$scope.fields = [];
			}
		};

	});