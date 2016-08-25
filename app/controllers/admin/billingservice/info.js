angular.module('app').controller('BillingServiceInfo', ["$scope", "$q", "$stateParams", "$api", "Project", "Account", "API", "Auth", "$cookies", "UI", "Pab", "BillingService", "Config", function($scope, $q, $stateParams, $api, Project, Account, API, Auth, $cookies, UI, Pab, BillingService, Config) {

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
    $scope.PadShow = [];
    $scope.settingUserInfo = undefined;
    $scope.askingRemoveID = undefined;

    Auth.Check($scope.operateStatus, function() {

        $scope.$watch('Project.selected', function(selected) {
            API.Query(BillingService.info, {
                project: selected._id
            }, function(result) {
                if (!result.err) {
                    $scope.billingservices = result.result;
                    _.each($scope.billingservices, function(bs) {
                        bs.ecstring = '';
                        _.each(bs.energycategory, function(ecID) {
                            var energycategory = _.find($scope.energycategory, function(ec) {
                                return ec._id == ecID;
                            });
                            if (energycategory) {
                                bs.ecstring += energycategory.title + '，';
                            }
                        });
                        bs.ecstring = bs.ecstring.substr(0, bs.ecstring.length - 1);
                    });
                }
            });
        });

        $scope.DoRemove = function(e, id, index) {
            e.preventDefault();
            var removeIndex = UI.GetAbsoluteIndex($scope.currentPage, index);
            API.Query(BillingService.delete, {
                id: id
            }, function(result) {
                $scope.billingservices.splice(removeIndex, 1);
            }, function(result) {
                UI.AlertError(result.data.message);
            });
        };
        $scope.AskForRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = id;
        };
        $scope.CancelRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = undefined;
        };

    });
}]);