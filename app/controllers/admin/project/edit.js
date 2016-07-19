angular.module('app').controller('projectEdit', ["$rootScope", "$scope", "$state", "$stateParams", "SettingMenu", "Project", "Auth", "API", "UI", function($rootScope, $scope, $state, $stateParams, SettingMenu, Project, Auth, API, UI) {
    $scope.ondutyHour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $scope.ondutyMinute = ['00', '10', '20', '30', '40', '50'];
    $scope.offdutyHour = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $scope.offdutyMinute = ['00', '10', '20', '30', '40', '50'];
    Auth.Check(function() {
        SettingMenu(function(menu) {
            $scope.menu = menu;
        });

        $scope.Save = function(e) {
            $scope.project.onduty = $scope.ondutyHour.selected + ':' + $scope.ondutyMinute.selected;
            $scope.project.offduty = $scope.offdutyHour.selected + ':' + $scope.offdutyMinute.selected;

            API.Query(Project.update, $scope.project, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                } else {
                    UI.AlertSuccess('修改成功');
                    $state.go('admin.project.info');
                }
            }, function(result) {
                UI.AlertError(result.data.message);
            });
        };

        API.Query(Project.info, {
            id: $stateParams.id
        }, function(result) {
            if (result.err) {
                UI.AlertError(result.data.message);
                //
            } else {
                $scope.project = result.result;

                var onDuty = moment($scope.project.onduty, 'H:mm');
                $scope.ondutyHour.selected = onDuty.format('H');
                $scope.ondutyMinute.selected = onDuty.format('mm');

                var offDuty = moment($scope.project.offduty, 'H:mm');
                $scope.offdutyHour.selected = offDuty.format('H');
                $scope.offdutyMinute.selected = offDuty.format('mm');
            }
        }, responseError);

        function responseError(result) {
            UI.AlertError(result.data.message);
        }
    });
}]);