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
                            templateUrl: 'assets/html/admin/property/record-success.html?rev=a75ca0a7a7',
                            controllerAs: 'self',
                            controller: ["$uibModalInstance", function($uibModalInstance) {

                                var self = this;

                                self.detail = data.result || {};

                                self.detail.timecreate = self.detail.timecreate && moment(self.detail.timecreate * 1000).format('YYYY-M-DD H:mm:ss') || '';
                                self.detail.timepaid = self.detail.timepaid && moment(self.detail.timepaid * 1000).format('YYYY-M-DD H:mm:ss') || '';

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