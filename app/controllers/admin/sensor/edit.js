angular.module('app').controller('SensorEdit', ["$scope", "$stateParams", "$state", "Sensor", "Collector", "Energy", "Customer", "Building", "API", "Auth", "UI", function($scope, $stateParams, $state, Sensor, Collector, Energy, Customer, Building, API, Auth, UI) {
    Auth.Check(function() {

        var selectEnergycategory;

        $scope.submit = function(e) {
            var sensor = angular.copy($scope.sensor);

            //if(!selectEnergycategory){
            //    alert('请选择传感器能耗类型');
            //    return;
            //}

            sensor.project = $scope.sensor.building.project._id;
            sensor.building = $scope.sensor.building._id;
            if (selectEnergycategory) {
                sensor.energy = API.RootEnergycategory(selectEnergycategory.id);
                sensor.energyPath = selectEnergycategory.id;
            } else {
                sensor.energy = '';
                sensor.energyPath = '';
            }
            var buildingID = sensor.building;

            var UpdateSensor = function() {
                API.Query(Sensor.update, sensor, function(result) {
                    if (!result.err) {
                        $state.go('admin.sensor.info');
                    }
                });
            };

            if ($scope.sid != sensor.sid) {
                //check if sid is exists
                API.Query(Sensor.info, {
                    sids: [sensor.sid]
                }, function(result) {
                    if (result.result && result.result.length > 0) {
                        alert('传感器标识已经存在');
                        return;
                    } else {
                        UpdateSensor();
                    }
                }, function(err) {
                    console.log(err);
                });
            } else {
                //
                UpdateSensor();
            }
        };

        API.Query(Sensor.channelinfo, {
            id: $stateParams.id
        }, function(res) {
            if (res.err) {} else {
                $scope.sensor = res.result[0];
                $scope.sid = $scope.sensor.sid;
                $scope.building = $scope.sensor.building;

                API.Query(Building.info, {
                    id: $scope.sensor.building.id
                }, function(res) {
                    if (res.err) {} else {

                        //显示能耗类型
                        API.Query(Energy.info, {
                            project: $scope.building.project
                        }, function(result) {
                            if (result.err) {} else {
                                var energy = result.result;
                                if ($scope.sensor.energyPath) {
                                    var paths = $scope.sensor.energyPath.split('|');
                                    var node = energy.energy;
                                    var nodePath;
                                    _.each(paths, function(subPath) {
                                        if (!node) {
                                            return;
                                        }
                                        if (nodePath) {
                                            nodePath += '|' + subPath;
                                        } else {
                                            nodePath = subPath;
                                        }
                                        node = node[nodePath];
                                        if (!node) {
                                            return;
                                        }
                                        if (node && !node.childrens) {
                                            node.isSelect = true;
                                            selectEnergycategory = node;
                                        } else {
                                            node = node.childrens;
                                        }
                                    });
                                }

                                if (energy) {
                                    var viewOfEnergy = BuildEnergyTree(null, energy.energy, 1);
                                    $scope.viewOfEnergy = [{
                                        nodes: viewOfEnergy,
                                        title: '能耗分类',
                                        level: 0
                                    }];
                                } else {
                                    $scope.viewOfEnergy = [{
                                        nodes: [],
                                        title: '能耗分类',
                                        level: 0
                                    }];
                                }
                            }
                        });
                    }
                });
            }
        });

        function BuildSocitiesTree(parent, socities, level) {
            if (!socities) {
                return undefined;
            }

            var socitiesArray = [];
            _.each(socities, function(v) {
                v.originid = v.id;
                v.origintitle = v.title;
                v.id = v.id;
                v.title = v.title;
                v.acreage = v.acreage || 0;
                v.level = level;
                v.nodes = BuildSocitiesTree(v, v.childrens, level + 1);
                v.childrens = null;
                v.parent = parent;
                v.isSelect = v.isSelect;
                socitiesArray.push(v);
            });
            socitiesArray.sort(function(a, b) {
                return a.title > b.title ? 1 : -1;
            });
            return socitiesArray;
        }

        function BuildEnergyTree(parent, energy, level) {
            if (!energy) {
                return undefined;
            }

            var energyArray = [];
            _.each(energy, function(v) {

                if (v.childrens) {
                    v.ischild = false;
                } else {
                    v.ischild = true;
                }

                v.parent = parent;
                v.level = level;
                v.nodes = BuildEnergyTree(v, v.childrens, level + 1);
                energyArray.push(v);
            });
            energyArray.sort(function(a, b) {
                return a.title > b.title ? 1 : -1;
            });
            return energyArray;
        }

        function responseError(result) {
            UI.AlertError(result.data.message);
        }

        $scope.onChoice = function(node) {
            node.isSelect = !node.isSelect;

            var groupSelect = function(node, isSelect) {
                if (!node || !node.nodes || !node.nodes.length) {
                    return;
                }
                _.each(node.nodes, function(n) {
                    groupSelect(n, isSelect);
                    n.isSelect = isSelect;
                });
                node.isSelect = isSelect;
            };

            groupSelect(node, node.isSelect);
        };

        $scope.onEnergyChoice = function(node) {
            if (node.nodes) {
                return;
            }
            if (selectEnergycategory) {
                selectEnergycategory.isSelect = false;
            }
            selectEnergycategory = node;
            selectEnergycategory.isSelect = true;
        };
        $scope.OnCollapsePayStatus = function() {
            if (!$scope.sensor.paystatus || $scope.sensor.paystatus == 'NONE') {
                $scope.sensor.paystatus = 'BYSELF';
            } else {
                $scope.sensor.paystatus = 'NONE';
            }
        };
        $scope.OnSelectPayMode = function(e, mode) {
            e.preventDefault();
            $scope.sensor.paystatus = mode;
        };
    });
}]);