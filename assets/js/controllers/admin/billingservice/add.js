angular.module('app').controller('BillingServiceadd', ["Config", "$scope", "$api", "$cookies", "BillingService", "Energycategory", "$state", "BillingAccount", "Account", "API", "Auth", "UI", function(Config, $scope, $api, $cookies, BillingService, Energycategory, $state, BillingAccount, Account, API, Auth, UI) {
    Auth.Check(function() {
        $scope.submit = function(e) {
            var selectedEnergycategory = new Array();
            _.each($scope.energycategory, function(v) {
                if (v.isEnable) {
                    selectedEnergycategory.push(v._id);
                }
            });

            API.Query(BillingService.add, {
                title: $scope.serviceTitle,
                energycategory: selectedEnergycategory,
                project: $scope.Project.selected._id
            }, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                    //
                } else {
                    //
                    $state.go('admin.billingservice.info');
                    UI.AlertSuccess('保存成功');
                }
            });
        };

        //Get All EnergyCategory
        $api.energycategory.info(function(result) {
            $scope.energycategory = result.result || [];
        });

        $scope.SwitchEnergycategory = function(e, ec) {
            e.preventDefault();

            if (ec.isEnable) {
                ec.isEnable = false;
            } else {
                ec.isEnable = true;
            }
        };

    });
}]);