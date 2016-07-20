angular.module('app').controller('appidsecretcreate', ["$scope", "$location", "$cookies", "Account", "AppIDSecret", "API", "Auth", "UI", "Character", function($scope, $location, $cookies, Account, AppIDSecret, API, Auth, UI, Character) {

    Auth.Check(function() {

        $scope.submit = function(e) {
            $scope.appidsecret = {
                appid: $scope.appid,
                appsecret: $scope.appsecret,
                character: $scope.character._id
            };
            console.log($scope.appidsecret);
            API.Query(AppIDSecret.add, $scope.appidsecret, function(result) {
                console.log(result);
                if (result.code) {
                    //
                    UI.AlertError(result.message);
                } else {
                    //
                    $location.path('/admin/appidsecret/info');
                }
            });
        };

        API.Query(AppIDSecret.apply, {
            appid: $scope.appid
        }, function(result) {
            console.log(result);
            if (result.code) {
                UI.AlertError(result.message);
            } else {
                $scope.appsecret = result.result.appsecret;
                $scope.appid = result.result.appid;
            }
        });

        API.Query(Account.info, {
            'id': $cookies.user
        }, function(data) {
            if (data.code) {
                UI.AlertError(result.message);
            } else {
                $scope.adminUser = data.result;

                var power = $scope.adminUser.character && $scope.adminUser.character.level;
                API.Query(Character.info, {
                    power: power
                }, function(result) {
                    //                console.log(result);
                    if (result.code) {
                        UI.AlertError(result.message);
                        //
                    } else {
                        $scope.characters = result.result;
                        $scope.character = $scope.characters[$scope.characters.length - 1];
                    }
                });

                //
            }
        });
    });
}]);