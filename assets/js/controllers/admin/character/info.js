angular.module('app').controller('characterInfo', ["$rootScope", "$scope", "API", "Auth", "$cookies", "UI", "Character", "Config", function($rootScope, $scope, API, Auth, $cookies, UI, Character, Config) {

    $scope.operateStatus = {
        manage: {
            isEnable: false,
            url: '/manage'
        },
        delete: {
            isEnable: false,
            url: '/delete'
        }
    };

    $scope.askingRemoveID = undefined;
    $scope.MaxLevel = 0;
    Auth.Check($scope.operateStatus, function() {

        API.Query(Character.info, {}, function(result) {
            if (result.err) {
                //error
            } else {
                $scope.characters = result.result;
                $scope.MaxLevel = $scope.characters.length - 1;
            }
        });

        $scope.DoRemove = function(e, id, index) {
            e.preventDefault();

            var removeIndex = UI.GetAbsoluteIndex($scope.currentPage, index);
            API.Query(Character.delete, {
                id: id
            }, function(result) {
                $scope.characters.splice(removeIndex, 1);
            }, responseError)
        };
        $scope.AskForRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = id;
        };
        $scope.CancelRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = undefined;
        };
        $scope.$watch('currentPage', function(currentPage) {
            if (!currentPage) {
                $scope.currentPage = UI.GetPageIndex();
                return;
            }
            UI.PutPageIndex(undefined, $scope.currentPage);
        });

        function responseError(result) {
            UI.AlertError(result.data.message)
        }

        $scope.onLevelUp = function(e, character, index) {
            e.preventDefault();

            var tmp = $scope.characters[index - 1];
            $scope.characters[index - 1].level++;
            $scope.characters[index].level--;
            $scope.characters[index - 1] = $scope.characters[index];
            $scope.characters[index] = tmp;

            API.Query(Character.update, {
                '_id': $scope.characters[index]._id,
                level: $scope.characters[index].level
            }, function(result) {});
            API.Query(Character.update, {
                '_id': $scope.characters[index - 1]._id,
                level: $scope.characters[index - 1].level
            }, function(result) {});
        };
        $scope.onLevelDown = function(e, character, index) {
            e.preventDefault();

            var tmp = $scope.characters[index + 1];
            $scope.characters[index + 1].level--;
            $scope.characters[index].level++;
            $scope.characters[index + 1] = $scope.characters[index];
            $scope.characters[index] = tmp;

            API.Query(Character.update, {
                '_id': $scope.characters[index]._id,
                level: $scope.characters[index].level
            }, function(result) {});
            API.Query(Character.update, {
                '_id': $scope.characters[index + 1]._id,
                level: $scope.characters[index + 1].level
            }, function(result) {});
        };

        $scope.adminUser = $cookies.user;
    })
}]);