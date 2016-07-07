angular.module('app').controller('accountEdit', ["$scope", "$stateParams", "$q", "$location", "SettingMenu", "Account", "md5", "API", "Auth", "UI", "Character", "Config", function($scope, $stateParams, $q, $location, SettingMenu, Account, md5, API, Auth, UI, Character, Config) {

    Auth.Check(function() {
        SettingMenu(function(menu) {
            $scope.menu = menu;
        });

        $scope.submit = function(e) {
            var updateObj = {
                _id: $scope.account._id
            };
            if ($scope.newpasswd != $scope.repeatnewpasswd) {
                UI.AlertError('二次密码输入不一致，请重新输入');
                return;
            } else if ($scope.newpasswd && $scope.newpasswd.length) {
                var passwdMD5 = md5.createHash($scope.newpasswd).toUpperCase();
                //            $scope.account.passwd = passwdMD5;
                updateObj['passwd'] = passwdMD5;
            }

            if (!$scope.characters.level) {
                UI.AlertError('请选择创建账户的权限级别');
                return;
            }

            updateObj['character'] = $scope.characters.level._id;
            updateObj['title'] = $scope.account.title;
            updateObj['mobile'] = $scope.account.mobile;
            updateObj['email'] = $scope.account.email;

            updateObj['message'] = Object.keys($scope.warning).filter(function(item) {
                return $scope.warning[item] ? item : '';
            }).join(',');

            if ($scope.account.initpath) {
                updateObj['initpath'] = $scope.account.initpath;
            }

            API.Query(Account.update, updateObj, function(result) {
                UI.AlertSuccess('账户更新成功');
                $location.path('/admin/account/info')
            }, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                }
            })
        };

        $q.all([
                API.QueryPromise(Account.info, {
                    id: EMAPP.Account._id
                }).$promise, API.QueryPromise(Account.info, {
                    id: $stateParams.id
                }).$promise
            ])
            .then(function(result) {
                $scope.adminUser = result[0].result;
                $scope.account = result[1].result;

                var message = $scope.account.message ? $scope.account.message.split(',') : [];
                $scope.warning = {};
                angular.forEach(message, function(value, key) {
                    $scope.warning[value] = true;
                });

                var power = $scope.adminUser.character && $scope.adminUser.character.level;
                API.Query(Character.info, {
                    power: power
                }, function(result) {
                    if (result.code) {
                        UI.AlertError(result.message);
                        //
                    } else {
                        $scope.characters = result.result;
                        $scope.characters.level = $scope.account.character && $scope.account.character.level;
                        if ($scope.characters.level == undefined) {
                            $scope.characters.level = $scope.characters[$scope.characters.length - 1];
                        } else {
                            $scope.characters.level = _.find($scope.characters, function(character) {
                                return character.level == $scope.characters.level;
                            });
                        }
                    }
                });
            });

        function responseError(result) {
            UI.AlertError(result.message)
        }
    });
}]);