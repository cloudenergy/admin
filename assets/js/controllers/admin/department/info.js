angular.module('app').controller('departmentInfo', ["$scope", "$timeout", "$uibModal", "$api", "Auth", "UI", function($scope, $timeout, $uibModal, $api, Auth, UI) {

    Auth.Check($scope.operateStatus = {
        create: {
            isEnable: false,
            url: '/create'
        },
        delete: {
            isEnable: false,
            url: '/delete'
        },
        edit: {
            isEnable: false,
            url: '/update'
        }
    }, function() {

        var KEY_PageSize = EMAPP.Account._id + '.department.info.pagesize',
            KEY_Status = EMAPP.Account._id + '.department.info.status';

        $scope.statusenum = [{
            id: 0,
            title: '全部'
        }, {
            id: 1,
            title: '正常'
        }, {
            id: 2,
            title: '欠费'
        }];
        $scope.statusenum.selected = parseInt(localStorage.getItem(KEY_Status) || $scope.statusenum[0].id);

        //分页设置
        $scope.paging = {
            total: 0,
            index: 1,
            size: parseInt(localStorage.getItem(KEY_PageSize) || 10),
            items: [{
                key: 10,
                title: '每页10条'
            }, {
                key: 15,
                title: '每页15条'
            }, {
                key: 30,
                title: '每页30条'
            }, {
                key: 50,
                title: '每页50条'
            }, {
                key: 100,
                title: '每页100条'
            }]
        };

        $scope.GetDepartment = function() {
            /*
            project         [array]      查询项目下所有户
            keyreg          [regexp]     查询符合条件的户
            amount          [number]     过滤账户余额小于指定金额
            arrear          [bool]       过滤账户余额状态true 欠费/false 正常
            */
            if ($scope.listData && $scope.listData.loading) {
                return;
            }
            if ($scope.listData) {
                $scope.listData.loading = true;
            }
            $api.department.info({
                project: $scope.Project.selected._id,
                keyreg: $scope.departmentKey,
                amount: $scope.filterAmount ? parseFloat($scope.filterAmount) : undefined,
                arrear: {
                    1: false,
                    2: true
                }[$scope.statusenum.selected],
                pageindex: $scope.paging.index,
                pagesize: $scope.paging.size
            }, function(data) {

                data = data.result || {};
                data.detail = angular.isArray(data.detail) && data.detail || data.detail && [data.detail] || [];

                angular.forEach(data.detail, function(item) {

                    if (item.account && item.account.billingAccount) {
                        if (item.account.billingAccount.cash < 0) {
                            item.status = '欠费';
                        } else {
                            item.status = '正常';
                        }
                    }

                    item.sensorAll = [];
                    angular.forEach(item.sensors, function(sensor) {
                        item.sensorAll.push(sensor.title + '\u000A');
                        sensor.status.switch = {
                            EMC_ON: true,
                            EMC_OFF: false
                        }[sensor.status.switch] || true;
                    });
                    item.sensorAll = item.sensorAll.join('');

                });

                $scope.listData = data.detail;
                $scope.listData.index = (data.paging || {}).pageindex || 1;
                $scope.listData.total = (data.paging || {}).count || 0;

            });
        };

        $scope.$watch('Project.selected', function() {
            $scope.paging.index = 1;
            $scope.GetDepartment();
        });

        $scope.$watch('statusenum.selected', function(val) {
            localStorage.setItem(KEY_Status, val);
            $scope.paging.index = 1;
            $scope.listData && $scope.GetDepartment();
        });

        $scope.$watch('paging.index', function(val) {
            $scope.listData && $scope.GetDepartment();
        });

        $scope.$watch('paging.size', function(val) {
            localStorage.setItem(KEY_PageSize, val);
            $timeout($scope.listData && $scope.GetDepartment);
        });

        $scope.DoRemove = function(id) {
            $api.department.delete({
                id: id
            }, function(result) {
                $scope.GetDepartment();
            }, function(result) {
                UI.AlertError(' ', result.data.message);
            });
        };

        $scope.switchControl = function(sensor) {
            $uibModal.open({
                size: 'sm',
                templateUrl: 'switch_control.html',
                controller: ["$scope", "$uibModalInstance", "$api", "md5", function($scope, $uibModalInstance, $api, md5) {
                    $scope.md5 = md5;
                    $scope.OnSubmit = function() {
                        $api.control.send({
                            id: sensor.sid,
                            uid: EMAPP.Account._id,
                            ctrlcode: md5.createHash($scope.password).toUpperCase(),
                            command: 'EMC_SWITCH', //开关机控制控制命令
                            param: {
                                mode: 'EMC_OFF' || 'EMC_ON'
                            }
                        }, function(data) {
                            if (data.code) {
                                UI.AlertError(' ', data.message);
                            } else {
                                $uibModalInstance.close();
                            }
                        });
                    };
                    $scope.OnCancel = $uibModalInstance.dismiss;
                }]
            }).result.then(function() {}, function() {
                sensor.status.switch = !sensor.status.switch;
            });
        };

        //导入商户
        $scope.OnImportDepartment = function() {
            $uibModal.open({
                size: 'sm',
                templateUrl: 'import_department.html',
                controller: ["$scope", "$uibModalInstance", "UI", "ProjectID", function($scope, $uibModalInstance, UI, ProjectID) {

                    $scope.actionURL = '/api/import/importdepartment';
                    $scope.Character = '54d032dd877012ac6d37063f';
                    $scope.ProjectID = ProjectID;

                    $scope.OnCancel = $uibModalInstance.dismiss;

                    $scope.OnUploadComplete = function(data) {
                        if (data.code) {
                            UI.AlertError(data.result || ' ', data.message);
                        } else {
                            UI.AlertSuccess('导入成功');
                            $uibModalInstance.close();
                        }
                    };

                }],
                resolve: {
                    ProjectID: function() {
                        return $scope.Project.selected._id;
                    }
                }
            }).result.then($scope.GetDepartment);
        };

        //批量充值
        $scope.OnBatchRecharge = function() {
            $uibModal.open({
                size: 'sm',
                templateUrl: 'batch_recharge.html',
                controller: ["$scope", "$uibModalInstance", "UI", "ProjectID", function($scope, $uibModalInstance, UI, ProjectID) {

                    $scope.actionURL = '/api/import/importbatchrecharge';
                    $scope.ProjectID = ProjectID;

                    $scope.OnCancel = $uibModalInstance.dismiss;

                    $scope.OnUploadComplete = function(data) {
                        if (data.code) {
                            UI.AlertError(data.result || ' ', data.message);
                        } else {
                            UI.AlertSuccess('导入成功');
                            $scope.OnCancel = $uibModalInstance.close;
                            if (data.result.fn) {
                                $scope.downloadLink = '/download/' + data.result.fn;
                                window.open($scope.downloadLink);
                            }
                        }
                    };

                }],
                resolve: {
                    ProjectID: function() {
                        return $scope.Project.selected._id;
                    }
                }
            }).result.then($scope.GetDepartment);
        };

        //导出报警信息
        $scope.OnExportAlertInfo = function() {
            // var obj = {
            //     project: $scope.Project.selected._id,
            //     account: $scope.departmentKey,
            //     filteramount: $scope.filterAmount
            // };

            // $window.open(Config.downloadURL + 'test.txt');
        };

    });

}]);