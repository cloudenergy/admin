angular.module('app').controller('projectInfo', ["$rootScope", "$scope", "$api", "Auth", "UI", function($rootScope, $scope, $api, Auth, UI) {

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
        }
    };

    $scope.askingRemoveID = undefined;
    $scope.currentPage = 1;
    $scope.pageSize = 15;

    Auth.Check($scope.operateStatus, function() {

        $api.project.info(function(data) {
            angular.forEach(angular.copy($rootScope.Project), function(item, index) {
                delete $rootScope.Project[item._id];
                $rootScope.Project.splice($rootScope.Project.length - index - 1, 1);
            });
            angular.forEach(angular.isArray(data.result) ? data.result : data.result && [data.result] || [], function(item) {
                $rootScope.Project.push(item);
                $rootScope.Project[item._id] = item;
            });
            $rootScope.Project.selected = $rootScope.Project[$rootScope.Project.selected._id] || $rootScope.Project[0];
        });

        $scope.DoRemove = function(id, index) {
            $api.project.delete({
                id: id
            }, function(data) {
                $rootScope.Project.splice($scope.pageSize * ($scope.currentPage - 1) + index, 1);
                delete $rootScope.Project[id];
            }, function(result) {
                UI.AlertError(result.data.message);
            });
        };
        $scope.AskForRemove = function(id) {
            $scope.askingRemoveID = id;
        };
        $scope.CancelRemove = function() {
            delete $scope.askingRemoveID;
        };
        $scope.$watch('currentPage', function() {
            delete $scope.askingRemoveID;
            UI.PutPageIndex(undefined, $scope.currentPage);
        });

    });

}]);