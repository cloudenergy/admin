angular.module('app').controller('BuildingInfo', ["$scope", "Building", "API", "Auth", "UI", function ($scope, Building, API, Auth, UI) {
    $scope.operateStatus = {
        create: {
            isEnable: false,
            url: '/create'
        },
        delete: {
            isEnable: false,
            url: '/delete'
        },
        edit: {
            isEnable: false,
            url: '/edit'
        }
    };

    $scope.askingRemoveID = undefined;

    Auth.Check($scope.operateStatus, function () {

        $scope.DoRemove = function (e, id, index) {
            e.preventDefault();

            API.Query(Building.delete, {
                id: id
            }, function (result) {
                if (!result.code) {
                    $scope.buildings.splice(index, 1);
                }
            }, responseError);
        };
        $scope.AskForRemove = function (e, id) {
            e.preventDefault();
            $scope.askingRemoveID = id;
        };
        $scope.CancelRemove = function (e, id) {
            e.preventDefault();
            $scope.askingRemoveID = undefined;
        };

        function GetBuilding() {
            API.Query(Building.info, {
                project: $scope.Project.selected._id
            }, function (result) {
                if (result.err) {
                    //error
                } else {
                    $scope.buildings = result.result;
                }
            });
        }

        //选择项目后联动查询建筑
        $scope.$watch('Project.selected', GetBuilding);

        function responseError(result) {
            UI.AlertError(result.data.message);
        }
    });
}]);