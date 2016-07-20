/**
 * todo: 更新地理位置有点问题？有时出不来地图，这个指令写的也有问题，
 * 不能初始化一个默认点，选中一个点时还依赖上级 $scope
 */
angular.module('app').controller('CollectorEdit', ["$scope", "$location", "$stateParams", "Collector", "Project", "API", "Auth", "UI", function($scope, $location, $stateParams, Collector, Project, API, Auth, UI) {
    Auth.Check(function() {
        $scope.submit = function() {
            var collector = angular.copy($scope.collector);
            collector.project = collector.project._id;
            collector._id = $stateParams.id;
            console.log(collector);

            API.Query(Collector.update, collector, function(result) {
                $location.path('/admin/collector/info');
            }, responseError);
        };

        $scope.isEdit = true;
        API.Query(Collector.info, {
            id: $stateParams.id
        }, function(result) {
            if (result.err) {} else {
                $scope.collector = result.result;

                API.Query(Project.info, function(result) {
                    if (result.err) {
                        //
                    } else {
                        $scope.projects = angular.isArray(result.result) ? result.result : [result.result];
                        $scope.collector.project = _.find($scope.projects, function(project) {
                            return project._id == $scope.collector.project._id;
                        });
                    }
                });
            }
        }, responseError);

        function responseError(result) {
            UI.AlertError(result.data.message);
        }
    });
}]);