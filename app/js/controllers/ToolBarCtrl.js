/**
 * Angualr.js controllers.
 * @module client
 * @submodule Controllers
 */

/**
 * A controller that serves the toolbar
 * in the <code>index.html</code> view.
 * @class ToolBarCtrl
 */
angular.module('MainApp')
	.controller('ToolBarCtrl', function($scope, $rootScope, $mdDialog){
		
		/**
		* @property showPanels
		* @type boolean
		* @description A <b>root scope</b> variable,
		* binded to the <code>index.html</code> view,
		* that sets the state of left, right and footer panels 
		* (wheather they are hided or not).
		*/
		$rootScope.showPanels = true; //hiding panels
		
		/**
		* A <b>root scope</b> method that hides/shows
		* all the panels (and also footer) in the
		* <code>index.html</code>.
		* @method togglePanels
		*/
		$rootScope.togglePanels = function(){

			//hide panels
			$rootScope.showPanels = !$rootScope.showPanels;

			//and also footer
			$rootScope.hideFooter = !$rootScope.showPanels;
		}

		/**
		* A <b>root scope</b> method that hides/shows
		* a progress bar. Also activates/desactivates
		* all the inputs in the <code>index.html</code>.
		* @method showPB
		* @param activate {boolean} Wheather to activate or not the progress
		* bar and inputs
		*/
		$rootScope.activatePB = ''; //show/hide progress bar
		$rootScope.showPB = function(activate){

			//activate/desactivate inputs
			$rootScope.disabled = activate;

			if (activate)
				$rootScope.activatePB = 'indeterminate';
			else{
				$rootScope.activatePB = '';
			}
		}

		/**
		* A <b>local scope</b> method that shows
		* an about dialog.
		* <br/>
		* Dialog view is specified in hte <code>About.html</code> template.
		* @method showAbout
		* @param ev Event
		*/
		$scope.showAbout = function(ev){

			$mdDialog.show({

				templateUrl: '../../templates/About.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
			});
		};

});