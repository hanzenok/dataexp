angular.module('MainApp', ['ngMaterial', 'ngDraggable', 'ngResource', 'ngMessages', 'ng-vkThread'])
	.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
	}]);