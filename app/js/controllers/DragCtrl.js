    angular.module('MainApp')
        /*.factory('draggables', function(){
            
            var draggables = [];
            var draggablesService = {};

            draggablesService.add = function(draggable){

                console.log('add');
                console.log(draggables);

                var index = draggables.indexOf(draggable);
                if (index == -1){

                    draggables.push(draggable);
                }
            }

            draggablesService.get = function(){

                return draggables;
            }

            draggablesService.clear = function(){

                console.log('clear func');
                draggables = [];
            }

            return draggablesService;

            //diff kind
            this.objects = objects;

            this.clear = function(){

                console.log('from clear function: ');
                console.log(objects);

                objects = [];
                console.log('from clear function: ');
                console.log(objects);
                this.objects = objects;
            }

        })*/
        .controller('DragCtrl1', function ($scope, $rootScope) {

            // $scope.droppedObjects1 = draggables.get();
            // $scope.onDropComplete1 = draggables.add;

            $rootScope.droppedObjects1 = [];
            $scope.onDropComplete1=function(data,evt){
                console.log('onDropComplete:');
                console.log(data);
                var index = $rootScope.droppedObjects1.indexOf(data);
                if (index == -1){

                    $rootScope.droppedObjects1.push(data);
                }
                

            }

      })

        .controller('DragCtrl2', function($scope, $rootScope){

            $scope.onDropComplete2 = function(data,evt){

                console.log('onDropComplete2:');
                //console.log(draggables.objects);
                console.log(data);
                console.log($rootScope.droppedObjects1);
                $rootScope.droppedObjects1 = [];
                //draggables.clear();

                // var index = $scope.droppedObjects1.indexOf(data);
                // if (index > -1) {
                //     $scope.droppedObjects1.splice(index, 1);
                // }

            }
        });