/**
 * Angualr.js controllers.
 * @module client
 * @submodule Controllers
 */

/**
 * A controller that serves the two templates
 * for dialog windows: <code>AddSource.html</code>
 * and <code>SaveFormat.html</code>.
 * <br/>
 * It uses two custom angular services:
 * - <b>SourcesService</b>: deals with getting/sendig/adding/deleting sources in the backend
 * - <b>CSV2JSONService</b>: used for csv type sources
 * @class DialogCtrl
 */
angular.module('MainApp')
	.controller('DialogCtrl', function($scope, $rootScope, $mdDialog, $mdToast, SourcesService, CSV2JSONService){

		/*******AddSource.html********/
		$scope.showHints = false; //managing the error hints

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

		/**
		* A <b>local scope</b> method
		* that returns the title of a toolbar.
		* <br/>
		* Its value depends on wheather or not 
		* the <code>AddSource.html</code> dialog was called to add or modify a source.
		* @method getToobarTitle
		* @return {string} A toolbar title
		*/
		$scope.getToolbarTitle = function(){

			if ($scope.deletable)
				return 'Modifying a source';
			else
				return 'Adding a new source';
		}

		/**
		* A <b>local scope</b> method
		* that returns the label of the OK button
		* in the  dialog.
		* <br/>
		* Its value depends on wheather or not 
		* the <code>AddSource.html</code> dialog was called to add or modify a source.
		* @method getButtonLabel
		* @return {string} A button label
		*/
		$scope.getButtonLabel = function(){

			if ($scope.deletable)
				return 'Modify';
			else
				return 'Save';
		}

		/**
		* A <b>local scope</b> method, attached to 
		* the OK button in the <code>AddSource.html</code> dialog, that
		* uses services <b>SourcesService</b> and
		* <b>CSV2JSONService</b> to add or modify a source in the back-end.
		* @method connect
		*/
		$scope.connect = function() {
			
			$scope.showHints = true;

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
				}
				//the source was not modified
				//close the dialog
				else{

					$mdDialog.hide();
				}
			}
			//if we are adding a new source
			else{

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
				//not all fields are specified
				//show the error hints
				else{
					$scope.showHints = true;
				}
			}
		};

		/**
		* A <b>local scope</b> method, attached 
		* to the delete button in the toolbar of the 
		* <code>AddSource.html</code> dialog, that uses 
		* a service <b>SourcesService</b> to delete a source from the
		* back-end.
		* @method deleteSource
		*/
		$scope.deleteSource = function(){

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

		//reads the file choosed in the 
		//file dialog and saves it in the backend
		//finally, closes the dialog
		/**
		* A <b>local scope</b> method that serves <code>AddSource.html</code> 
		* and reads the choosen file on front-end 
		* and saves it on the back-end.
		* <br/>
		* Called when the added source is of the 
		* 'file' type (JSON or CSV).
		* @method saveSourceFile
		* @param element Used to get the choosen file on the front-end
		*/
		$scope.saveSourceFile = function(element){

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

					//send the dataset to the server
					var dataset = {};
					dataset.name = $scope.source_conf.source.name;
					dataset.data = ($scope.source_conf.source.type === 'json') ? JSON.parse(data) : CSV2JSONService.csv2json(data);
					SourcesService.post(dataset, function(res){}, function(err){});

					//simulates a click on the "Save" button
					$scope.connect.call(this);
				}

				//read the file
				reader.readAsText(file);
			}
		}

		/*******SaveFormat.html********/
		/**
		* A <b>local scope</b> method that serves
		* <code>SaveFormat.html</code> dialog and saves
		* the the timestamp format specified by user.
		* <br/>
		* It is done by calling the method <code>hide()</code>
		* of <b>$mdDialog</b> service and passing it the format.
		* This way the format can be grabbed in the <code>.then()</code>
		* method in the controller <b>LoaderCtrl</b>.
		* @method saveFormat
		*/
		$scope.format = 'ISO'; //the default format
		$scope.saveFormat = function(){
			
			$mdDialog.hide($scope.format);
		};

		/***********Both***********/
		/**
		* A <b>local scope</b> method that serves 
		* the <code>AddSource.html</code> and <code>SaveFormat.html</code>
		* dialogs and is used to close the dialog.
		* <br/>
		* Done by calling the <code>cancel()</code> method
		* of <b>$mdDialog</b> service.
		* @method cancel
		*/
		$scope.cancel = function() {

			$mdDialog.cancel();
		};

	});

