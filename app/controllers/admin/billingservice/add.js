angular.module('app').controller('BillingServiceadd', ["Config", "$scope", "$q", "$location", "$cookies", "BillingService", "Energycategory", "$stateParams", "SettingMenu", "BillingAccount", "Account", "md5", "API", "Auth", "UI", function(Config, $scope, $q, $location, $cookies, BillingService, Energycategory, $stateParams, SettingMenu, BillingAccount, Account, md5, API, Auth, UI) {
    Auth.Check(function() {
        SettingMenu(function(menu) {
            $scope.menu = menu;
        });

        $scope.submit = function(e) {
            var selectedEnergycategory = new Array();
            _.each($scope.energycategory, function(v) {
                if (v.isEnable) {
                    selectedEnergycategory.push(v._id);
                }
            });

            if (!$stateParams.project) {
                console.log('parameter project is emtpy, please check');
                return;
            }

            var saveBillingService = {
                title: $scope.serviceTitle,
                energycategory: selectedEnergycategory,
                project: $stateParams.project
            };
            //        console.log(saveBillingService);
            API.Query(BillingService.add, saveBillingService, function(result) {
                if (result.code) {
                    UI.AlertError(result.message);
                    //
                } else {
                    //
                    $location.path('/admin/billingservice/info');
                    UI.AlertSuccess('保存成功');
                }
            });
        };

        //Get All EnergyCategory
        API.Query(Energycategory.info, {}, function(result) {
            console.log(result.result);
            $scope.energycategory = new Array();
            _.each(result.result, function(ec) {

                $scope.energycategory.push(ec);
            });
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