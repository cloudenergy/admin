angular.module('app').controller('departmentedit', ["$scope", "$state", "$stateParams", "$uibModal", "$api", "Department", "Auth", "API", "Sensor", "UI", function($scope, $state, $stateParams, $uibModal, $api, Department, Auth, API, Sensor, UI) {
    $scope.ondutyHour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $scope.ondutyMinute = ['00', '10', '20', '30', '40', '50'];
    $scope.offdutyHour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $scope.offdutyMinute = ['00', '10', '20', '30', '40', '50'];

    Auth.Check(function() {

        $scope.submit = function(e) {
            if ($scope.department.password != $scope.repassword) {
                swal('错误', '两次输入的密码不一致', 'warning');
                return;
            }

            var projectID = $scope.department.project;
            $scope.department.resource = {
                project: [projectID],
                sensor: []
            };
            _.each($scope.SelectSensors, function(sensor) {
                $scope.department.resource.sensor.push(
                    projectID + '.' + sensor._id
                );
            });

            $scope.department.message = Object.keys($scope.warning).filter(function(item) {
                return $scope.warning[item] ? item : '';
            }).join(',');

            $scope.department.onduty = $scope.ondutyHour.selected + ':' + $scope.ondutyMinute.selected;
            $scope.department.offduty = $scope.offdutyHour.selected + ':' + $scope.offdutyMinute.selected;

            // if ($scope.department.password) {
            //     $scope.department.password = md5.createHash($scope.department.password).toUpperCase();
            // }

            // $scope.department.account = $scope.departmentAccount;

            API.Query(Department.update, $scope.department, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                } else {
                    UI.AlertSuccess('更新成功');
                    $state.go('admin.department.info');
                }
            });
        };

        $scope.OnSelectSensor = function(e) {
            e.preventDefault();

            var modalInstance = $uibModal.open({
                templateUrl: 'channelSelect.html',
                controller: 'ChannelSelect',
                size: 'lg',
                resolve: {
                    ProjectID: function() {
                        return $scope.department.project;
                    },
                    SelectedSensors: function() {
                        return $scope.SelectSensors || [];
                    }
                }
            });

            modalInstance.result.then(function(selectSensors) {
                $scope.SelectSensors = selectSensors;
            }, function() {});
        };

        $api.department.info({
            id: $stateParams.id
        }, function(result) {
            $scope.department = result.result || {};
            $scope.departmentAccount = result.result.account._id || result.result.account;
            $scope.SelectSensors = $scope.department.resource && $scope.department.resource.sensor || [];

            $scope.account = result.result.account;
            $scope.department.account = $scope.account._id;

            $scope.warning = {};
            if (typeof $scope.account == 'object') {
                $scope.department.mobile = $scope.account.mobile;
                $scope.department.email = $scope.account.email;

                var message = $scope.account.message ? String.prototype.split.call($scope.account.message || '', ',') : [];
                angular.forEach(message, function(value, key) {
                    $scope.warning[value] = true;
                });
            }

            var onDuty = moment($scope.department.onduty, 'H:mm');
            $scope.ondutyHour.selected = onDuty.format('H');
            $scope.ondutyMinute.selected = onDuty.format('mm');

            var offDuty = moment($scope.department.offduty, 'H:mm');
            $scope.offdutyHour.selected = offDuty.format('H');
            $scope.offdutyMinute.selected = offDuty.format('mm');

            if ($scope.department.resource && $scope.department.resource.sensor) {
                //
                var sensorIDs = [];
                _.each($scope.department.resource.sensor, function(sensor) {
                    sensorIDs.push(sensor.replace(/.+\./g, ''));
                });
                API.Query(Sensor.channelinfo, {
                    ids: sensorIDs
                }, function(result) {
                    if (!result.err) {
                        $scope.SelectSensors = result.result;
                    }
                });
            }
        });

        $scope.OnSelectCharacter = function(e, character) {
            e.preventDefault();
            $scope.department.character = character;
        };
    });
}]);