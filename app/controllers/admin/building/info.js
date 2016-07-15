angular.module('app').controller('BuildingInfo', ["$scope", "SettingMenu", "Building", "API", "Auth", "Project", "UI", function($scope, SettingMenu, Building, API, Auth, Project, UI) {
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
    var DefalutProjectStoreKey = 'building.project';

    Auth.Check($scope.operateStatus, function() {
        SettingMenu(function(menu) {
            $scope.menu = menu;
        });

        $scope.DoRemove = function(e, id, index) {
            e.preventDefault();

            API.Query(Building.delete, {
                id: id
            }, function(result) {
                if (!result.code) {
                    $scope.buildings.splice(index, 1);
                }
            }, responseError);
        };
        $scope.AskForRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = id;
        };
        $scope.CancelRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = undefined;
        };

        function GetBuilding(projectID) {
            API.Query(Building.info, {
                project: projectID
            }, function(result) {
                if (result.err) {
                    //error
                } else {
                    $scope.buildings = result.result;
                }
            });
        }

        API.Query(Project.info, function(result) {
            if (result.err) {
                //error
            } else {
                $scope.projects = angular.isArray(result.result) ? result.result : [result.result];
                if ($scope.projects.length > 0) {
                    $scope.projects.selected = $scope.projects[0]._id;
                }

                //Set Default Building
                var defaultProject = UI.GetPageItem(DefalutProjectStoreKey);
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
        });

        //选择项目后联动查询建筑
        $scope.$watch('projects.selected', function(projectID) {
            if (projectID) {
                UI.PutPageItem(DefalutProjectStoreKey, projectID);
                GetBuilding(projectID);
            }
        });

        function responseError(result) {
            UI.AlertError(result.data.message);
        }
    });
}]);