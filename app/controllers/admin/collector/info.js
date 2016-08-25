angular.module('app').controller('CollectorIndex', ["$scope", "Collector", "API", "Auth", "UI", function($scope, Collector, API, Auth, UI) {
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

    $scope.currentPage = 1;
    $scope.askingRemoveID = undefined;

    Auth.Check($scope.operateStatus, function() {

        $scope.DoRemove = function(e, id, index) {
            e.preventDefault();

            var removeIndex = UI.GetAbsoluteIndex($scope.currentPage, index);
            API.Query(Collector.delete, {
                id: id
            }, function(result) {
                $scope.items.splice(removeIndex, 1);
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

        function GetCollector() {
            API.Query(Collector.info, {
                project: $scope.Project.selected._id
            }, (function(result) {
                if (!result.err) {
                    $scope.items = result.result;
                }
            }));
        }

        //选择项目后联动查询建筑
        $scope.$watch('Project.selected', GetCollector);

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