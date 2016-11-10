angular.module('app').controller('CollectorCreate', ["$scope", "$state", "Collector", "API", "Auth", "UI", function ($scope, $state, Collector, API, Auth, UI) {
    Auth.Check(function () {

        $scope.collector = {
            project: $scope.Project.selected._id
        };

        $scope.submit = function () {
            API.Query(Collector.add, $scope.collector, function (result) {
                if (result.code) {
                    UI.AlertWarning(result.message);
                } else {
                    $state.go('admin.collector.info');
                }
            }, function (result) {
                UI.AlertError(result.data.message);
            });
        };

        $scope.isEdit = false;

    });
}]);