angular.module('MainApp', ['ngMaterial', 'ngDraggable', 'ngResource', 'ngMessages'])
	.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
	}]);