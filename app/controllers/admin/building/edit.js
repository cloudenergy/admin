angular.module('app').controller('Buildingedit', ["$scope", "$stateParams", "$location", "SettingMenu", "Building", "Auth", "API", "Project", "UI", function($scope, $stateParams, $location, SettingMenu, Building, Auth, API, Project, UI) {
    Auth.Check(function() {
        SettingMenu(function(menu) {
            $scope.menu = menu;
        })

        $scope.submit = function(e) {
            $scope.building.project = $scope.building.project._id;
            API.Query(Building.update, $scope.building, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                } else {
                    $location.path('/admin/building/info');
                    UI.AlertSuccess('保存成功');
                }
            }, function(result) {
                UI.AlertError(result.data.message)
            })
        }

        API.Query(Building.info, {
            id: $stateParams.id
        }, function(result) {
            if (result.err) {
                //
            } else {
                $scope.building = result.result;

                API.Query(Project.info, function(result) {
                    if (result.err) {
                        //
                    } else {
                        $scope.projects = angular.isArray(result.result) ? result.result : [result.result];
                        $scope.building.project = _.find($scope.projects, function(project) {
                            return project._id == $scope.building.project._id;
                        });
                    }
                })
            }
        }, responseError)

        function responseError(result) {
            UI.AlertError(result.data.message)
        }

        $scope.avgConsumptionChange = function() {
            $scope.building.totalConsumption = $scope.building.acreage * $scope.building.avgConsumption;
        }
        $scope.totalConsumptionChange = function() {
            $scope.building.avgConsumption = $scope.building.totalConsumption / $scope.building.acreage;
        }
    });
}]);