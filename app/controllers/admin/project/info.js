angular.module('app').controller('projectInfo', ["$rootScope", "$scope", "Project", "API", "Auth", "UI", function($rootScope, $scope, Project, API, Auth, UI) {

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

    Auth.Check($scope.operateStatus, function() {

        API.Query(Project.info, function(result) {
            if (result.err) {
                //error
            } else {
                $scope.projects = angular.isArray(result.result) ? result.result : [result.result];
            }
        });

        $scope.DoRemove = function(e, id, index) {
            e.preventDefault();

            var removeIndex = UI.GetAbsoluteIndex($scope.currentPage, index);
            API.Query(Project.delete, {
                id: id
            }, function(result) {
                $scope.projects.splice(removeIndex, 1);
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
    });
}]);