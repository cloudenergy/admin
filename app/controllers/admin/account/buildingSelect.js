/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('BuildingSelect', ["$scope", "$uibModalInstance", "API", "Building", "ProjectID", "BuildingIDs", function($scope, $uibModalInstance, API, Building, ProjectID, BuildingIDs) {
    var Buildings;

    $scope.Ok = function() {
        var SelectBuildings = [];
        var UnSelectBuildings = [];
        if ($scope.viewOfBuildings[0].isEnable) {
            //
            SelectBuildings = $scope.viewOfBuildings[0]._id;
        } else {
            _.each($scope.viewOfBuildings, function(building) {
                var prefix = building.project && building.project._id + '.' || '';
                if (building.isEnable) {
                    SelectBuildings.push(prefix + building._id);
                } else {
                    UnSelectBuildings.push(prefix + building._id);
                }
            });
        }
        $uibModalInstance.close({
            select: SelectBuildings,
            unselect: UnSelectBuildings
        });
    };
    $scope.Cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.SwitchBuilding = function(e, building) {
        e.preventDefault();

        if (building._id == '*') {
            _.each($scope.viewOfBuildings, function(p) {
                p.isEnable = false;
            });
            building.isEnable = !building.isEnable;
        } else {
            $scope.viewOfBuildings[0].isEnable = false;
            building.isEnable = !building.isEnable;
        }
    };

    $scope.onSearchProject = function(e) {
        e.preventDefault();

        $scope.UpdateViewOfBuildings($scope.buildingSearchKey);
    };

    $scope.UpdateViewOfBuildings = function(key) {
        //
        $scope.viewOfBuildings = [{
            _id: '*',
            title: '所有建筑'
        }];
        if (!key) {
            $scope.viewOfBuildings = _.union($scope.viewOfBuildings, Buildings);
        } else {
            _.each(Buildings, function(building) {
                if (building.title.match(key)) {
                    $scope.viewOfBuildings.push(building);
                }
            });
        }

        //Set Select Building
        var isSelectedOne = false;
        _.each($scope.viewOfBuildings, function(building) {
            if (_.contains(BuildingIDs, building._id)) {
                isSelectedOne = true;
                building.isEnable = true;
            } else {
                building.isEnable = false;
            }
        });
        if (!isSelectedOne) {
            $scope.viewOfBuildings[0].isEnable = true;
        }
    };

    if (BuildingIDs && BuildingIDs.length) {
        var newBuildingIDs = [];
        _.each(BuildingIDs, function(build) {
            newBuildingIDs.push(build.replace(/.+\./g, ''));
        });
        BuildingIDs = newBuildingIDs;
    }

    API.Query(Building.info, {
        project: ProjectID
    }, function(result) {
        if (result.err) {} else {
            Buildings = result.result;
            $scope.UpdateViewOfBuildings();
        }
    });
}]);