angular.module('MainApp')
	.controller('ToolBarCtrl', function($scope, $rootScope, $mdDialog){

		//hiding panes
		$rootScope.showPanels = true;
		$rootScope.tooglePanels = function(){

			//hide panels
			$rootScope.showPanels = !$rootScope.showPanels;

			//and also footer
			$rootScope.hideFooter = !$rootScope.showPanels;
		}

		//show/hide progress bar
		//activate/desactivate interface
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

		//show about message
		$scope.showAbout = function(ev){

			$mdDialog.show({

				templateUrl: '../../templates/About.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
			});
		};

});