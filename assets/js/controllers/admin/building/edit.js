angular.module('app').controller('Buildingedit', ["$scope", "$state", "$stateParams", "Building", "Auth", "API", "UI", function ($scope, $state, $stateParams, Building, Auth, API, UI) {
    Auth.Check(function () {

        $scope.submit = function () {
            $scope.building && API.Query(Building.update, $scope.building, function (result) {
                if (result.code) {
                    UI.AlertError(result.message);
                } else {
                    $state.go('admin.building.info');
                    UI.AlertSuccess('保存成功');
                }
            }, function (result) {
                UI.AlertError(result.data.message);
            });
        };

        API.Query(Building.info, {
            id: $stateParams.id
        }, function (result) {
            if (!result.err) {
                angular.extend($scope.building = result.result, {
                    project: $scope.Project.selected._id
                });
            }
        }, function (result) {
            UI.AlertError(result.data.message);
        });

        $scope.avgConsumptionChange = function () {
            $scope.building.totalConsumption = $scope.building.acreage * $scope.building.avgConsumption;
        };
        $scope.totalConsumptionChange = function () {
            $scope.building.avgConsumption = $scope.building.totalConsumption / $scope.building.acreage;
        };
    });
}]);