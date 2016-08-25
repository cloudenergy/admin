angular.module('app').controller('Buildingcreate', ["$scope", "$state", "Building", "Auth", "API", "UI", function($scope, $state, Building, Auth, API, UI) {
    Auth.Check(function() {

        $scope.building = {
            project: $scope.Project.selected._id
        };

        $scope.submit = function(e) {
            API.Query(Building.add, $scope.building, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                } else {
                    $state.go('admin.building.info');
                    UI.AlertSuccess('保存成功');
                }
            }, function(result) {
                UI.AlertError(result.data.message);
            });
        };

        $scope.avgConsumptionChange = function() {
            $scope.building.totalConsumption = $scope.building.acreage * $scope.building.avgConsumption;
        };
        $scope.totalConsumptionChange = function() {
            $scope.building.avgConsumption = $scope.building.totalConsumption / $scope.building.acreage;
        };
    });
}]);