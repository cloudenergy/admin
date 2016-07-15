angular.module('app').controller('CollectorIndex', ["$scope", "$rootScope", "SettingMenu", "Collector", "API", "Auth", "Project", "UI", function($scope, $rootScope, SettingMenu, Collector, API, Auth, Project, UI) {
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
        SettingMenu(function(menu) {
            $scope.menu = menu;
        })

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

        function GetCollector(projectID) {
            API.Query(Collector.info, {
                project: projectID
            }, (function(result) {
                if (!result.err) {
                    $scope.items = result.result;
                }
            }));
        }

        API.Query(Project.info, function(result) {
            if (result.err) {
                //error
            } else {
                $scope.projects = angular.isArray(result.result) ? result.result : [result.result];
                var defaultProject = UI.GetPageItem('collector');
                if (defaultProject) {
                    defaultProject = _.find($scope.projects, function(project) {
                        return project._id == defaultProject;
                    });
                    $scope.projects.selected = defaultProject._id;
                } else {
                    if ($scope.projects.length > 0) {
                        $scope.projects.selected = $scope.projects[0]._id;
                    }
                }
            }
        })

        //选择项目后联动查询建筑
        $scope.$watch('projects.selected', function(projectID) {
            if (projectID) {
                UI.PutPageItem('collector', projectID);
                GetCollector(projectID);
            }
        });
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