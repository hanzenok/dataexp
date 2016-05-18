angular.module('MainApp')
	.controller('SidenavCtrl', function($scope, $mdDialog, $mdToast, SourcesService, StoresService, FieldsService){

		/***************Sources List****************/
		SourcesService.getRes().query(
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
			});

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
		StoresService.getRes().query(
			function(stores){

				console.log('stores:');
				console.log(stores);
				$scope.stores = stores;
		},
			function(err){

				$mdToast.show(
					$mdToast.simple()
						.textContent(err.data)
						.action('OK')
						.position('bottom')
						.hideDelay(4000)
				);

				$scope.stores = [];
			});

		/****************Fields List********************/
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
					console.log('fields:');
					console.log(fields);
					$scope.fields = fields;

				});

			}
			else{
				$scope.fields = [];
			}
		};

	});