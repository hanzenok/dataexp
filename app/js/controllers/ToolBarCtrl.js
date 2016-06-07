angular.module('MainApp')
	.controller('ToolBarCtrl', function($scope, $rootScope){

		$rootScope.showPanels = true;
		$rootScope.tooglePanels = function(){

			//hide panels
			$rootScope.showPanels = !$rootScope.showPanels;

			//and also footer
			$rootScope.hideFooter = !$rootScope.showPanels;
		}
});