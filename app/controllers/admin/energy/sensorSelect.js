/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('SensorSelect', ["$scope", "$rootScope", "$uibModalInstance", "API", "Sensor", "ProjectID", "Config", "EnergycategoryID", function($scope, $rootScope, $uibModalInstance, API, Sensor, ProjectID, Config, EnergycategoryID) {
    var Sensors;
    $scope.currentPage = 1;

    function GetRootEnergycategory(energycategoryID) {
        var idArray = energycategoryID.split('|');
        if (_.isArray(idArray)) {
            return idArray[0] || energycategoryID;
        } else {
            return energycategoryID;
        }
    }

    $scope.Ok = function() {
        var rootEnergycategory = API.RootEnergycategory(EnergycategoryID);

        var sensorUpdateArray = [];
        var isUnmodified = true;
        _.each($scope.viewOfSensors, function(sensor) {
            if (sensor.originEnable == sensor.isEnable) {
                return;
            }

            if (sensor.isEnable && sensor.energyPath != EnergycategoryID) {
                isUnmodified = false;
                var sensorUpdateObj = {
                    _id: sensor._id,
                    energy: rootEnergycategory,
                    energyPath: EnergycategoryID
                };
                //sensor.socity.push(EnergycategoryID);
                //sensorUpdateArray.push({
                //        id: sensor._id,
                //        energy: GetRootEnergycategory(EnergycategoryID),
                //        energyPath: EnergycategoryID
                //    });
                console.log('Add: ', sensorUpdateObj);
                API.Query(Sensor.update, sensorUpdateObj, function(result) {
                    if (result.err) {} else {
                        $uibModalInstance.close({});
                    }
                });
            } else {
                var sensorUpdateObj = {
                    _id: sensor._id,
                    energy: '',
                    energyPath: ''
                };
                console.log('Clear: ', sensorUpdateObj);
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
            $scope.viewOfSensors = Sensors;
        } else {
            _.each(Sensors, function(sensor) {
                if (sensor.title.match(key)) {
                    $scope.viewOfSensors.push(sensor);
                } else if (sensor.channel && sensor.channel.match(key)) {
                    $scope.viewOfSensors.push(sensor);
                }
            });
        }

        //Set Select Sensor
        _.each($scope.viewOfSensors, function(sensor) {
            sensor.originEnable = (sensor.energyPath == EnergycategoryID);
            sensor.isEnable = sensor.originEnable;
        });
    };

    API.Query(Sensor.channelinfo, {
        project: ProjectID
    }, function(result) {
        console.log(result);
        if (result.err) {} else {
            Sensors = result.result;
            $scope.UpdateViewOfSensors();
        }
    });
}]);