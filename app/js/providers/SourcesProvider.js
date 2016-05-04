angular.module('MainApp')
	.service('sources', function($http){

		this.b = $http.get('/api/sources');

	});

	/*.provider("sources", function(){

		this.$get = function($q, $http){

			var defer = $q.defer();
			$http.get('/api/sources').then(function(res){
						defer.resolve(res);
					});

			return $http.get('/api/sources');/*$http.get('/api/sources').then(function(res){
						return res;
					});*/

		/*}function($http){

			console.log('tick');
			var a = $http.get('/api/sources');
			console.log(a.then(function(res){return res.data;}));
			console.log('tock');*/

			/*return [

				{
					"name": "test",
					"type": "mongo",
					"server": "localhost",
					"port": "27017",
					"db": "river_flows",
					"wanted": false
				},
				{
					"name": "test2",
					"type": "mongo",
					"server": "localhost",
					"port": "27017",
					"db": "precipitation",
					"wanted": false
				}
			];*/


		//}
	//});