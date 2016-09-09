angular.module('app').controller('departmentcreate', ["$scope", "$state", "$uibModal", "Department", "Auth", "API", "Project", "UI", "Sensor", function($scope, $state, $uibModal, Department, Auth, API, Project, UI, Sensor) {
    $scope.ondutyHour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $scope.ondutyMinute = ['00', '10', '20', '30', '40', '50'];
    $scope.offdutyHour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $scope.offdutyMinute = ['00', '10', '20', '30', '40', '50'];
    Auth.Check(function() {
        $scope.department = {
            character: 'NONE'
        };
        var projectID = $scope.Project.selected._id;

        $scope.warning = {};
        $scope.submit = function(e) {
            if ($scope.department.account < 10) {
                UI.AlertWarning('用户名不能低于10位');
                return;
            }

            if ($scope.department.password != $scope.repassword) {
                swal('错误', '两次输入的密码不一致', 'warning');
                return;
            }

            if ($scope.SelectSensors && $scope.SelectSensors.length && !$scope.department.account) {
                UI.AlertWarning('请选择所属账户');
                return;
            }

            if (!$scope.department.password) {
                UI.AlertWarning('请设置密码');
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

            // $scope.department.password = md5.createHash($scope.department.password).toUpperCase();

            API.Query(Department.add, $scope.department, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                } else {
                    UI.AlertSuccess('保存成功');
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
        });
    });
}]);