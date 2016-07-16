angular.module('app').controller('DeviceIndex', ["$scope", "$uibModal", "$api", "Auth", "UI", function($scope, $uibModal, $api, Auth, UI) {

    var DefalutProjectStoreKey = 'department.project';

    Auth.Check(function() {

        function GetDevice(projectID) {

            $api.device.type({
                project: projectID || undefined
            }, function(data) {

                $scope.device = data.result;

                var viewOfDevice = [];
                angular.forEach($scope.device, function(dev) {
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
                    name: '设备类型',
                    level: 0
                }];

            });

        }

        $api.project.info(function(data) {
            $scope.projects = angular.isArray(data.result) ? data.result : data.result && [data.result] || [];
            angular.forEach($scope.projects, function(item) {
                this[item._id] = item;
            }, $scope.projects);
            $scope.projects.selected = ($scope.projects[UI.GetPageItem(DefalutProjectStoreKey)] || $scope.projects[0] || {})._id;
        });
        //选择项目后联动查询能耗类型
        $scope.$watch('projects.selected', function(projectID) {
            if (projectID) {
                UI.PutPageItem(DefalutProjectStoreKey, projectID);
                GetDevice(projectID);
            }
        });

        $scope.sensor = function(node, index) {
            //将当前属性添加到选中的传感器
            var modalInstance = $uibModal.open({
                templateUrl: 'sensorSelect.html',
                controller: 'SensorSelect',
                size: 'lg',
                resolve: {
                    ProjectID: function() {
                        return $scope.projects.selected
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