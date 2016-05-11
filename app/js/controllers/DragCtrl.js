    angular.module('MainApp')
        .service('draggables', function(){
            
            var objects = [];

            this.objects = objects;

            this.clear = function(){

                console.log('from clear function: ');
                console.log(objects);

                objects = [];
                console.log('from clear function: ');
                console.log(objects);
                this.objects = objects;
            }

        })
        .controller('DragCtrl1', function ($scope, draggables) {
            
            $scope.droppedObjects1 = draggables.objects;

            $scope.onDropComplete1=function(data,evt){
                console.log('onDropComplete:');
                console.log(data);
                var index = draggables.objects.indexOf(data);
                if (index == -1){

                    draggables.objects.push(data);
                    $scope.droppedObjects1 = draggables.objects;
                }
                

            }

      })

        .controller('DragCtrl2', function($scope, draggables){

        $scope.onDropComplete2=function(data,evt){

            console.log('onDropComplete2:');
            //console.log(draggables.objects);
            console.log(data);
            draggables.clear();

            // var index = $scope.droppedObjects1.indexOf(data);
            // if (index > -1) {
            //     $scope.droppedObjects1.splice(index, 1);
            // }

        }
        });