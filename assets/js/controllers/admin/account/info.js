angular.module('app').controller('accountInfo', ["$scope", "$location", "Account", "API", "Auth", "$cookies", "UI", "Config", function ($scope, $location, Account, API, Auth, $cookies, UI, Config) {

    $scope.operateStatus = {
        create: {
            isEnable: false,
            url: '/create'
        },
        delete: {
            isEnable: false,
            url: '/delete'
        },
        edit: {
            isEnable: false,
            url: '/edit'
        },
        roleres: {
            isEnable: false,
            url: '/roleres'
        },
        amount: {
            isEnable: false,
            url: '/amount'
        }
    };

    $scope.askingRemoveID = undefined;

    Auth.Check($scope.operateStatus, function () {

        $scope.currentPage = UI.GetPageIndex();

        $scope.getAccounts = function () {
            var params = {
                pageindex: $scope.currentPage || 1
            };

            if ($scope.searchKey && $scope.searchKey.length) {
                params.key = $scope.searchKey;
            }
            API.Query(Account.info, params, function (result) {
                if (result.err) {
                    //error
                } else {
                    $scope.accounts = result.result;
                }
            }, responseError);
        };

        $scope.DoRemove = function (e, id, index) {
            e.preventDefault();

            var removeIndex = UI.GetAbsoluteIndex($scope.currentPage, index);
            API.Query(Account.delete, {
                id: id
            }, function (result) {
                $scope.accounts.splice(removeIndex, 1);
                //            UI.AlertSuccess('删除成功')
            }, responseError);
        };
        $scope.AskForRemove = function (e, id) {
            e.preventDefault();
            $scope.askingRemoveID = id;
        };
        $scope.CancelRemove = function (e, id) {
            e.preventDefault();
            $scope.askingRemoveID = undefined;
        };
        $scope.$watch('currentPage', function (currentPage) {
            if (!currentPage) {
                $scope.currentPage = UI.GetPageIndex();
                $scope.getAccounts();
                return;
            }
            $scope.getAccounts();
            UI.PutPageIndex(undefined, $scope.currentPage);
        });

        $scope.onSearch = function () {
            $scope.getAccounts();
        };

        function responseError(result) {
            UI.AlertError(result.data.message);
        }

        $scope.adminUser = $cookies.user;

    });
}]);