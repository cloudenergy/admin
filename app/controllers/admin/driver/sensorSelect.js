/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('SensorSelect', ["$scope", "$rootScope", "$modalInstance", "API", "ProjectID", "Driver", "SensorAttrib", "Sensor", function($scope, $rootScope, $modalInstance, API, ProjectID, Driver, SensorAttrib, Sensor) {
    var Sensors;

    $scope.Ok = function() {
        var sensorAttribUpdateArray = [];
        _.each($scope.viewOfSensors, function(sensor) {
            if (sensor.isEnable && sensor.driver != Driver) {
                sensorAttribUpdateArray.push({
                    _id: sensor._id,
                    driver: Driver
                });
            }
        });
        API.Query(SensorAttrib.update, sensorAttribUpdateArray, function(result) {
            if (result.err) {} else {
                $modalInstance.close({});
            }
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

    $scope.OnSelectAll = function(e) {
        e.preventDefault();

        console.log($scope.currentPage, $rootScope.popPageSize);
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
            $scope.viewOfSensors = _.toArray(Sensors);
        } else {
            _.each(Sensors, function(sensor) {
                if (sensor.title.match(key) || sensor.channel.match(key)) {
                    $scope.viewOfSensors.push(sensor);
                }
            });
        }

        //Set Select Sensor
        _.each($scope.viewOfSensors, function(sensor) {
            if (sensor.driver == Driver) {
                sensor.isEnable = true;
            } else {
                sensor.isEnable = false;
            }
        });

        console.log($scope.viewOfSensors);
    };

    API.Query(SensorAttrib.info, {
        project: ProjectID
    }, function(result) {
        console.log(result);
        if (result.err) {} else {
            var query = [];
            Sensors = {};
            _.each(result.result, function(sensor) {
                var key = sensor._id.substr(0, 12) + '.{12}' + sensor._id.substr(12) + '.{2}';
                query.push(key);
                Sensors[sensor._id] = sensor;
            });
            API.Query(Sensor.info, {
                sids: query
            }, function(result) {
                if (result.err) {} else {
                    _.each(result.result, function(sensor) {
                        var SensorGUID = API.ParseSensorID(sensor.sid);
                        var key = SensorGUID.buildingID + SensorGUID.gatewayID + SensorGUID.meterID;
                        if (Sensors[key]) {
                            Sensors[key].title = sensor.title;
                        }
                    });

                    $scope.UpdateViewOfSensors();
                }
            });
        }
    });
}]);