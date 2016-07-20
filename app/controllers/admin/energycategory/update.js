angular.module('app').controller('energycategoryupdate', ["$rootScope", "$scope", "$stateParams", "$location", "Energycategory", "Auth", "API", "UI", function($rootScope, $scope, $stateParams, $location, Energycategory, Auth, API, UI) {
    Auth.Check(function() {

        $scope.submit = function(e) {
            API.Query(Energycategory.update, $scope.energycategory, function(result) {
                UI.AlertSuccess('保存成功');

                $location.path('/admin/energycategory/info')
            }, function(result) {
                UI.AlertError(result.data.message)
            })
        }

        API.Query(Energycategory.info, {
            id: $stateParams.id
        }, function(result) {
            if (result.err) {
                //
            } else {
                $scope.energycategory = result.result;
            }
        }, responseError);

        function responseError(result) {
            UI.AlertError(result.data.message)
        }
    });
}]);