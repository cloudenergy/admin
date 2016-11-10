/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('ChannelSelect', ["$scope", "$rootScope", "$uibModalInstance", "API", "Sensor", "ProjectID", "SelectedSensors", function ($scope, $rootScope, $uibModalInstance, API, Sensor, ProjectID, SelectedSensors) {
    var Sensors;
    $scope.currentPage = 1;
    $scope.project = ProjectID;

    $scope.Ok = function () {

        var selectSensors = [];
        var isUnmodified = true;
        if ($scope.viewOfSensors[0].isEnable) {
            //
            selectSensors = [$scope.viewOfSensors[0]];
        } else {
            _.each($scope.viewOfSensors, function (sensor) {
                if (sensor.isEnable) {
                    isUnmodified = false;
                    selectSensors.push(sensor);
                }
            });

            //selectSensors = _.union(selectSensors, SelectedSensors);

            if (isUnmodified) {
                $scope.Cancel();
            }
        }

        $uibModalInstance.close(selectSensors);
    };
    $scope.Cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.SwitchSensor = function (e, sensor) {
        e.preventDefault();

        if (sensor._id == '*') {
            sensor.isEnable = !sensor.isEnable;
            _.each($scope.viewOfSensors, function (p) {
                p.isEnable = sensor.isEnable;
            });
            // sensor.isEnable = !sensor.isEnable;
            SelectedSensors = [];
        } else {
            var findSensor = _.find(SelectedSensors, function (ss) {
                return ss._id == sensor._id;
            });
            if (!findSensor) {
                SelectedSensors.push(sensor);
            } else {
                SelectedSensors = _.without(SelectedSensors, findSensor);
            }
            $scope.viewOfSensors[0].isEnable = false;
            sensor.isEnable = !sensor.isEnable;
        }
    };

    $scope.onSearchSensor = function (e) {
        e.preventDefault();
        $scope.UpdateViewOfSensors($scope.sensorSearchKey);
    };

    $scope.OnSelectAll = function (e) {
        e.preventDefault();

        // console.log($scope.currentPage, $rootScope.popPageSize);
        var startIndex = ($scope.currentPage - 1) * $rootScope.popPageSize;
        var stopIndex = $scope.currentPage * $rootScope.popPageSize;
        for (var i = startIndex; i < stopIndex; i++) {
            $scope.viewOfSensors[i].isEnable = true;
        }
    };

    $scope.UpdateViewOfSensors = function (key) {
        //
        $scope.viewOfSensors = [{
            _id: '*',
            title: '所有传感器',
            isEnable: SelectedSensors.indexOf('*') ? true : false
        }];

        if (!key) {
            $scope.viewOfSensors = _.union($scope.viewOfSensors, Sensors);
        } else {
            _.each(Sensors, function (sensor) {
                if (sensor.title.match(key)) {
                    $scope.viewOfSensors.push(sensor);
                } else if (sensor.channel && sensor.channel.match(key)) {
                    $scope.viewOfSensors.push(sensor);
                }
            });
        }

        //Set Select Sensor
        _.each($scope.viewOfSensors, function (sensor) {
            sensor.isEnable = _.find(SelectedSensors, function (SelectSensor) {
                if (_.isObject(SelectSensor)) {
                    return SelectSensor._id == sensor._id;
                } else {
                    return SelectSensor == ProjectID + '.' + sensor._id;
                }
            });
        });
    };
    //
    API.Query(Sensor.channelinfo, {
        project: ProjectID
    }, function (result) {
        // console.log(result);
        if (result.err) {

        } else {
            Sensors = result.result;
            $scope.UpdateViewOfSensors();
        }
    }.bind(this));
}]);