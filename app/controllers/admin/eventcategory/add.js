angular.module('app').controller('eventcategoryAdd', ["$rootScope", "$scope", "$state", "Eventcategory", "Auth", "API", "UI", function($rootScope, $scope, $state, Eventcategory, Auth, API, UI) {
    Auth.Check(function() {

        $scope.submit = function(e) {
            API.Query(Eventcategory.info, {
                id: $scope.eventcategory._id
            }, function(result) {
                if (result.err) {} else {
                    if (result.result) {
                        //exists
                        alert('分类ID已经存在，请重新填写');
                        return;
                    } else {
                        //
                        API.Query(Eventcategory.add, $scope.eventcategory, function(result) {
                            if (result.code) {
                                UI.AlertError(result.message);
                            } else {
                                $state.go('admin.eventcategory.info');
                            }
                        });
                    }
                }
            });
        };
    });
}]);