/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('SensorSelect', ["$scope", "$modalInstance", "API", "Sensor", "ProjectID", "SensorIDs", "Config", function($scope, $modalInstance, API, Sensor, ProjectID, SensorIDs, Config) {
    var Sensors;

    $scope.Ok = function() {
        var SelectSensors = [];
        var UnSelectSensors = [];
        _.each($scope.viewOfSensors, function(sensor) {
            if (sensor.isEnable) {
                SelectSensors.push(sensor._id);
            } else {
                UnSelectSensors.push(sensor._id);
            }
        });
        $modalInstance.close({
            select: SelectSensors,
            unselect: UnSelectSensors
        });
    };
    $scope.Cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.SwitchSensor = function(e, sensor) {
        e.preventDefault();

        if (sensor.isEnable) {
            sensor.isEnable = false;
        } else {
            sensor.isEnable = true;
        }
    };

    $scope.onSearchSensor = function(e) {
        e.preventDefault();

        $scope.UpdateViewOfSensors($scope.sensorSearchKey);
    };

    $scope.UpdateViewOfSensors = function(key) {
        //
        $scope.viewOfSensors = [];
        if (!key) {
            $scope.viewOfSensors = Sensors;
        } else {
            _.each(Sensors, function(sensor) {
                if (sensor.title.match(key)) {
                    $scope.viewOfSensors.push(sensor);
                }
            });
        }

        //Set Select Sensor
        _.each($scope.viewOfSensors, function(sensor) {
            if (_.contains(SensorIDs, sensor._id)) {
                sensor.isEnable = true;
            } else {
                sensor.isEnable = false;
            }
        });
    };

    API.Query(Sensor.info, {
        project: ProjectID
    }, function(result) {
        if (result.err) {} else {
            Sensors = result.result;
            $scope.UpdateViewOfSensors();
        }
    });
}]);