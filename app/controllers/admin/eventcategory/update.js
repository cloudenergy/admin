angular.module('app').controller('eventcategoryUpdate', ["$rootScope", "$scope", "$stateParams", "$location", "SettingMenu", "Eventcategory", "Auth", "API", "UI", function($rootScope, $scope, $stateParams, $location, SettingMenu, Eventcategory, Auth, API, UI) {
    Auth.Check(function() {

        $scope.submit = function(e) {
            API.Query(Eventcategory.update, $scope.eventcategory, function(result) {
                $location.path('/admin/eventcategory/info')
            }, function(result) {
                UI.AlertError(result.data.message)
            })
        };

        API.Query(Eventcategory.info, {
            id: $stateParams.id
        }, function(result) {
            if (result.code) {
                UI.AlertError(result.message);
            } else {
                $scope.eventcategory = result.result;
            }
        }, responseError);

        function responseError(result) {
            UI.AlertError(result.data.message)
        }
    });
}]);