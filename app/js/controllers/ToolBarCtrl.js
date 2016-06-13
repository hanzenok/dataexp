angular.module('MainApp')
	.controller('ToolBarCtrl', function($scope, $rootScope){

		$rootScope.showPanels = true;
		$rootScope.tooglePanels = function(){

			//hide panels
			$rootScope.showPanels = !$rootScope.showPanels;

			//and also footer
			$rootScope.hideFooter = !$rootScope.showPanels;
		}

		$rootScope.activatePB = '';
		$rootScope.showPB = function(activate){

			//activate/desactivate inputs
			$rootScope.disabled = activate;

			if (activate)
				$rootScope.activatePB = 'indeterminate';
			else{
				$rootScope.activatePB = '';
			}
		}
});