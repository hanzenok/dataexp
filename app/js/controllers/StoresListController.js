angular.module('MainApp')
	.controller('StoresListController', function($scope, $http, StoresService, FieldsService){

		$scope.fields = [];

		//get all the stores from the provider
		$scope.stores = StoresService.getData();

		//get the states of all the checkboxes
		//triggers the 
		$scope.refreshStores = function() {

			//sort the stores
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