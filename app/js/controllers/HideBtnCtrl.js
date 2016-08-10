/**
 * Angualr.js controllers.
 * @module client
 * @submodule Controllers
 */

/**
 * A controller that serves a button
 * that hides a footer
 * in the <code>index.html</code> view.
 * @class HideBtnCtrl
 */
angular.module('MainApp')
	.controller('HideBtnCtrl', function ($scope, $rootScope) {

		/**
		* @property hideFooter
		* @type boolean
		* @description A <b>root scope</b> variable
		* that sets the state of a footer (wheather it's hided or not) 
		* in the <code>index.html</cdoe> view.
		*/
		$rootScope.hideFooter = false;

		/**
		* @property image
		* @type string
		* @description A <b>local scope</b> variable
		* that is binded to the footer 
		* in the <code>index.html</code> view and holds
		* path to the buttons image.
		*/
		$scope.image = 'images/down.svg';

		/**
		* A <b>local scope</b> method that hides/shows
		* the footer at the <code>index.htlm</code> view.
		* @method toggle
		*/
		$scope.toggle = function(){

			//toggle the footer
			$rootScope.hideFooter = !$rootScope.hideFooter;
		}

		/**
		* A <b>root scope</b> $watch method that swithces
		* the image on the hide button depending on its state.
		* @method switchImage
		*/
		$rootScope.$watch('hideFooter', function(){

			$scope.image = ($rootScope.hideFooter) ? 'images/up.svg' : 'images/down.svg';
		});
	
});