angular.module('app').controller('Buildingcreate', ["$scope", "$location", "$stateParams", "SettingMenu", "Building", "Auth", "API", "Project", "UI", function($scope, $location, $stateParams, SettingMenu, Building, Auth, API, Project, UI) {
    Auth.Check(function() {
        SettingMenu(function(menu) {
            $scope.menu = menu;
        });

        $scope.submit = function(e) {
            $scope.building.project = $scope.projects.selected._id;
            API.Query(Building.add, $scope.building, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                } else {
                    $location.path('/admin/building/info');
                    UI.AlertSuccess('保存成功');
                }
            }, function(result) {
                UI.AlertError(result.data.message);
            });
        };

        API.Query(Project.info, function(result) {
            if (result.err) {
                //
            } else {
                $scope.projects = angular.isArray(result.result) ? result.result : [result.result];
                $scope.building = $scope.building || {};
                $scope.projects.selected = _.find($scope.projects, function(project) {
                    return project._id == $stateParams.project;
                });
            }
        });

        $scope.avgConsumptionChange = function() {
            $scope.building.totalConsumption = $scope.building.acreage * $scope.building.avgConsumption;
        };
        $scope.totalConsumptionChange = function() {
            $scope.building.avgConsumption = $scope.building.totalConsumption / $scope.building.acreage;
        };
    });
}]);