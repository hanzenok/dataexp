/**
 * Angualr.js controllers.
 * @module client
 * @submodule Controllers
 */

/**
 * A controller that serves the left FAB button
 * in the <code>index.html</code> view
 * that is used to add a new source.
 * @class FabCtrl
 */
angular.module('MainApp')
	.controller('FabCtrl', function($scope, $mdDialog){

		/**
		* A <b>local scope</b> method that renders a view
		* (from <code>AddSource.html</code> template) with
		* inputs to add a new source.
		* @method showDialog
		* @param ev event
		*/
		$scope.showDialog = function(ev) {

			$mdDialog.show({
				templateUrl: '../../templates/AddSource.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
			});
	  	};
	});