angular.module('app').controller('appidsecretroleres', ["Config", "$scope", "$stateParams", "$q", "$modal", "$cookies", "$location", "SettingMenu", "Account", "AppIDSecret", "md5", "API", "Auth", "UI", "BillingService", "Energycategory", "Project", "Building", function(Config, $scope, $stateParams, $q, $modal, $cookies, $location, SettingMenu, Account, AppIDSecret, md5, API, Auth, UI, BillingService, Energycategory, Project, Building) {

    var originProject;
    Auth.Check(function() {

        $scope.askingRemoveID = null;
        var adminUser = $cookies.user;
        var editUser = $stateParams.id;
        if (adminUser != undefined && adminUser != null) {
            //获取管理员和所编辑用户的权限树
            $q.all([
                API.QueryPromise(Account.info, {
                    id: adminUser
                }).$promise, API.QueryPromise(AppIDSecret.info, {
                    id: editUser
                }).$promise
            ]).then(
                function(result) {
                    //
                    if (result[0].err || result[1].err) {
                        //error
                    } else {
                        //
                        $scope.adminUser = result[0].result;
                        $scope.editUser = result[1].result;
                        if (!$scope.editUser) {
                            return;
                        }
                        if (!$scope.editUser.resource) {
                            $scope.editUser.resource = {
                                project: [],
                                sensor: [],
                                building: [],
                                customer: []
                            };
                        }
                        originProject = $scope.editUser.resource.project || [];

                        //如果admin的权限是*，则需要查询所有的项目
                        API.Query(Project.info, function(result) {
                            if (result.err) {} else {
                                var projects = angular.isArray(result.result) ? result.result : [result.result];
                                $scope.roleResOfProject = [];
                                var enumFromIDToDetail = function(projectIDs, projectDetail) {
                                    //
                                    var result = [];
                                    _.each(projectIDs, function(projectid) {
                                        var detailP = _.find(projectDetail, function(p) {
                                            return p._id == projectid;
                                        });
                                        if (detailP) {
                                            result.push(detailP);
                                        }
                                    });
                                    return result;
                                };

                                //被编辑者拥有的项目列表
                                if ($scope.editUser.resource && $scope.editUser.resource.project) {
                                    //
                                    $scope.viewOfEditUserProject = enumFromIDToDetail(
                                        $scope.editUser.resource.project,
                                        projects
                                    );
                                }

                                $scope.roleResOfProject = projects;
                            }
                        });
                    }
                });
        }

        $scope.SaveRoleRes = function() {
            //计算pab需要增项/减项
            var addObject = _.difference(
                $scope.editUser.resource.project,
                _.intersection(originProject, $scope.editUser.resource.project)
            );
            var removeObj = _.difference(
                originProject,
                _.intersection($scope.editUser.resource.project, originProject)
            );
            console.log(addObject, removeObj);
            if (!$scope.editUser.resource.project.length) {
                $scope.editUser.resource = {
                    empty: true
                };
            } else {
                _.map($scope.editUser.resource, function(v, k) {
                    if (_.isEmpty(v)) {
                        $scope.editUser.resource[k] = '*';
                    }
                });
                $scope.editUser.resource['empty'] = false;
            }

            var obj = {
                id: $scope.editUser._id,
                resource: $scope.editUser.resource
            };
            console.log(obj);
            API.Query(AppIDSecret.update, obj, function(result) {
                if (result.err) {} else {
                    $location.path('/admin/appidsecret/info');
                }
            });
        };
        //添加项目
        $scope.AddProject = function() {
            var modalInstance = $modal.open({
                templateUrl: 'projectSelect.html',
                controller: 'ProjectSelect',
                size: 'md',
                resolve: {
                    Projects: function() {
                        return $scope.roleResOfProject;
                    },
                    ProjectIDs: function() {
                        return $scope.editUser.resource && $scope.editUser.resource.project || [];
                    }
                }
            });

            modalInstance.result.then(function(result) {
                //
                if (_.isArray(result)) {
                    //
                    if ($scope.viewOfEditUserProject && $scope.viewOfEditUserProject.length) {
                        $scope.viewOfEditUserProject = _.union($scope.viewOfEditUserProject, result);
                    } else {
                        $scope.viewOfEditUserProject = result;
                    }
                    $scope.editUser.resource.project = [];
                    _.each($scope.viewOfEditUserProject, function(project) {
                        $scope.editUser.resource.project.push(project._id);
                    });
                } else {
                    if (result._id == '*') {
                        $scope.viewOfEditUserProject = [];
                    }
                    $scope.editUser.resource.project = $scope.adminUser.resource.project;
                    $scope.viewOfEditUserProject = $scope.roleResOfProject;
                }
            }, function() {});
        };
        //添加建筑
        $scope.AddBuildings = function(e, projectID) {
            e.preventDefault();

            var modalInstance = $modal.open({
                templateUrl: 'buildingSelect.html',
                controller: 'BuildingSelect',
                size: 'md',
                resolve: {
                    ProjectID: function() {
                        return projectID;
                    },
                    BuildingIDs: function() {
                        return $scope.editUser.resource && $scope.editUser.resource.building || [];
                    }
                }
            });

            modalInstance.result.then(function(buildings) {
                //
                //            console.log(buildings.select, buildings.unselect);
                if (!$scope.editUser.resource.building) {
                    $scope.editUser.resource.building = [];
                }
                $scope.editUser.resource.building = _.difference($scope.editUser.resource.building, buildings.unselect);
                $scope.editUser.resource.building = _.union($scope.editUser.resource.building, buildings.select);

                console.log($scope.editUser.resource.building);
            }, function() {});
        };
        //添加传感器
        $scope.AddSensors = function(e, projectID) {
            e.preventDefault();

            var modalInstance = $modal.open({
                templateUrl: 'sensorSelect.html',
                controller: 'SensorSelect',
                size: 'lg',
                resolve: {
                    ProjectID: function() {
                        return projectID;
                    },
                    SensorIDs: function() {
                        return $scope.editUser.resource && $scope.editUser.resource.sensor || [];
                    }
                }
            });

            modalInstance.result.then(function(sensors) {
                //
                //            console.log(buildings.select, buildings.unselect);
                if (!$scope.editUser.resource.sensor) {
                    $scope.editUser.resource.sensor = [];
                }
                $scope.editUser.resource.sensor = _.difference($scope.editUser.resource.sensor, sensors.unselect);
                $scope.editUser.resource.sensor = _.union($scope.editUser.resource.sensor, sensors.select);

                console.log($scope.editUser.resource.sensor);
            }, function() {});
        };

        //删除项目
        $scope.DoRemove = function(e, id, index) {
            e.preventDefault();

            //        var removeIndex = UI.GetAbsoluteIndex($scope.currentPage, index);
            $scope.editUser.resource.project = _.without($scope.editUser.resource.project, id);
            $scope.viewOfEditUserProject.splice(index, 1);
            $scope.editUser.resource.project = _.without($scope.editUser.resource.project, id);
            $scope.askingRemoveID = null;
        };
        $scope.AskForRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = id;
        };
        $scope.CancelRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = undefined;
        };
    });
}]);