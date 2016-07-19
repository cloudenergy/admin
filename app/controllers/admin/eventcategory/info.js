angular.module('app').controller('eventcategoryIndex', ["$rootScope", "$scope", "SettingMenu", "Eventcategory", "API", "Auth", "UI", "$q", "Project", function($rootScope, $scope, SettingMenu, Eventcategory, API, Auth, UI, $q, Project) {

    $scope.gateways = {
        SMS: '短信通知',
        APP: 'Web，APP通知',
        EMAIL: '邮件通知',
        WECHAT: '微信通知'
    };

    $scope.isGatewayOn = function(event, gateway) {
        return event.enablegateway.indexOf(gateway) != -1;
    };

    $scope.updateGateway = function(event, gateway, elm) {
        var index = event.enablegateway.indexOf(gateway);
        elm.target.checked && index == -1 ? event.enablegateway.push(gateway) : event.enablegateway.splice(index, 1);
        var data = {
            templateid: event.id,
            gateway: event.enablegateway,
            project: $scope.projects.selected._id
        };
        // 更新事件
        API.Query(Eventcategory.update, data, function(res) {});
    };

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

        API.Query(Project.info, function(res) {
            if (!res.err) {
                $scope.projects = angular.isArray(res.result) ? res.result : [res.result];
                $scope.projects.selected = $scope.projects.length ? $scope.projects[0] : null;
            }
        });

        $scope.$watch('projects.selected', function(n) {
            if (n) {
                API.Query(Eventcategory.info, {
                    project: n._id
                }, function(result) {
                    if (result.err) {
                        //error
                    } else {
                        $scope.Eventcategory = result.result;
                    }
                });
            }
        });

        $scope.DoRemove = function(e, id, index) {
            e.preventDefault();
            var removeIndex = index;
            API.Query(Eventcategory.delete, {
                id: id
            }, function(result) {
                $scope.Eventcategory.splice(removeIndex, 1);
                //            UI.AlertSuccess('删除成功')
            }, responseError);
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
            UI.AlertError(result.data.message);
        }
    });
}]);