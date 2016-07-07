angular.module('app').controller('DriverIndex', ["$scope", "SettingMenu", "$q", "$modal", "Energy", "API", "Auth", "Project", "UI", "Customer", "base64", "Sensor", "Driver", function($scope, SettingMenu, $q, $modal, Energy, API, Auth, Project, UI, Customer, base64, Sensor, Driver) {

    var DefalutProjectStoreKey = 'customer.project';

    var removeCustomer = {};
    var updateSocities = {};


    Auth.Check(function() {

        SettingMenu(function(menu) {
            $scope.menu = menu;
        });

        $scope.doSaveCustomer = function(e) {
            e.preventDefault();

            var SerilizeToCustomer = function(parentNode, nodes) {
                //
                var customerNodes = {};
                _.each(nodes, function(node, index) {
                    //
                    var customerNode = {
                        id: node.id,
                        title: node.title,
                        acreage: node.acreage || 0,
                        index: index
                    };
                    if (node.originid && node.originid != node.id) {
                        updateSocities[node.originid] = node.id;
                    }
                    var childrens = SerilizeToCustomer(customerNode, node.nodes);
                    if (childrens) {
                        customerNode['childrens'] = childrens;
                    }

                    customerNodes[node.id] = customerNode;
                });
                return customerNodes;
            };

            var customerTree = SerilizeToCustomer(null, $scope.viewOfDriver[0].nodes);
            console.log(customerTree, removeCustomer, updateSocities);
            var projectCustomer = {
                socities: customerTree,
                project: $scope.projects.title
            };
            console.log(projectCustomer);
            API.Query(Customer.update, projectCustomer, function(result) {
                //
                console.log(result);
                if (result.err) {
                    responseError(result.err);
                } else {
                    //Update Sensor's Socity
                    API.Query(Sensor.info, {
                        project: $scope.projects.title
                    }, function(result) {
                        if (result.err) {} else {
                            //
                            UpdateSensorSocities();
                            GetDriver($scope.projects.title);
                        }
                    });
                }
            });
        };

        function InitialDriverForPage(parent, driver, level) {
            if (!driver) {
                return undefined;
            }

            var driverArray = [];
            _.each(driver, function(v) {
                if (parent) {
                    v.id = parent.id + '/' + v.name;
                } else {
                    v.id = v.name;
                }
                v.title = v.name;
                v.level = level;
                v.nodes = InitialDriverForPage(v, v.driver, level + 1);
                v.childrens = null;
                v.parent = parent;


                driverArray.push(v);
            });
            driverArray.sort(function(a, b) {
                return a.index > b.index ? 1 : -1
            });
            return driverArray;
        }

        function GetDriver(projectID) {
            //
            removeCustomer = {};
            updateSocities = {};
            $scope.projects.title = projectID;
            API.Query(Customer.info, {
                project: projectID
            }, function(result) {
                if (result.err) {
                    //
                } else {
                    var customers = result.result;

                    if (customers) {
                        var viewOfDriver = InitialDriverForPage(null, customers.socities, 1);
                        $scope.viewOfDriver = [{
                            nodes: viewOfDriver,
                            title: '社会属性',
                            level: 0
                        }];
                        console.log($scope.viewOfDriver);
                    } else {
                        $scope.viewOfDriver = [{
                            nodes: [],
                            title: '社会属性',
                            level: 0
                        }];
                    }
                }
            }, responseError)
        }

        $q.all([
            API.QueryPromise(Project.info, {}).$promise,
            API.QueryPromise(Driver.enum, {}).$promise
        ]).then(
            function(result) {
                //
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

                //
                $scope.Drivers = result[1].result;
                //Build Drivers TreeNode
                var viewOfDriver = InitialDriverForPage(null, $scope.Drivers, 1);
                $scope.viewOfDriver = [{
                    nodes: viewOfDriver,
                    title: '驱动列表',
                    level: 0
                }];
                console.log($scope.viewOfDriver);
            });

        //选择项目后联动查询能耗类型
        $scope.$watch('projects.title', function(projectID) {
            if (projectID) {
                UI.PutPageItem(DefalutProjectStoreKey, projectID);
                $scope.projects.title = projectID;
            }
        });

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
                if (removeCustomer[node.id]) {
                    removeCustomer[node.id] = null;
                }
                _.each(node.nodes, function(n) {
                    recursionUpdate(n);
                });
            };
            recursionUpdate(node);

            console.log(node, removeCustomer);
        };

        $scope.OnSelectSensor = function(node) {
            console.log(node);
            //将当前属性添加到选中的传感器
            var modalInstance = $modal.open({
                templateUrl: 'sensorSelect.html',
                controller: 'SensorSelect',
                size: 'lg',
                resolve: {
                    ProjectID: function() {
                        return $scope.projects.title
                    },
                    Driver: function() {
                        return node.id;
                    }
                }
            });

            modalInstance.result.then(function(sensors) {
                //
            }, function() {});
        };

        function responseError(result) {
            UI.AlertError(result.data.message)
        }

    });
}]);