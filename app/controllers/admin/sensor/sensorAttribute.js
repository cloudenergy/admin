/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('sensorAttribute', ["$scope", "$uibModalInstance", "$q", "SensorSUID", "ProjectID", "Driver", "API", "Control", "SensorAttrib", function($scope, $uibModalInstance, $q, SensorSUID, ProjectID, Driver, API, Control, SensorAttrib) {
    function FullDriverPath() {
        if (!$scope.drivercompanySelected || !$scope.driverNameSelected || !$scope.driverVersionSelected) {
            return "";
        }
        return $scope.drivercompanySelected + '/' + $scope.driverNameSelected + '/' + $scope.driverVersionSelected;
    }

    $scope.Ok = function() {
        var driver = FullDriverPath();
        if (!driver.length) {
            $uibModalInstance.close();
            return;
        }

        //var sharemode = $scope.shareMode;

        //
        var reqData = {
            _id: SensorSUID,
            driver: driver,
            project: ProjectID,
            ext: $scope.SensorAttrib.ext || {}
        };
        reqData.ext['adaptdevice'] = $scope.adaptDeviceSelected || '';
        API.Query(SensorAttrib.update, reqData, function(result) {
            if (result.err) {} else {}
            $uibModalInstance.close();
        });
    };
    $scope.Cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    function GetAdaptDevice(driverPath, defaultAdaptDevice) {
        var obj = {
            "command": "EMC_VIEW_ADAPTDEVICE",
            "sid": SensorSUID,
            "driver": driverPath
        };
        API.Query(Control.Send, obj, function(result) {
            console.log(result);
            if (result.err) {} else {
                $scope.AdaptDevice = [];
                _.each(result.result, function(v, k) {
                    var obj = v;
                    $scope.AdaptDevice.push(obj);
                });

                if (defaultAdaptDevice) {
                    $scope.adaptDeviceSelected = defaultAdaptDevice;
                } else if ($scope.AdaptDevice.length) {
                    $scope.adaptDeviceSelected = $scope.AdaptDevice[0].code;
                }
            }
        });
    }

    //选择驱动厂商
    $scope.$watch('drivercompanySelected', function(driverCompany) {
        if (driverCompany) {
            //UI.PutPageItem('sensor.energytype', energyType);
            //
            //$scope.driverNameSelected = "";
            //$scope.driverVersionSelected = "";

            $scope.DriverNames = $scope.Drivers[driverCompany].driver;
            if (!$scope.DriverNames) {
                return;
            }

            $scope.DriverName = [];
            _.map($scope.DriverNames, function(v, k) {
                $scope.DriverName.push({
                    id: k
                });
            });
        }
    });
    //选择驱动名称
    $scope.$watch('driverNameSelected', function(driverName) {
        if (driverName) {
            //UI.PutPageItem('sensor.energytype', energyType);
            //
            //$scope.driverVersionSelected = "";

            $scope.DriverVersions = $scope.DriverNames[driverName].driver;
            if (!$scope.DriverVersions) {
                return;
            }

            $scope.DriverVersion = [];
            _.map($scope.DriverVersions, function(v, k) {
                $scope.DriverVersion.push({
                    id: k
                });
            });
        }
    });
    //选择版本后，获取传感器适配型号
    $scope.$watch('driverVersionSelected', function(driverVersion) {
        if (driverVersion) {
            //
            var driverPath = FullDriverPath();
            if (!driverPath.length) {
                return;
            }

            GetAdaptDevice(driverPath);
        }
    });

    $q.all([
        API.QueryPromise(Driver.enum, {}).$promise,
        API.QueryPromise(SensorAttrib.info, {
            sensor: SensorSUID
        }).$promise
    ]).then(
        function(result) {
            //
            $scope.Drivers = result[0].result;
            $scope.DriverCompany = [];
            _.map($scope.Drivers, function(v, k) {
                $scope.DriverCompany.push({
                    id: k
                });
            });

            $scope.SensorAttrib = result[1].result || {};

            if ($scope.SensorAttrib) {
                if ($scope.SensorAttrib.driver) {
                    //
                    var pathArray = $scope.SensorAttrib.driver.split('/');
                    $scope.drivercompanySelected = pathArray[0];
                    $scope.driverNameSelected = pathArray[1];
                    $scope.driverVersionSelected = pathArray[2];
                }

                var adaptDevice = null;
                adaptDevice = $scope.SensorAttrib.ext && $scope.SensorAttrib.ext.adaptdevice;
                GetAdaptDevice($scope.SensorAttrib.driver, adaptDevice);
                //$scope.shareMode = $scope.SensorAttrib.sharemode;
            }
        });
    //$scope.shareMode = 'BYCOUNT';
}]);