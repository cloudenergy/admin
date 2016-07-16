/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('SensorSelect', ["$scope", "$rootScope", "$uibModalInstance", "API", "Sensor", "ProjectID", "Config", "DeviceType", function($scope, $rootScope, $uibModalInstance, API, Sensor, ProjectID, Config, DeviceType) {
    var Sensors;
    $scope.currentPage = 1;

    $scope.Ok = function() {
        var isUnmodified = true;
        _.each($scope.viewOfSensors, function(sensor) {
            if (sensor.originEnable == sensor.isEnable) {
                return;
            }

            if (sensor.isEnable && sensor.devicetype != DeviceType) {
                isUnmodified = false;
                var sensorUpdateObj = {
                    _id: sensor._id,
                    devicetype: DeviceType
                };

                API.Query(Sensor.update, sensorUpdateObj, function(result) {
                    if (result.err) {} else {
                        $uibModalInstance.close({});
                    }
                });
            } else {
                var sensorUpdateObj = {
                    _id: sensor._id,
                    devicetype: DeviceType
                };

                API.Query(Sensor.update, sensorUpdateObj, function(result) {
                    if (result.err) {} else {
                        $uibModalInstance.close({});
                    }
                });
            }
        });
        if (isUnmodified) {
            $uibModalInstance.close({});
        }
    };
    $scope.Cancel = function() {
        $uibModalInstance.dismiss('cancel');
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

    $scope.OnSelectAll = function(e) {
        e.preventDefault();
        var startIndex = ($scope.currentPage - 1) * $rootScope.popPageSize;
        var stopIndex = $scope.currentPage * $rootScope.popPageSize;
        for (var i = startIndex; i < stopIndex; i++) {
            $scope.viewOfSensors[i].isEnable = true;
        }
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
                } else if (sensor.channel && sensor.channel.match(key)) {
                    $scope.viewOfSensors.push(sensor);
                } else if (sensor.energyTitle && sensor.energyTitle.match(key)) {
                    $scope.viewOfSensors.push(sensor);
                }
            });
        }

        //Set Select Sensor
        _.each($scope.viewOfSensors, function(sensor) {
            sensor.originEnable = (sensor.devicetype == DeviceType);
            sensor.isEnable = sensor.originEnable;
        });
    };

    API.Query(Sensor.channelinfo, {
        project: ProjectID
    }, function(result) {
        if (result.err) {} else {
            Sensors = result.result;
            $scope.UpdateViewOfSensors();
        }
    });
}]);