angular.module('app').controller('DeviceIndex', ["$scope", "SettingMenu", "$q", "$modal", "Energy", "API", "Auth", "Project", "UI", "Device", "base64", "Sensor", function($scope, SettingMenu, $q, $modal, Energy, API, Auth, Project, UI, Device, base64, Sensor) {

    var removeEnergycategory = {};
    var updateEnergycategory = {};
    var DefalutProjectStoreKey = 'department.project';

    Auth.Check(function() {

        SettingMenu(function(menu) {
            $scope.menu = menu;
        });

        function GetDevice(projectID) {
            var viewOfDevice = [];
            _.each($scope.device, function(dev) {
                viewOfDevice.push({
                    id: dev.id,
                    name: dev.name,
                    childrens: [],
                    ischild: false,
                    level: 1
                });
            });

            $scope.viewOfDevice = [{
                nodes: viewOfDevice,
                title: '设备类型',
                level: 0
            }];

            removeEnergycategory = {};
            updateEnergycategory = {};
            $scope.projects.title = projectID;
        }

        $q.all([
            API.QueryPromise(Project.info, {}).$promise,
            API.QueryPromise(Device.type, {}).$promise
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
                $scope.device = result[1].result;
            }
        });

        //选择项目后联动查询能耗类型
        $scope.$watch('projects.title', function(projectID) {
            if (projectID) {
                UI.PutPageItem(DefalutProjectStoreKey, projectID);
                GetDevice(projectID);
            }
        });

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
                    DeviceType: function() {
                        return node.id;
                    }
                }
            });

            modalInstance.result.then(function(sensors) {
                //
            }, function() {});
        };

        $scope.switchUnitPriceType = function(member) {
            member.unitprice.isnormal = !member.unitprice.isnormal;
        };

    });
}]);