angular.module('app').controller('SensorCreate', ["$scope", "$location", "SettingMenu", "Sensor", "Collector", "Energy", "Customer", "Building", "API", "Auth", "UI", "$stateParams", function($scope, $location, SettingMenu, Sensor, Collector, Energy, Customer, Building, API, Auth, UI, $stateParams) {
    Auth.Check(function() {
        SettingMenu(function(menu) {
            $scope.menu = menu;
        });
        $scope.sensor = {
            mask: false,
            comi: 'd*1'
        };

        $scope.buildingID = $stateParams.building;
        var page = $stateParams.page;
        var selectEnergycategory;

        $scope.submit = function(e) {
            var sensor = angular.copy($scope.sensor);

            if (!selectEnergycategory) {
                alert('请选择传感器能耗类型');
                return;
            }

            sensor.project = $scope.sensor.building.project._id;
            sensor.building = $scope.buildingID;
            if (selectEnergycategory) {
                sensor.energy = API.RootEnergycategory(selectEnergycategory.id); //$scope.energy[energyPath[0]]._id
                sensor.energyPath = selectEnergycategory.id;
            }

            {
                var selectArray = [];
                var recursionSelect = function(node) {
                    if (!node || !node.nodes) {
                        return;
                    }
                    _.each(node.nodes, function(n) {
                        if (n.isSelect) {
                            selectArray.push(n.id);
                        }
                        recursionSelect(n);
                    });
                };

                // recursionSelect($scope.viewOfCustomer[0]);
                // sensor.socity = selectArray;
            }

            // console.log(sensor);
            API.Query(Sensor.info, {
                sids: [sensor.sid]
            }, function(result) {
                console.log(result);
                if (result.result && result.result.length > 0) {
                    //
                    $scope.alert = {
                        type: 'danger',
                        msg: '标识已经存在'
                    };
                    //                return $scope.alertWarning('标识已经存在');
                    return;
                } else {
                    API.Query(Sensor.add, sensor, function(result) {
                        if (result.code) {
                            UI.AlertError(result.message);
                        } else {
                            $location.path('/admin/sensor/info').search({
                                'page': page,
                                'building': $scope.buildingID
                            });
                        }
                    }, responseError)
                }
            }, function(err) {
                console.log(err);
            });

            function pickEnergyPath(trees) {
                var i, l, input, tree, subtree,
                    path = []

                for (var i = 0, l = trees.length; i < l; i++) {
                    tree = trees.eq(i)
                    input = tree.find('input').eq(0)
                    subtree = tree.children('tree').children().children()

                    if (input[0].checked) {
                        path.push(i)
                        path.push(input.val())
                        break
                    }

                    if (subtree) {
                        var subpath = pickEnergyPath(subtree)

                        if (subpath.length) {
                            path.push(i)
                            path = path.concat(subpath)
                            break
                        }
                    }
                }

                return path
            }
        };

        API.Query(Building.info, {
            id: $scope.buildingID
        }, function(result) {
            if (result.err) {} else {
                $scope.building = result.result;
                if ($scope.building) {
                    $scope.sensor.building = $scope.building;
                }
                //if($scope.buildings.length > 0){
                //    $scope.sensor.building = _.find($scope.buildings, function(building){
                //        return building._id == buildingID;
                //    })
                //}
                API.Query(Energy.info, {
                    project: $scope.building.project._id
                }, function(result) {
                    console.log(result);
                    if (result.err) {} else {
                        var energy = result.result;
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
                //显示社会属性
                /*
                API.Query(Customer.info, {
                    project: $scope.building.project._id
                }, function(result) {
                    //                console.log(result);
                    if (result.err) {} else {
                        var socities = result.result;

                        if (socities) {
                            var viewOfCustomer = BuildSocitiesTree(null, socities.socities, 1);
                            $scope.viewOfCustomer = [{
                                nodes: viewOfCustomer,
                                title: '社会属性',
                                level: 0
                            }];
                            //                        console.log($scope.viewOfCustomer);
                        } else {
                            $scope.viewOfCustomer = [{
                                nodes: [],
                                title: '社会属性',
                                level: 0
                            }];
                        }
                    }
                });
                */
            }
        }, responseError);

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
                v.isSelect = false;
                socitiesArray.push(v);
            });
            socitiesArray.sort(function(a, b) {
                return a.title > b.title ? 1 : -1
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
                return a.title > b.title ? 1 : -1
            });
            return energyArray;
        }

        $scope.addSocity = function(socity) {
            $scope.socities = _.reject($scope.socities, function(v) {
                return v._id == socity._id;
            });
            $scope.sensorsocities.push(socity);
        };
        $scope.removeSocity = function(socity) {
            $scope.sensorsocities = _.reject($scope.sensorsocities, function(v) {
                return v._id == socity._id;
            });
            $scope.socities.push(socity);
        };
        $scope.SwitchSocity = function(e, socity) {
            e.preventDefault();

            socity.isEnable = !socity.isEnable;
            if (socity.isEnable) {
                socity.isEnable = false;
            } else {
                socity.isEnable = true;
            }
        };

        $scope.sensorsocities = [];

        function responseError(result) {
            $scope.alertError(result.data.message)
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
                node.isSelect = isSelect
            };

            groupSelect(node, node.isSelect);
        };

        $scope.onEnergyChoice = function(node) {
            if (node.nodes) {
                return;
            }
            console.log(node);
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