angular.module('app').controller('departmentcreate', ["$scope", "$location", "$stateParams", "$uibModal", "SettingMenu", "Department", "Auth", "API", "Project", "UI", "Sensor", "md5", function($scope, $location, $stateParams, $uibModal, SettingMenu, Department, Auth, API, Project, UI, Sensor, md5) {
    $scope.ondutyHour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $scope.ondutyMinute = ['00', '10', '20', '30', '40', '50'];
    $scope.offdutyHour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $scope.offdutyMinute = ['00', '10', '20', '30', '40', '50'];
    Auth.Check(function() {
        $scope.department = {
            character: 'NONE'
        };
        var projectID = $stateParams.project;

        $scope.warning = {};
        $scope.submit = function(e) {
            if ($scope.department.account < 10) {
                UI.AlertError('用户名不能低于10位');
                return
            }

            if ($scope.department.password != $scope.repassword) {
                swal('错误', '两次输入的密码不一致', 'warning');
                return;
            }

            if ($scope.SelectSensors && $scope.SelectSensors.length && !$scope.department.account) {
                alert('请选择所属账户');
                return;
            }

            $scope.department.resource = {
                project: [projectID],
                sensor: []
            };

            _.each($scope.SelectSensors, function(sensor) {
                if (sensor._id == '*') {
                    $scope.department.resource.sensor = '*';
                } else {
                    $scope.department.resource.sensor.push(
                        projectID + '.' + sensor._id
                    );
                }
            });

            $scope.department.onduty = $scope.ondutyHour.selected + ':' + $scope.ondutyMinute.selected;
            $scope.department.offduty = $scope.offdutyHour.selected + ':' + $scope.offdutyMinute.selected;

            $scope.department.message = Object.keys($scope.warning).filter(function(item) {
                return $scope.warning[item] ? item : '';
            }).join(',');

            $scope.department.project = projectID;
            $scope.department.password = md5.createHash($scope.department.password).toUpperCase();

            API.Query(Department.add, $scope.department, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                } else {
                    UI.AlertSuccess('保存成功');
                    $location.path('/admin/department/info');
                }
            });
        };

        $scope.OnSelectAccount = function(e) {
            e.preventDefault();

            var modalInstance = $uibModal.open({
                templateUrl: 'accountSelect.html',
                controller: 'AccountSelect',
                size: 'lg',
                resolve: {
                    SelectedAccounts: function() {
                        return $scope.SelectAccounts || null;
                    }
                }
            });

            modalInstance.result.then(function(selectAccounts) {
                //
                // console.log(selectAccounts);
                $scope.SelectAccounts = selectAccounts;
                $scope.department.account = selectAccounts._id;

                //从选定的account中获取当前项目的传感器列表
                if (!$scope.SelectAccounts.resource) {
                    return;
                }

                //选择账户后，如果account.resource在该项目下有传感器权限，则会覆盖当前已选择的传感器
                if ($scope.SelectAccounts.resource.sensor == '*') {
                    //所有传感器的权限
                    $scope.SelectSensors = [{
                        _id: '*',
                        title: '所有传感器'
                    }];
                } else {
                    var regExpMatch = new RegExp(projectID + '.', 'g');
                    var projectSensorAll = projectID + '.*';
                    var sensorIDs = [];

                    for (var i in $scope.SelectAccounts.resource.sensor) {
                        var sensor = $scope.SelectAccounts.resource.sensor[i];
                        if (sensor == projectSensorAll) {
                            //
                            $scope.SelectSensors = [{
                                _id: '*',
                                title: '所有传感器'
                            }];
                            sensorID = [];
                            break;
                        } else if (sensor.match(regExpMatch)) {
                            var sensorid = sensor.replace(regExpMatch, '');
                            sensorIDs.push(sensorid);
                        }
                    }

                    if (sensorIDs.length) {
                        API.Query(Sensor.info, {
                            ids: sensorIDs
                        }, function(result) {
                            if (result.err) {
                                //
                            } else {
                                $scope.SelectSensors = [];
                                _.each(result.result, function(sensor) {
                                    $scope.SelectSensors.push(sensor);
                                });
                            }
                        });
                    }
                }

            }, function() {});
        };

        $scope.OnSelectSensor = function(e) {
            e.preventDefault();

            var modalInstance = $uibModal.open({
                templateUrl: 'channelSelect.html',
                controller: 'ChannelSelect',
                size: 'lg',
                resolve: {
                    ProjectID: function() {
                        return projectID;
                    },
                    SelectedSensors: function() {
                        return $scope.SelectSensors || [];
                    }
                }
            });

            modalInstance.result.then(function(selectSensors) {
                //
                // console.log(selectSensors);
                $scope.SelectSensors = selectSensors;
            }, function() {});
        };

        $scope.OnSelectCharacter = function(e, character) {
            e.preventDefault();
            $scope.department.character = character;
        };

        API.Query(Project.info, {
            id: projectID
        }, function(result) {
            if (result.code) {
                //
            } else {

                if (result.result.onduty) {
                    var onDuty = moment(result.result.onduty, 'H:mm');
                    $scope.ondutyHour.selected = onDuty.format('H');
                    $scope.ondutyMinute.selected = onDuty.format('mm');
                }

                if (result.result.offduty) {
                    var offDuty = moment(result.result.offduty, 'H:mm');
                    $scope.offdutyHour.selected = offDuty.format('H');
                    $scope.offdutyMinute.selected = offDuty.format('mm');
                }
            }
        })
    });
}]);