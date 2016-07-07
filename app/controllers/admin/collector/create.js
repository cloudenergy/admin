angular.module('app').controller('CollectorCreate', ["$scope", "$location", "SettingMenu", "Collector", "Project", "API", "Auth", "$stateParams", "UI", function($scope, $location, SettingMenu, Collector, Project, API, Auth, $stateParams, UI) {
    Auth.Check(function() {

        $scope.submit = function() {
            var collector = angular.copy($scope.collector)
            collector.project = collector.project._id;

            API.Query(Collector.add, collector, function(result) {
                if (result.code) {
                    //
                    UI.AlertWarning(result.message);
                } else {
                    $location.path('/admin/collector/info')
                }
            }, responseError)
        }

        var projectID = $stateParams.project;
        $scope.isEdit = false;
        API.Query(Project.info, function(result) {
            if (result.err) {
                //
            } else {
                $scope.projects = angular.isArray(result.result) ? result.result : [result.result];
                $scope.collector = $scope.collector || {};
                $scope.collector.project = _.find($scope.projects, function(project) {
                    return project._id == $stateParams.project;
                });
            }
        })


        function responseError(result) {
            UI.AlertError(result.data.message)
        }
    });
}]);