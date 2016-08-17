angular.module('app').directive('withdrawDetail', ["$api", "$uibModal", function($api, $uibModal) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            (function(item) {
                item && item.category === 'WITHDRAW' && element.click(function() {
                    item.popup = true;
                    $api.business.ordernodetail({
                        id: item.id
                    }, function(data) {
                        $uibModal.open({
                            size: 'lg',
                            windowClass: 'no-border',
                            templateUrl: 'templates/admin/property/withdraw-detail.html?rev=aaedc20996',
                            controllerAs: 'self',
                            controller: ["$uibModalInstance", function($uibModalInstance) {

                                var self = this;

                                self.detail = data.result || {};

                                self.detail.timecreate = self.detail.timecreate && moment(self.detail.timecreate * 1000).format('YYYY-M-DD H:mm:ss') || '';
                                self.detail.timecheck = self.detail.timecheck && moment(self.detail.timecheck * 1000).format('YYYY-M-DD H:mm:ss') || '';
                                self.detail.timepaid = self.detail.timepaid && moment(self.detail.timepaid * 1000).format('YYYY-M-DD H:mm:ss') || '';

                                if (self.detail.channelaccount) {
                                    self.detail.channelaccount.tail_account = (self.detail.channelaccount.account || '').replace(/\d+(\d{4})$/, '$1');
                                }

                                //样式绑定
                                self.classes = {
                                    create: {
                                        border: self.detail.timecreate && 'border-success' || '',
                                        title: self.detail.timecreate && 'text-success' || 'text-muted',
                                        icon: self.detail.timecreate && 'fa-check-circle' || 'fa-clock-o',
                                        text: self.detail.timecreate && '申请提交成功' || '等待申请'
                                    },
                                    line_check: self.detail.timecreate && 'border-success' || 'border-default',
                                    check: {
                                        border: self.detail.timecreate && ({
                                            CHECKING: 'border-warning',
                                            CHECKFAILED: 'border-danger'
                                        }[self.detail.status] || 'border-success') || 'border-default',
                                        title: self.detail.timecreate && ({
                                            CHECKING: 'text-warning',
                                            CHECKFAILED: 'text-danger'
                                        }[self.detail.status] || 'text-success') || 'text-muted',
                                        icon: self.detail.timecreate && ({
                                            CHECKING: 'fa-clock-o',
                                            CHECKFAILED: 'fa-exclamation-circle'
                                        }[self.detail.status] || 'fa-check-circle') || 'fa-clock-o',
                                        text: self.detail.timecreate && ({
                                            CHECKING: '等待审核',
                                            CHECKFAILED: '审核失败'
                                        }[self.detail.status] || '审核通过并提交银行') || '等待审核'
                                    },
                                    line_paid: self.detail.timecreate && ({
                                        CHECKING: 'border-default',
                                        CHECKFAILED: 'border-default'
                                    }[self.detail.status] || 'border-success') || 'border-default',
                                    paid: {
                                        border: {
                                            SUCCESS: 'border-success',
                                            FAILED: 'border-danger',
                                            PROCESSING: 'border-warning'
                                        }[self.detail.status] || 'border-default',
                                        title: {
                                            SUCCESS: 'text-success',
                                            FAILED: 'text-danger',
                                            PROCESSING: 'text-warning'
                                        }[self.detail.status] || 'text-muted',
                                        icon: {
                                            SUCCESS: 'fa-check-circle',
                                            FAILED: 'fa-exclamation-circle'
                                        }[self.detail.status] || 'fa-clock-o',
                                        text: {
                                            SUCCESS: '交易成功',
                                            FAILED: '交易失败',
                                            PROCESSING: '正在处理'
                                        }[self.detail.status] || '等待交易'
                                    }
                                };

                                self.Cancel = $uibModalInstance.dismiss;

                            }]
                        }).result.then(function() {
                            delete item.popup;
                        }, function() {
                            delete item.popup;
                        });
                    });
                });
            }(scope.$eval(attrs.withdrawDetail)));
        }
    };
}]);