angular.module('app').controller('accountCreate', ["$scope", "$q", "$state", "$cookies", "BillingAccount", "Account", "API", "Auth", "UI", "Character", function($scope, $q, $state, $cookies, BillingAccount, Account, API, Auth, UI, Character) {

    Auth.Check(function() {

        $scope.warning = {};

        $scope.submit = function(e) {
            if ($scope.account.user.length < 6) {
                UI.AlertError('用户名不能低于6位');
                return;
            }

            if ($scope.newpasswd != $scope.repeatnewpasswd) {
                UI.AlertError('二次密码输入不一致，请重新输入');
                return;
            } else if ($scope.newpasswd != undefined || $scope.newpasswd != null) {
                // var passwdMD5 = md5.createHash($scope.newpasswd).toUpperCase();
                // $scope.account.passwd = passwdMD5;
                $scope.account.passwd = $scope.newpasswd;
            }

            if (!$scope.characters.selected) {
                UI.AlertError('请选择创建账户的权限级别');
                return;
            }
            $scope.account.character = $scope.characters.selected._id;
            $scope.account.message = Object.keys($scope.warning).filter(function(item) {
                return $scope.warning[item] ? item : '';
            }).join(',');

            API.Query(BillingAccount.add, {
                account: $scope.account.user,
                title: $scope.account.user
            }, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                    //error
                } else {
                    //
                    $scope.account.billingAccount = result.result._id;
                    console.log($scope.account);
                    API.Query(Account.add, $scope.account, function(result) {
                        console.log(result);
                        if (result.code) {
                            //
                            UI.AlertError('账户创建错误: ' + result.message);
                        } else {
                            UI.AlertSuccess('创建账户成功');
                            $state.go('admin.account.info');
                        }
                    });
                }
            });
        };

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
                        $scope.characters.selected = $scope.characters[$scope.characters.length - 1];
                    }
                });
            }
        });
    });
}]);