angular.module('MainApp')
	.provider("sources", function(){

		this.$get = function(){
			

				/*$http.get('/api/sources')
					.success(function(data) {

						console.log(data);

						$scope.sources = 'bi bi';//data;
					})
					.error(function(err){
						
						$scope.sources = [{}];
					});*/
			return [

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
			];


		}
	});