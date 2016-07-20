angular.module('app').controller('energycategoryinfo', ["$rootScope", "$scope", "Energycategory", "API", "Auth", "UI", function($rootScope, $scope, Energycategory, API, Auth, UI) {

    $scope.operateStatus = {
        add: {
            isEnable: false,
            url: '/add'
        },
        delete: {
            isEnable: false,
            url: '/delete'
        },
        update: {
            isEnable: false,
            url: '/update'
        }
    };

    $scope.askingRemoveID = undefined;

    Auth.Check($scope.operateStatus, function() {

        API.Query(Energycategory.info, function(result) {
            if (result.err) {
                //error
            } else {
                $scope.Energycategory = result.result;
            }
        });

        $scope.DoRemove = function(e, id, index) {
            e.preventDefault();

            //        index = $rootScope.convertIndex(index);
            var removeIndex = index;
            API.Query(Energycategory.delete, {
                id: id
            }, function(result) {
                $scope.Energycategory.splice(removeIndex, 1);
                //            UI.AlertSuccess('删除成功')
            }, responseError)
        };
        $scope.AskForRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = id;
        };
        $scope.CancelRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = undefined;
        };


        function responseError(result) {
            UI.AlertError(result.data.message)
        }
    });
}]);