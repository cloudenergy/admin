angular.module('app').controller('appidsecretInfo', ["$scope", "$cookies", "$location", "SettingMenu", "AppIDSecret", "API", "Auth", "UI", "Config", function($scope, $cookies, $location, SettingMenu, AppIDSecret, API, Auth, UI, Config) {

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
        }
    };

    $scope.askingRemoveID = undefined;


    Auth.Check($scope.operateStatus, function() {

        API.Query(AppIDSecret.info, {}, function(result) {
            if (result.err) {
                //error
            } else {
                $scope.accounts = result.result;
                console.log($scope.accounts);
            }
        }, responseError);

        $scope.DoRemove = function(e, id, index) {
            e.preventDefault();

            var removeIndex = UI.GetAbsoluteIndex($scope.currentPage, index);
            API.Query(AppIDSecret.delete, {
                id: id
            }, function(result) {
                $scope.accounts.splice(removeIndex, 1);
                //            UI.AlertSuccess('删除成功')
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

        $scope.adminUser = $cookies.user;
    });
}]);