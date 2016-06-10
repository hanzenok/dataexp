angular.module('MainApp', ['ngMaterial', 'ngDraggable', 'ngResource', 'ngMessages', 'ngWebworker', 'ng-vkThread'])
	.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
	}]);