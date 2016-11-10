/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('SensorSync', ["$scope", "$uibModalInstance", "API", "Sensor", "SensorIns", function ($scope, $uibModalInstance, API, Sensor, SensorIns) {
    $scope.sensorTitle = SensorIns.title;
    if (SensorIns.channel) {
        $scope.sensorTitle += "-" + SensorIns.channel;
    }

    $scope.sensorStatus = SensorIns.status;
    $scope.sensorLastUpdate = moment(SensorIns.lastupdate).format('YYYY/MM/DD HH:mm:ss');
    $scope.sensorRealData = SensorIns.realdata;
    $scope.sensorLastTotal = SensorIns.lasttotal;

    $scope.Cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.SwitchSensor = function (e, sensor) {
        e.preventDefault();

        if (sensor.isEnable) {
            sensor.isEnable = false;
        } else {
            sensor.isEnable = true;
        }
    };

    $scope.onSearchSensor = function (e) {
        e.preventDefault();

        $scope.UpdateViewOfSensors($scope.sensorSearchKey);
    };

    $scope.Sync = function () {
        var updateObj = {
            id: SensorIns.id,
            lasttotal: SensorIns.realdata,
            lastvalue: 0
        };

        API.Query(Sensor.update, updateObj, function (result) {
            if (result.err) {} else {
                $scope.sensorLastTotal = $scope.sensorRealData;
            }
        });
    };
}]);