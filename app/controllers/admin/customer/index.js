angular.module('app').controller('CustomerIndex', ["$scope", "$q", "$api", "$uibModal", "Auth", "UI", function($scope, $q, $api, $uibModal, Auth, UI) {

    var KEY_PROJECT = EMAPP.Account._id + '_customer_index_projectid';

    Auth.Check(function() {

        function InitialCustomerForPage(parent, customer, level) {
            var customerArray = [];
            if (customer) {
                angular.forEach(customer, function(v) {
                    v.originid = v.id;
                    v.origintitle = v.title;
                    v.id = v.id;
                    v.title = v.title;
                    v.acreage = v.acreage || 0;
                    v.level = level;
                    v.nodes = InitialCustomerForPage(v, v.child, level + 1);
                    v.parent = parent;
                    customerArray.push(v);
                });
                customerArray.sort(function(a, b) {
                    return a.index > b.index ? 1 : -1;
                });
            }
            return customerArray;
        }

        function GetCustomer() {
            $api.customer.info({
                project: $scope.projects.selected
            }, function(data) {
                if (data.result) {
                    $scope.viewOfCustomer = [{
                        level: 0,
                        type: 'NODE',
                        title: '社会属性',
                        nodes: InitialCustomerForPage(null, data.result, 1)
                    }];
                } else {
                    $scope.viewOfCustomer = [{
                        level: 0,
                        type: 'NODE',
                        title: '社会属性',
                        nodes: []
                    }];
                }
            }, function responseError(result) {
                UI.AlertError(result.data.message);
            });
        }

        $api.project.info(function(data) {
            data.selected = localStorage.getItem(KEY_PROJECT);
            $scope.projects = angular.isArray(data.result) ? data.result : data.result && [data.result] || [];
            $scope.projects.select = function() {
                if ($scope.projects.selected) {
                    localStorage.setItem(KEY_PROJECT, $scope.projects.selected);
                    GetCustomer();
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

        $scope.newNode = function(node) {
            node.nodes.push({
                // id: '',
                enable: true,
                editing: true,
                title: '',
                origintitle: '',
                acreage: 0,
                level: node.level + 1,
                type: 'NODE',
                parent: node,
                nodes: []
            });
        };

        $scope.saveNode = function(node) {

            if (!node.title) {
                UI.AlertWarning('请输入名称');
                return false;
            }

            delete node.editing;
            node.origintitle = node.originid ? node.origintitle : node.title;

            $api.customer.update({
                node: {
                    id: node.id || undefined,
                    title: node.title,
                    type: node.id ? node.type : 'NODE',
                    parent: node.parent.id
                },
                method: node.id ? 'UPDATE' : 'ADD',
                project: $scope.projects.selected
            }, function(data) {
                UI.AlertSuccess(node.id ? '更新成功' : '添加成功');
                if (!node.id) {
                    node.id = node.originid = data.result.id;
                    node.origintitle = node.title;
                }
            });

        };

        $scope.editNode = function(node) {
            node.origintitle = node.title;
            node.editing = true;
        };

        $scope.cancelEdit = function(node) {
            if (node.id) {
                node.title = node.origintitle;
            } else {
                angular.forEach(node.parent.nodes, function(item) {
                    if (item.$$hashKey !== node.$$hashKey) {
                        this.push(item);
                    }
                }, node.parent.nodes = []);
            }
            delete node.editing;
        };

        $scope.deleteNode = function(node, target) {
            $api.customer.update({
                node: {
                    id: node.id
                },
                method: 'REMOVE',
                project: $scope.projects.selected
            }, function(data) {
                UI.AlertSuccess('删除成功');
                target.remove();
            });
        };

        $scope.sensor = function(node) {
            //将当前属性添加到选中的传感器
            $uibModal.open({
                templateUrl: 'sensorSelect.html',
                controller: 'SensorSelect',
                resolve: {
                    ProjectID: function() {
                        return $scope.projects.selected;
                    },
                    SelectKEY: function() {
                        return (function each(nodes, selected) {
                            angular.forEach(nodes, function(item) {
                                if (item.type === 'DEV') {
                                    selected[item.key] = 1;
                                } else {
                                    each(item.nodes, selected);
                                }
                            });
                            return selected;
                        }(node.nodes, {}));
                    }
                }
            }).result.then(function(Selected) {

                var promiseList = [],
                    removeNode = {};

                (function each(nodes) {
                    angular.forEach(nodes, function(item) {
                        if (item.type === 'DEV') {
                            Selected[item.key] === 0 && promiseList.push($api.customer.update({
                                node: {
                                    id: item.id
                                },
                                method: 'REMOVE',
                                project: $scope.projects.selected
                            }, function() {
                                removeNode[item.id] = true;
                            }).$promise);
                        } else {
                            each(item.nodes);
                        }
                    });
                }(node.nodes));

                angular.forEach(Selected, function(val, key) {
                    val && angular.isString(val) && promiseList.push($api.customer.update({
                        node: {
                            type: 'DEV',
                            title: val,
                            key: key,
                            parent: node.id
                        },
                        method: 'ADD',
                        project: $scope.projects.selected
                    }, function(data) {
                        node.nodes.push({
                            originid: data.result.id,
                            origintitle: data.result.title,
                            id: data.result.id,
                            title: data.result.title,
                            acreage: 0,
                            level: node.level + 1,
                            type: 'DEV',
                            key: data.result.key,
                            parent: node,
                            nodes: []
                        });
                    }).$promise);
                });

                $q.all(promiseList).then(function() {
                    (function each(node) {
                        angular.forEach(node.nodes, function(item) {
                            !removeNode[item.id] && this.push(item);
                            item.nodes.length && each(item);
                        }, node.nodes = []);
                    }(node));
                });

            });

        };

    });
}]);