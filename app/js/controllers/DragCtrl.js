    angular.module('MainApp').
      controller('DragCtrl', function ($scope) {

        $scope.draggableObjects = [{name:'one'}, {name:'two'}, {name:'three'}];
        $scope.droppedObjects1 = [];

        $scope.onDropComplete1=function(data,evt){
            console.log('onDropComplete: ' + data);
            var index = $scope.droppedObjects1.indexOf(data);
            if (index == -1)
            $scope.droppedObjects1.push(data);
        }

        $scope.onDropComplete2=function(data,evt){
            console.log('onDropComplete2: ' + data);
            var index = $scope.droppedObjects1.indexOf(data);
            if (index > -1) {
                $scope.droppedObjects1.splice(index, 1);
            }

        }

        $scope.onDragSuccess1=function(data,evt){
            console.log('onDragSucess: ' + data);
            var index = $scope.droppedObjects1.indexOf(data);
            if (index > -1) {
                $scope.droppedObjects1.splice(index, 1);
            }
        }
      });