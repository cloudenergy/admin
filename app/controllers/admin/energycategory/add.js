angular.module('app').controller('energycategoryadd', ["$rootScope", "$scope", "$state", "Energycategory", "Auth", "API", "UI", function($rootScope, $scope, $state, Energycategory, Auth, API, UI) {
    Auth.Check(function() {

        $scope.submit = function(e) {
            var energycategoryArray = new Array();
            energycategoryArray.push($scope.energycategory);
            API.Query(Energycategory.add, energycategoryArray, function(result) {
                if (result.err) {
                    UI.AlertError(result.data.message);
                    //
                } else {
                    UI.AlertSuccess('保存成功');
                    $state.go('admin.energycategory.info');
                }
            });
        };
    });
}]);