angular.module('app').controller('projectCreate', ["$rootScope", "$scope", "$state", "Project", "Energycategory", "Auth", "API", "UI", function ($rootScope, $scope, $state, Project, Energycategory, Auth, API, UI) {
    $scope.ondutyHour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $scope.ondutyMinute = ['00', '10', '20', '30', '40', '50'];
    $scope.offdutyHour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $scope.offdutyMinute = ['00', '10', '20', '30', '40', '50'];
    $scope.ondutyHour.selected = '8';
    $scope.ondutyMinute.selected = '00';
    $scope.offdutyHour.selected = '17';
    $scope.offdutyMinute.selected = '00';
    Auth.Check(function () {

        $scope.submit = function (e) {
            var projectArray = new Array();
            $scope.project.onduty = $scope.ondutyHour.selected + ':' + $scope.ondutyMinute.selected;
            $scope.project.offduty = $scope.offdutyHour.selected + ':' + $scope.offdutyMinute.selected;
            projectArray.push($scope.project);
            API.Query(Project.add, projectArray, function (result) {
                if (result.code) {
                    UI.AlertError(result.message);
                } else {
                    UI.AlertSuccess('新增成功');
                    $state.go('admin.project.info');
                }
            }, function (result) {
                UI.AlertError(result.data.message);
            });
        };

        API.Query(Energycategory.info, function (result) {
            if (result.err) {
                UI.AlertError(result.data.message);
            } else {
                $scope.energycategory = result.result;
            }
        });
    });
}]);