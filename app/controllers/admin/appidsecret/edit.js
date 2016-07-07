angular.module('app').controller('appidsecretedit', ["$scope", "$stateParams", "$q", "$cookies", "$location", "Account", "AppIDSecret", "API", "Auth", "UI", "Character", function($scope, $stateParams, $q, $cookies, $location, Account, AppIDSecret, API, Auth, UI, Character) {

    Auth.Check(function() {

        $scope.submit = function(e) {
            if (!$scope.character) {
                UI.AlertError('请选择创建账户的权限级别');
                return;
            }

            $scope.appidsecret['character'] = $scope.character._id;
            $scope.appidsecret['desc'] = $scope.appidsecret.desc;

            API.Query(AppIDSecret.update, $scope.appidsecret, function(result) {
                $location.path('/admin/appidsecret/info')
            }, function(res) {
                if (res.code) {
                    UI.AlertError(res.message);
                };
            });
        };

        $q.all([
            API.QueryPromise(Account.info, {
                id: $cookies.user
            }).$promise, API.QueryPromise(AppIDSecret.info, {
                id: $stateParams.id
            }).$promise
        ]).then(function(result) {
            $scope.adminUser = result[0].result;
            $scope.appidsecret = result[1].result;

            var power = $scope.adminUser.character && $scope.adminUser.character.level;
            API.Query(Character.info, {
                power: power
            }, function(result) {
                //                console.log(result);
                if (result.err) {
                    //
                } else {
                    $scope.characters = result.result;
                    $scope.level = $scope.appidsecret.character && $scope.appidsecret.character.level;
                    if ($scope.level == undefined) {
                        $scope.level = $scope.characters[$scope.characters.length - 1];
                    } else {
                        $scope.character = _.find($scope.characters, function(character) {
                            return character.level == $scope.level;
                        });
                    }
                }
            });
        });

        function responseError(result) {
            UI.AlertError(result.data.message)
        }

        $scope.onRefreshSecret = function(e) {
            e.preventDefault();

            API.Query(AppIDSecret.apply, {
                appid: $scope.appidsecret._id
            }, function(result) {
                //            console.log(result);
                if (result.err) {
                    //
                } else {
                    $scope.appidsecret.secret = result.result.appsecret;
                }
            });
        }
    });
}]);