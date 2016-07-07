angular.module('app').controller('accountamount', ["$scope", "$stateParams", "Account", "API", "Auth", "UI", "BillingAccount", "Log", "Payment", "channels", function($scope, $stateParams, Account, API, Auth, UI, BillingAccount, Log, Payment, channels) {

    $scope.channels = channels.result;

    $scope.AccountID = $stateParams.account;
    $scope.Redirect = decodeURIComponent($stateParams.redirect || '/admin/account/info');

    Auth.Check(function() {
        function LoadBillingAccount() {
            API.Query(Account.info, {
                id: $scope.AccountID
            }, function(result) {
                if (result.err) {
                    //error
                } else {
                    $scope.account = result.result;
                    $scope.account.billingAccount.cash = Math.round($scope.account.billingAccount.cash * 100) / 100;
                    $scope.account.billingAccount.frozen = Math.round($scope.account.billingAccount.frozen * 100) / 100;
                    if (!$scope.account.billingAccount.expire) {
                        $scope.expire = '无限制';
                    } else {
                        $scope.expire = moment($scope.account.billingAccount.expire);
                        $scope.expire = $scope.expire.format('YYYY年MM月DD日');
                    }
                }
            });
        }

        function LoadChargeLog() {
            API.Query(Log.charge, {
                uid: $scope.AccountID,
                channel: 'manual'
            }, function(result) {
                if (result.err) {
                    //
                } else {
                    $scope.chargeLog = result.result;
                }
            });
        }

        LoadBillingAccount();
        LoadChargeLog();

        //Charge
        $scope.OnCharge = function() {

            if (!$scope.cash) {
                return UI.AlertWarning(' ', '请输入充值金额');
            }

            if (!$scope.channels.selected) {
                return UI.AlertWarning(' ', '请选择充值方式');
            }

            var params = {
                uid: $scope.account._id,
                channel: 'Manual',
                amount: parseFloat($scope.cash),
                channelaccountid: $scope.channels.selected,
                project: $stateParams.project,
                subject: '商户项目充值',
                body: '充值项目: ' + $stateParams.project,
                metadata: {
                    operator: EMAPP.Account._id
                }
            };
            API.Query(Payment.charge, params, function(data) {
                if (data.code) {
                    // swal('错误', '充值出错', 'error');
                    UI.AlertError(' ', '充值出错');
                } else {
                    LoadBillingAccount();
                    LoadChargeLog();
                    $scope.cash = 0;
                    if (data.result.fn) {
                        $scope.downloadLink = '/download/' + data.result.fn;
                        window.open($scope.downloadLink);
                    }
                }
            });
        };

        //Reverse
        $scope.OnReverse = function(log) {
            API.Query(Payment.reversal, {
                id: log._id,
                time: moment(log.timecreate).unix(),
                type: 'CHARGE'
            }, function(res) {
                if (res.err) {
                    // swal('错误', '冲正出错: ' + res.err.message, 'error');
                    UI.AlertError(' ', '冲正出错: ' + res.err.message);
                } else {
                    LoadBillingAccount();
                    LoadChargeLog();
                };
            });
        };

        //save alert threshold
        $scope.OnSaveAlerthreshold = function() {
            var update = {
                account: $scope.account.billingAccount._id,
                alerthreshold: $scope.account.billingAccount.alerthreshold
            };
            API.Query(BillingAccount.update, update, function(result) {
                // console.log(result);
            });
        };
    });
}]);