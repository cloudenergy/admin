/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('EnergySelect', ["$scope", "$uibModalInstance", "ServiceEnergycategories", function ($scope, $uibModalInstance, ServiceEnergycategories) {
    $scope.ServiceEnergycategories = ServiceEnergycategories;
    $scope.Ok = function () {
        var SelectedEnergycategories = [];
        _.each($scope.ServiceEnergycategories, function (sec) {
            if (sec.isEnable) {
                SelectedEnergycategories.push(sec._id);
            }
        });
        $uibModalInstance.close(SelectedEnergycategories);
    };
    $scope.Cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.SwitchServiceEnergycategories = function (e, sec) {
        e.preventDefault();

        if (sec.isEnable) {
            sec.isEnable = false;
        } else {
            sec.isEnable = true;
        }
    };
}]);