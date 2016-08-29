/**
 * @module client
 */

/**
 * A main angular module.
 * <br/>
 * The dependencies are:
 * - <b>ngMaterial</b>: UI components framework <a href="https://material.angularjs.org/latest/">Angular-Material</a>
 * - <b>ngDraggable</b>: a Drag&Drop <a href="https://github.com/fatlinesofcode/ngDraggable">module</a>
 * - <b>ngResource</b>: lets to use a <a href="https://docs.angularjs.org/api/ngResource">$resource</a> factory with RESTful communication with the back-end
 * - <b>ngMessages</b>: angular <a href="https://docs.angularjs.org/api/ngMessages/directive/ngMessages">directory</a> that lets to show and hide messages
 *
 * *<i>It is important to mention that the application is also dependent on the <code>tsproc</code> module. Instructions are <a href="./../index.html">here</a></i>
 * @class main
 */
angular.module('MainApp', ['ngMaterial', 'ngDraggable', 'ngResource', 'ngMessages'])
	.config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
	}]);