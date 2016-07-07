angular.module('app').controller('EnergyIndex', ["$scope", "SettingMenu", "$q", "$modal", "Energy", "API", "Auth", "Project", "UI", "Energycategory", "base64", "Sensor", function($scope, SettingMenu, $q, $modal, Energy, API, Auth, Project, UI, Energycategory, base64, Sensor) {

    var DefalutProjectStoreKey = 'energy.project';
    var removeEnergycategory = {};
    var updateEnergycategory = {};

    Auth.Check(function() {

        SettingMenu(function(menu) {
            $scope.menu = menu;
        });

        function TitleToCode(title) {
            return base64.encode(title);
        }

        function GenereateID(parent, title) {
            if (parent && parent.id && parent.id.length) {
                return parent.id + '|' + TitleToCode(title);
            } else {
                return TitleToCode(title);
            }
        }

        $scope.doSaveEnergy = function(e) {
            e.preventDefault();

            var SerilizeToEnergy = function(parent, nodes) {
                //
                var energyNodes = {};
                _.each(nodes, function(node) {
                    //
                    var energyNode = {
                        id: node.id,
                        title: node.title
                    };
                    if (node.originid && node.originid != node.id) {
                        updateEnergycategory[node.originid] = node.id;
                    }
                    var childrens = SerilizeToEnergy(energyNode, node.nodes);
                    if (!_.isEmpty(childrens)) {
                        energyNode['childrens'] = childrens;
                    }
                    energyNodes[energyNode.id] = energyNode;
                });
                return energyNodes;
            };

            var energy = SerilizeToEnergy(null, $scope.viewOfEnergy[0].nodes);
            //Filter energy which do not exists child energies
            {
                var tmpEnergy = {};
                _.each(energy, function(e) {
                    if (e.childrens) {
                        tmpEnergy[e.id] = e;
                    }
                });
                energy = tmpEnergy;
            }
            console.log(energy);
            var projectEnergy = {
                energy: energy,
                _id: $scope.projects.title
            };

            API.Query(Energy.update, projectEnergy, function(result) {
                //
                console.log(result);
                if (result.err) {
                    responseError(err);
                }

                //remove Energycategory
                _.each(removeEnergycategory, function(energycategory) {
                    var updateSensor = {
                        query: {
                            energyPath: energycategory.id
                        },
                        queryoperate: {
                            'set': {
                                energy: '',
                                energyPath: ''
                            }
                        }
                    };
                    API.Query(Sensor.update, updateSensor, function(result) {
                        if (result.err) {} else {
                            console.log(result);
                        }
                    })
                });

                //update Energycategory
                _.map(updateEnergycategory, function(v, k) {
                    var queryObj = {
                        energy: API.RootEnergycategory(k),
                        energyPath: k,
                        project: $scope.projects.title
                    };
                    var updateObj = {
                        'set': {
                            energy: API.RootEnergycategory(v),
                            energyPath: v
                        }
                    };
                    console.log(queryObj, updateObj);
                    API.Query(Sensor.update, {
                        query: queryObj,
                        queryoperate: updateObj
                    }, function(result) {});
                });
                GetEnergy($scope.projects.title);

                UI.AlertSuccess('保存成功');
            });
        };

        function InitialEnergyForPage(parent, energy, level) {
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

                v.originid = v.id;
                v.origintitle = v.title;
                v.parent = parent;
                v.level = level;
                v.nodes = InitialEnergyForPage(v, v.childrens, level + 1);
                energyArray.push(v);
            });
            energyArray.sort(function(a, b) {
                return a.title > b.title ? 1 : -1
            });
            return energyArray;
        }

        function GetEnergy(projectID) {
            removeEnergycategory = {};
            updateEnergycategory = {};
            $scope.projects.title = projectID;
            API.Query(Energy.info, {
                project: projectID
            }, function(data) {
                if (data.err) {} else {
                    console.log(data.result);
                    var energy = data.result.energy;
                    if (!energy) {
                        energy = {};
                    }

                    _.each($scope.energycategory, function(ec) {
                        if (!energy[ec._id]) {
                            energy[ec._id] = {
                                id: ec._id,
                                childrens: [],
                                ischild: false
                            };
                        }
                        var obj = energy[ec._id];
                        obj.unit = ec.unit;
                        obj.standcol = ec.standcol;
                        obj.title = ec.title;
                    });
                    $scope.energycategory.sort(function(a, b) {
                        return a.title > b.title ? 1 : -1
                    });

                    var viewOfEnergy = InitialEnergyForPage(null, energy, 1);
                    $scope.viewOfEnergy = [{
                        nodes: viewOfEnergy,
                        title: '能耗分类',
                        level: 0
                    }];
                }
            }, responseError)
        }

        $q.all([
            API.QueryPromise(Project.info, {}).$promise,
            API.QueryPromise(Energycategory.info, {}).$promise
        ]).then(function(result) {
            if (result[0].err || result[1].err) {
                //
            } else {
                $scope.projects = angular.isArray(result[0].result) ? result[0].result : [result[0].result];
                var defaultProject = UI.GetPageItem(DefalutProjectStoreKey);
                if (defaultProject) {
                    defaultProject = _.find($scope.projects, function(project) {
                        return project._id == defaultProject;
                    });
                    $scope.projects.title = defaultProject._id;
                } else {
                    if ($scope.projects.length > 0) {
                        $scope.projects.title = $scope.projects[0]._id;
                    }
                }
                $scope.energycategory = result[1].result;
            }
        });

        //选择项目后联动查询能耗类型
        $scope.$watch('projects.title', function(projectID) {
            if (projectID) {
                UI.PutPageItem(DefalutProjectStoreKey, projectID);
                GetEnergy(projectID);
            }
        });

        //如果函数名为remove|removeNode会被覆盖
        $scope.deleteNode = function(scope, node) {
            var recursionDelete = function(node) {
                if (!node) {
                    return;
                }
                _.each(node.nodes, function(n) {
                    recursionDelete(n);
                    if (node.originid) {
                        removeEnergycategory[n.originid] = n;
                    }
                });

                if (node.originid) {
                    removeEnergycategory[node.originid] = node;
                }
            };

            recursionDelete(node);
            console.log(removeEnergycategory);
            scope.remove();
        };

        $scope.enable = function(node) {
            node.enable = !node.enable;
        };

        $scope.toggle = function(scope) {
            scope.toggle();
        };

        $scope.newSubItem = function(scope, node) {
            var nodeData = scope.node;
            if (!nodeData.nodes) {
                nodeData.nodes = [];
            }
            nodeData.nodes.push({
                id: '',
                enable: true,
                editing: true,
                title: '',
                origintitle: '',
                level: nodeData.level + 1,
                parent: node,
                nodes: []
            });
        };

        $scope.edit = function(node) {
            node.editing = true;
        };
        $scope.cancelEditing = function(scope, node) {
            if (!node.title.length && !node.origintitle.length) {
                $scope.deleteNode(scope, node);
            } else {
                node.editing = false;
                node.title = node.origintitle;
            }

        };

        $scope.save = function(node) {
            if (!node.title.length) {
                alert('请输入分类名称');
                return false;
            }
            //查找同层是否有相同名称
            if (node.parent) {
                var isFind = _.find(node.parent.nodes, function(n) {
                    if (!n.id || !n.id.length || n.editing) {
                        return;
                    }
                    if (n.title == node.title) {
                        alert('已有相同名称，请确认');
                        return true;
                    }
                    return false;
                });
                if (isFind) {
                    return false;
                }
            }

            node.editing = false;
            if (!node.originid) {
                node.origintitle = node.title;
            }

            var recursionUpdate = function(node) {
                node.id = GenereateID(node.parent, node.title);
                //find if node.is is exists in removeList(Just to prevent remove/add same node)
                if (removeEnergycategory[node.id]) {
                    removeEnergycategory[node.id] = null;
                }
                _.each(node.nodes, function(n) {
                    recursionUpdate(n);
                });
            };
            recursionUpdate(node);

            console.log(node, removeEnergycategory);
        };

        $scope.sensor = function(node, index) {
            console.log(node, index);
            //将当前属性添加到选中的传感器
            var modalInstance = $modal.open({
                templateUrl: 'sensorSelect.html',
                controller: 'SensorSelect',
                size: 'lg',
                resolve: {
                    ProjectID: function() {
                        return $scope.projects.title
                    },
                    EnergycategoryID: function() {
                        return node.id;
                    }
                }
            });

            modalInstance.result.then(function(sensors) {}, function() {});
        };

        $scope.switchUnitPriceType = function(member) {
            member.unitprice.isnormal = !member.unitprice.isnormal;
        };

        function responseError(result) {
            UI.AlertError(result.data.message)
        }

    });
}]);