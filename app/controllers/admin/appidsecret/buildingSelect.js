/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('BuildingSelect', ["$scope", "$modalInstance", "API", "Building", "ProjectID", "BuildingIDs", "Config", function($scope, $modalInstance, API, Building, ProjectID, BuildingIDs, Config) {
    var Buildings;

    $scope.Ok = function() {
        var SelectBuildings = [];
        var UnSelectBuildings = [];
        _.each($scope.viewOfBuildings, function(building) {
            if (building.isEnable) {
                SelectBuildings.push(building._id);
            } else {
                UnSelectBuildings.push(building._id);
            }
        });
        $modalInstance.close({
            select: SelectBuildings,
            unselect: UnSelectBuildings
        });
    };
    $scope.Cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.SwitchBuilding = function(e, building) {
        e.preventDefault();

        if (building.isEnable) {
            building.isEnable = false;
        } else {
            building.isEnable = true;
        }
    };

    $scope.onSearchProject = function(e) {
        e.preventDefault();

        $scope.UpdateViewOfBuildings($scope.buildingSearchKey);
    };

    $scope.UpdateViewOfBuildings = function(key) {
        //
        $scope.viewOfBuildings = [];
        if (!key) {
            $scope.viewOfBuildings = Buildings;
        } else {
            _.each(Buildings, function(building) {
                if (building.title.match(key)) {
                    $scope.viewOfBuildings.push(building);
                }
            });
        }

        //Set Select Building
        _.each($scope.viewOfBuildings, function(building) {
            if (_.contains(BuildingIDs, building._id)) {
                building.isEnable = true;
            } else {
                building.isEnable = false;
            }
        });
    };

    API.Query(Building.info, {
        project: ProjectID
    }, function(result) {
        if (result.err) {} else {
            Buildings = result.result;
            $scope.UpdateViewOfBuildings();
        }
    });

}]);