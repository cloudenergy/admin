/**
 * todo: 更新地理位置有点问题？有时出不来地图，这个指令写的也有问题，
 * 不能初始化一个默认点，选中一个点时还依赖上级 $scope
 */
angular.module('app').controller('CollectorEdit', ["$scope", "$state", "$stateParams", "Collector", "Project", "API", "Auth", "UI", function ($scope, $state, $stateParams, Collector, Project, API, Auth, UI) {
    Auth.Check(function () {

        $scope.submit = function () {
            $scope.collector && API.Query(Collector.update, $scope.collector, function (result) {
                $state.go('admin.collector.info');
            }, responseError);
        };

        $scope.isEdit = true;

        API.Query(Collector.info, {
            id: $stateParams.id
        }, function (result) {
            if (!result.err) {
                $scope.collector = angular.extend(result.result, {
                    project: $scope.Project.selected._id
                });
            }
        }, responseError);

        function responseError(result) {
            UI.AlertError(result.data.message);
        }
    });
}]);