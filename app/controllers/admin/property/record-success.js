angular.module('app').directive('recordSuccess', ["$api", "$uibModal", function($api, $uibModal) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            (function(item) {
                item && item.category === 'RECHARGING' && element.click(function() {
                    item.popup = true;
                    $api.business.ordernodetail({
                        id: item.id
                    }, function(data) {
                        $uibModal.open({
                            size: 'lg',
                            windowClass: 'no-border',
                            templateUrl: 'templates/admin/property/record-success.html?rev=5a823e9f1a',
                            controllerAs: 'self',
                            controller: ["$filter", "$uibModalInstance", function($filter, $uibModalInstance) {

                                var self = this;

                                self.detail = data.result || {};
                                self.detail.timepaid = self.detail.timepaid && $filter('date')(self.detail.timepaid * 1000, 'yyyy-M-dd H:mm:ss') || '';

                                self.Cancel = $uibModalInstance.dismiss;

                            }]
                        }).result.then(function() {
                            delete item.popup;
                        }, function() {
                            delete item.popup;
                        });
                    });
                });
            }(scope.$eval(attrs.recordSuccess)));
        }
    };
}]);