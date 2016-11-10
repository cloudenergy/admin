/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('SensorSelect', ["$scope", "$uibModalInstance", "API", "Sensor", "ProjectID", "SensorIDs", "Config", function ($scope, $uibModalInstance, API, Sensor, ProjectID, SensorIDs, Config) {
    var Sensors;

    $scope.Ok = function () {
        var SelectSensors = [];
        var UnSelectSensors = [];
        if ($scope.viewOfSensors[0].isEnable) {
            //
            SelectSensors = $scope.viewOfSensors[0]._id;
        } else {
            _.each($scope.viewOfSensors, function (sensor) {
                var prefix = '';
                if (sensor.project) {
                    //
                    if (_.isObject(sensor.project)) {
                        prefix = sensor.project && sensor.project._id + '.' || '';
                    } else {
                        prefix = sensor.project + '.' || '';
                    }
                }

                if (sensor.isEnable) {
                    SelectSensors.push(prefix + sensor._id);
                } else {
                    UnSelectSensors.push(prefix + sensor._id);
                }
            });
        }
        $uibModalInstance.close({
            select: SelectSensors,
            unselect: UnSelectSensors
        });
    };
    $scope.Cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.SwitchSensor = function (e, sensor) {
        e.preventDefault();

        if (sensor._id == '*') {
            _.each($scope.viewOfSensors, function (p) {
                p.isEnable = false;
            });
            sensor.isEnable = !sensor.isEnable;
        } else {
            $scope.viewOfSensors[0].isEnable = false;
            sensor.isEnable = !sensor.isEnable;
        }
    };

    $scope.onSearchSensor = function (e) {
        e.preventDefault();

        $scope.UpdateViewOfSensors($scope.sensorSearchKey);
    };

    $scope.UpdateViewOfSensors = function (key) {
        //
        $scope.viewOfSensors = [{
            _id: '*',
            title: '所有传感器'
        }];
        if (!key) {
            $scope.viewOfSensors = _.union($scope.viewOfSensors, Sensors);
        } else {
            _.each(Sensors, function (sensor) {
                if (sensor.title.match(key)) {
                    $scope.viewOfSensors.push(sensor);
                }
            });
        }

        //Set Select Sensor
        var isSelectedOne = false;
        _.each($scope.viewOfSensors, function (sensor) {
            if (_.contains(SensorIDs, sensor._id)) {
                isSelectedOne = true;
                sensor.isEnable = true;
            } else {
                sensor.isEnable = false;
            }
        });
        if (!isSelectedOne) {
            $scope.viewOfSensors[0].isEnable = true;
        }
    };

    //if(SensorIDs && SensorIDs.length) {
    var newSensorIDs = [];
    _.each(SensorIDs, function (sensor) {
        newSensorIDs.push(sensor.replace(/.+\./g, ''));
    });
    SensorIDs = newSensorIDs;

    API.Query(Sensor.channelinfo, {
        project: ProjectID
    }, function (result) {
        if (result.err) {} else {
            Sensors = result.result;
            $scope.UpdateViewOfSensors();
        }
    });
    //}

}]);