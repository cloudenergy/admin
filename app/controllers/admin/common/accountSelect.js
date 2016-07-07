/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('AccountSelect', ["$scope", "$rootScope", "$uibModalInstance", "API", "Account", "SelectedAccounts", function($scope, $rootScope, $uibModalInstance, API, Account, SelectedAccounts) {
    var Accounts;
    $scope.currentPage = 1;

    $scope.Ok = function() {

        var selectAccounts;
        if (_.isArray(SelectedAccounts)) {
            selectAccounts = [];
        } else {
            selectAccounts = null;
        }
        var isUnmodified = true;
        _.each($scope.viewOfAccounts, function(account) {
            if (account.isEnable) {
                isUnmodified = false;
                if (_.isArray(selectAccounts)) {
                    selectAccounts.push(account);
                } else {
                    selectAccounts = account;
                }
            }
        });
        if (isUnmodified) {
            $scope.Cancel()
        } else {
            $uibModalInstance.close(selectAccounts);
        }
    };
    $scope.Cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.Switch = function(e, account) {
        e.preventDefault();

        if (!_.isArray(SelectedAccounts)) {
            _.each($scope.viewOfAccounts, function(vac) {
                if (vac._id != account._id) {
                    vac.isEnable = false;
                }
            });
            account.isEnable = true;
        } else {
            account.isEnable = !account.isEnable;
        }
    };

    $scope.onSearch = function(e) {
        e.preventDefault();

        $scope.UpdateView($scope.searchKey);
    };

    $scope.OnSelectAll = function(e) {
        e.preventDefault();

        // console.log($scope.currentPage, $rootScope.popPageSize);
        var startIndex = ($scope.currentPage - 1) * $rootScope.popPageSize;
        var stopIndex = $scope.currentPage * $rootScope.popPageSize;
        for (var i = startIndex; i < stopIndex; i++) {
            $scope.viewOfAccounts[i].isEnable = true;
        }
    };

    $scope.UpdateView = function(key) {
        //
        $scope.viewOfAccounts = [];
        if (!key) {
            $scope.viewOfAccounts = Accounts;
        } else {
            _.each(Accounts, function(account) {
                var regexMatch = new RegExp(key, "g");
                if (account._id.match(regexMatch)) {
                    $scope.viewOfAccounts.push(account);
                }
            });
        }

        //Set Select Sensor
        _.each($scope.viewOfAccounts, function(account) {
            if (_.isArray(SelectedAccounts)) {
                account.isEnable = _.find(SelectedAccounts, function(SelectAccount) {
                    if (_.isObject(SelectAccount)) {
                        return SelectAccount._id == account._id;
                    } else {
                        return SelectAccount == account._id;
                    }
                });
            } else {
                account.isEnable = (account._id == SelectedAccounts);
            }
        });
    };
    //
    API.Query(Account.info, {}, function(result) {
        // console.log(result);
        if (result.err) {} else {
            Accounts = result.result;
            $scope.UpdateView();
        }
    });

}]);