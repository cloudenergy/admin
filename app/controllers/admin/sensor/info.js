angular.module('app').controller('SensorIndex', ["$scope", "$q", "$api", "$uibModal", "Building", "API", "Auth", "UI", function($scope, $q, $api, $uibModal, Building, API, Auth, UI) {

    $scope.operateStatus = {
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
            url: '/edit'
        },
        sync: {
            isEnable: true,
            url: '/syncdata'
        },
        mask: {
            isEnable: false,
            url: '/mask'
        }
    };

    var KEY_SEARCH = EMAPP.Account._id + '_sensor_index_search',
        KEY_PROJECT = EMAPP.Account._id + '_sensor_index_projectid';

    Auth.Check($scope.operateStatus, function() {

        // 获取上次的页面
        $scope.currentPage = UI.GetPageIndex();

        $api.project.info(function(data) {
            data.selected = localStorage.getItem(KEY_PROJECT);
            $scope.projects = angular.isArray(data.result) ? data.result : data.result && [data.result] || [];
            $scope.projects.select = function() {
                if ($scope.projects.selected) {
                    localStorage.setItem(KEY_PROJECT, $scope.projects.selected);
                    $scope.customer = $scope.customer ? {
                        enable: $scope.customer.enable
                    } : {
                        enable: true
                    };
                    $scope.buildings = [];
                    $scope.DeviceTypes = [];
                    $q.all([GetCustomer(), GetBuilding(), GetDeviceTypes()]).then($scope.OnSearch);
                }
            };
            angular.forEach($scope.projects, function(item) {
                if (item._id === data.selected) {
                    $scope.projects.selected = item._id;
                }
            });
            $scope.projects.selected = $scope.projects.selected || ($scope.projects[0] || {})._id;
            $scope.projects.select();
        });

        //社会属性
        function GetCustomer() {
            //查询社会属性
            return $scope.projects.selected && $api.customer.info({
                project: $scope.projects.selected,
                onlynode: 1
            }, function(data) {
                $scope.customer = {
                    enable: $scope.customer.enable,
                    selected: 'ROOT',
                    core: {
                        data: [{
                            id: 'ROOT',
                            parent: '#',
                            text: '全部社会属性',
                            state: {
                                selected: true,
                                opened: true
                            },
                            icon: 'glyphicon glyphicon-th-list'
                        }]
                    },
                    conditionalselect: function(node, event) {
                        $scope.customer.selected = node.id;
                        $scope.OnSearch();
                        return true;
                    },
                    plugins: [
                        'search', 'conditionalselect'
                    ]
                };
                (function forEach(list, parent) {
                    angular.forEach(list, function(item, index) {
                        item.parent = parent;
                        item.text = item.title;
                        // if (parent === 'ROOT' && index === 0) {
                        //     item.state = {
                        //         selected: true,
                        //         opened: true
                        //     };
                        // }
                        if (Object.keys(item.child).length) {
                            item.icon = 'glyphicon glyphicon-th-list'
                        } else {
                            item.icon = 'glyphicon glyphicon-file'
                        }
                        forEach(item.child, item.id);
                        $scope.customer.core.data.push(item);
                    });
                }(data.result, 'ROOT'));
            }).$promise
        }

        //建筑属性
        function GetBuilding() {
            return $scope.projects.selected && $api.building.info({
                project: $scope.projects.selected
            }, function(data) {

                var cacheKey = 'sensor.building',
                    cacheId = UI.GetPageItem(cacheKey);

                // $scope.buildings = [{
                //     _id: undefined,
                //     title: '全部建筑'
                // }];
                $scope.buildings = [];
                angular.forEach(data.result, function(item) {
                    this.push(item)
                }, $scope.buildings);

                $scope.buildings.select = function() {
                    UI.PutPageItem(cacheKey, $scope.buildings.selected);
                    $scope.OnSearch();
                };

                angular.forEach($scope.buildings, function(item) {
                    if (item._id === cacheId) {
                        $scope.buildings.selected = item._id
                    }
                });
                $scope.buildings.selected = $scope.buildings.selected || ($scope.buildings[0] || {})._id

            }).$promise
        }

        //设备接口
        function GetDeviceTypes() {
            return $scope.projects.selected && $api.device.type({
                project: $scope.projects.selected
            }, function(data) {

                $scope.DeviceTypes = [{
                    id: undefined,
                    title: '全部设备'
                }];

                angular.forEach(data.result, function(item) {
                    this.push({
                        id: item.id,
                        title: item.name
                    })
                }, $scope.DeviceTypes);

                $scope.DeviceTypes.selected = $scope.DeviceTypes.selected || ($scope.DeviceTypes[0] || {}).id

                $scope.DeviceTypes.select = function() {
                    $scope.OnSearch();
                };

            }).$promise
        }

        //获取传感器
        function GetSensor() {
            $api.business.monitor({
                devicetype: $scope.DeviceTypes.selected || undefined,
                building: !$scope.customer.enable && $scope.buildings.selected || undefined,
                project: $scope.projects.selected,
                key: UI.GetPageItem(KEY_SEARCH) || undefined,
                // groupby: 'SENSOR',
                mode: 'SENSOR',
                usesocity: $scope.customer.enable || undefined,
                socitynode: $scope.customer.enable && $scope.customer.selected || undefined,
                pageindex: $scope.currentPage,
                pagesize: 15
            }, function(data) {
                data = data.result[$scope.projects.selected];
                angular.forEach(data.detail, function(item) {
                    this.push(item)
                }, $scope.viewOfSensor = []);
                $scope.pageSize = data.paging.pagesize;
                $scope.itemsTotal = data.paging.count;
            });
        }

        $scope.$watch('currentPage', function(currentPage) {
            if (currentPage == undefined) {
                $scope.currentPage = UI.GetPageIndex();
                return;
            }
            UI.PutPageIndex(undefined, $scope.currentPage);
            $scope.viewOfSensor && $scope.OnSearch();
        });
        $scope.$watch('customer.enable', function(enable) {
            $scope.viewOfSensor && $scope.OnSearch();
        });

        $scope.OnSearch = function() {
            UI.PutPageItem(KEY_SEARCH, $scope.searchKey);
            GetSensor();
        };

        $scope.OnMask = function(channel) {
            $api.sensorchannel.update({
                id: channel.id,
                mask: !channel.mask
            }, function(result) {
                if (result.err) {} else {
                    channel.mask = !channel.mask;
                }
            });
        };

        $scope.OnMaskAll = function(reverse) {
            if (!confirm("是否确定" + (reverse ? '屏蔽' : '启用') + "所有通道？")) {
                return;
            }

            angular.forEach($scope.viewOfSensor, function(sensor) {
                angular.forEach(sensor.channels, function(channel) {
                    $api.sensorchannel.update({
                        id: channel.id,
                        mask: reverse
                    }, function() {
                        channel.mask = reverse;
                    })
                })
            });
        };

        $scope.OnSync = function(channel, sensor) {

            channel.title = sensor.title;
            var modalInstance = $uibModal.open({
                templateUrl: 'sensorSync.html',
                controller: 'SensorSync',
                size: 'lg',
                resolve: {
                    SensorIns: function() {
                        return channel;
                    }
                }
            });

            modalInstance.result.then(function(sensors) {

                if (!$scope.editUser.resource.sensor) {
                    $scope.editUser.resource.sensor = [];
                }

                $scope.editUser.resource.sensor = _.difference($scope.editUser.resource.sensor, sensors.unselect);
                $scope.editUser.resource.sensor = _.union($scope.editUser.resource.sensor, sensors.select);

            }, function() {});
        };

        $scope.OnSyncAll = function() {

            if (!confirm("是否确定同步所有数据异常的传感器？")) {
                return;
            }

            $api.sensorchannel.syncdata({
                project: $scope.projects.selected
            }, function(result) {
                if (result.err) {
                    console.error(result);
                } else {
                    alert("同步完成");
                    $scope.OnSearch();
                }
            });
        };

        $scope.onRemove = function(channel, sensor) {
            // var removeIndex = UI.GetAbsoluteIndex($scope.currentPage, index);
            $api.sensorchannel.delete({
                id: channel.id
            }, function(result) {
                // $scope.items.splice(removeIndex, 1);
                delete sensor.channels[channel.funcid]
            }, function(result) {
                UI.AlertError(result.data.message)
            })
        };

        //传感器属性
        $scope.OnSensorAttribute = function(sensor) {
            var modalInstance = $uibModal.open({
                templateUrl: 'sensorAttribute.html',
                controller: 'sensorAttribute',
                size: 'lg',
                resolve: {
                    SensorSUID: function() {
                        var sensorGUID = API.ParseSensorID(sensor.id);
                        if (sensorGUID) {
                            return sensorGUID.buildingID + sensorGUID.gatewayID + sensorGUID.addrID + sensorGUID.meterID
                        } else {
                            return null
                        }
                    },
                    ProjectID: function() {
                        return $scope.projects.selected
                    }
                }
            });

            modalInstance.result.then(function() {
                //
            }, function() {});
        };

    });

    $scope.importSensor = function() {
        var $parentScope = $scope,
            uploadCompleted = false,
            modalInstance = $uibModal.open({
                templateUrl: 'importSensor.html',
                size: 'md',
                controller: ["$scope", "$timeout", "$modalInstance", "project", "building", "customer", function($scope, $timeout, $modalInstance, project, building, customer) {
                    $scope.actionURL = '/api/import/importsensorchannel';
                    $scope.project = project;
                    $scope.building = building;
                    $scope.customer = customer;
                    $scope.ok = function() {
                        $modalInstance.close();
                        if (uploadCompleted) {
                            // $parentScope.currentPage += 1;
                            $parentScope.OnSearch();
                        }
                    };

                    $scope.OnUploadComplete = function(res) {
                        if (res.code) {
                            UI.AlertError(res.result, res.message);
                        } else {
                            uploadCompleted = true;
                            UI.AlertSuccess('导入成功');
                        }
                        return false;
                    };

                    $scope.cancel = $modalInstance.dismiss;
                }],
                resolve: {
                    project: function() {
                        return $scope.projects.selected
                    },
                    building: function() {
                        return $scope.buildings.selected
                    },
                    customer: function() {
                        return $scope.customer.selected
                    }
                }
            });
    };

}]);