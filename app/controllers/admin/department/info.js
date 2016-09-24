angular.module('app').controller('departmentInfo', ["$scope", "$timeout", "$uibModal", "$api", "Account", "API", "Auth", "uiGridConstants", "$q", "UI", "$rootScope", "$filter", function($scope, $timeout, $uibModal, $api, Account, API, Auth, uiGridConstants, $q, UI, $rootScope, $filter) {
    var self = this,
        nowDate = new Date();
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
        //消费清单
        $scope.OnConsumeList = function(id) {
            self.id = id;
            $uibModal.open({
                size: 'lg',
                templateUrl: 'consume_list.html',
                controller: ["$scope", function($scope) {
                    $scope.startDate = $filter('date')(nowDate, 'yyyy-MM-01');
                    $scope.endDate = $filter('date')(nowDate, 'yyyy-MM-dd');
                    Auth.Check(function() {
                        LoadBillingAccount();

                        function LoadBillingAccount() {
                            API.Query(Account.info, {
                                id: self.id
                            }, function(result) {
                                $scope.listTitle = result.result.title;
                                if (result.err) {
                                    //error
                                } else {
                                    self.list();
                                }
                            });
                        }
                    });

                    self.list = function(loadMore) {
                        if (loadMore && $scope.gridOptions.paging && $scope.gridOptions.paging.count <= ($scope.gridOptions.paging.pageindex * $scope.gridOptions.paging.pagesize)) return;
                        return $api.business.departmentusage({
                            from: $scope.startDate.replace(/-/g, ''),
                            to: $scope.endDate.replace(/-/g, ''),
                            pageindex: (loadMore && $scope.gridOptions.paging ? $scope.gridOptions.paging.pageindex : 0) + 1,
                            pagesize: 50,
                            project: [{
                                id: $rootScope.Project.selected._id,
                                account: self.id
                            }]
                        }, function(data) {
                            data = data.result[$rootScope.Project.selected._id] || {};
                            if (loadMore) {
                                $scope.gridOptions.data = $scope.gridOptions.data.concat(data.detail || []);
                            } else {
                                $scope.gridOptions.data = data.detail || [];
                                $scope.gridOptions.data.length && $timeout(function() {
                                    $scope.gridApi.core.scrollTo($scope.gridOptions.data[0], $scope.gridOptions.columnDefs[0]);
                                });
                            }
                            angular.forEach($scope.gridOptions.data, function(item) {
                                item.timepoint = item.timepoint && $filter('date')(item.timepoint * 1000, 'yyyy年M月dd日 H:mm:ss') || '';
                            });
                            $scope.gridOptions.paging = data.paging;
                            $scope.gridApi.grid.element.height('auto');
                            return data;
                        }).$promise;
                    };
                    $scope.list = self.list;
                    //筛选
                    $scope.filter = function() {
                        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                    };

                    //导出
                    $scope.export = function() {
                        var name = $filter('date')(new Date(), 'yyyyMMdd_HHmmss');
                        $scope.gridOptions.exporterCsvFilename = $rootScope.Project.selected.title + '_财务_' + $scope.listTitle + '_' + '消费清单' + name + '.csv';
                        $scope.gridApi.exporter.csvExport('visible', 'visible', angular.element(document.querySelectorAll('.subContent')));
                    };
                    $scope.gridOptions = {
                        onRegisterApi: function(gridApi) {
                            gridApi.infiniteScroll.on.needLoadMoreData($scope, function() {
                                var defer = $q.defer(),
                                    resolve = function() {
                                        defer.resolve();
                                    },
                                    reject = function() {
                                        gridApi.infiniteScroll.dataLoaded();
                                        defer.reject();
                                    };
                                (function(promise) {
                                    if (promise) {
                                        promise.then(function() {
                                            gridApi.infiniteScroll.saveScrollPercentage();
                                            gridApi.infiniteScroll.dataLoaded(false, true).then(resolve, reject);
                                        }, reject);
                                    } else {
                                        reject();
                                    }
                                }(self.list(true)));
                                return defer.promise;
                            });

                            $scope.gridApi = gridApi;

                        },
                        rowHeight: 34,
                        infiniteScrollDown: true,
                        enableColumnResizing: true,
                        exporterOlderExcelCompatibility: true,
                        enableSorting: true,
                        columnDefs: [{
                            displayName: '',
                            name: '$index',
                            type: 'number',
                            width: 50,
                            minWidth: 50,
                            enableColumnMenu: false,
                            exporterSuppressExport: true,
                            headerCellClass: 'text-center',
                            headerCellTemplate: '<div class="ui-grid-cell-contents">序号</div>',
                            cellClass: 'text-center',
                            cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
                        }, {
                            displayName: '消费项目',
                            name: 'consists',
                            width: '*',
                            minWidth: 200,
                            enableColumnMenu: false
                        }, {
                            displayName: '消费金额(元)',
                            type: "number",
                            name: 'cost',
                            width: '*',
                            minWidth: 120
                        }, {
                            displayName: '记账时间',
                            name: 'timepoint',
                            type: 'date',
                            width: '*',
                            minWidth: 200
                        }],
                        exporterFieldCallback: function(grid, row, col, value) {
                            return {
                                title: true,
                                account: true,
                                timepaid: true,
                                timecreate: true,
                                departmentname: true,
                                departmentaccount: true,
                                arrearagetime: true,
                                consists: true,
                                timepoint: true
                            }[col.field] ? '="' + (value || '') + '"' : value;
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