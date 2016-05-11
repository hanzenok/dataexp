    angular.module('MainApp')

        .controller('DragCtrl2', function($scope, $rootScope){

            $scope.onDropComplete2 = function(data,evt){

                console.log('onDropComplete2:');
                console.log(data);
                console.log($rootScope.droppedObjects1);
                $rootScope.droppedObjects1 = [];

            }
        });