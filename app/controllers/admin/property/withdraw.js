angular.module('app').controller('Property.withdraw', ["$api", "$filter", "$timeout", "$state", "$stateParams", "$uibModal", function($api, $filter, $timeout, $state, $stateParams, $uibModal) {

    var self = this,
        timer;

    // self.amount = 100;
    self.projectid = $stateParams.projectid;
    self.cardSelected = null;

    self.calAmount = function() {
        timer && $timeout.cancel(timer);
        timer = $timeout(function() {
            self.amount = self.amount && (Math.round(self.amount * 100) / 100) || self.amount;
        }, 666);
    };

    $api.project.info({
        id: self.projectid
    }, function(data) {
        self.project = data.result;
        $state.$current.parent.data.title = '物业财务 - ' + data.result.title;
    });

    $api.business.accountbalance({
        project: self.projectid
    }, function(data) {
        self.accountbalance = data.result || {};
        self.accountbalance.total = Math.round((self.accountbalance.cash + self.accountbalance.frozen) * 100) / 100;
        self.accountbalance.cash = Math.round(self.accountbalance.cash * 100) / 100;
        self.accountbalance.frozen = Math.round(self.accountbalance.frozen * 100) / 100;
        self.accountbalance.earning = Math.round(self.accountbalance.earning * 100) / 100;
        self.accountbalance.withdraw = Math.round(self.accountbalance.withdraw * 100) / 100;
    });

    $api.channelaccount.info({
        project: self.projectid,
        all: true,
        flow: 'EXPENSE',
        status: 'SUCCESS'
    }, function(data) {
        self.cardData = data.result || [];
    });

    self.inject = function() {
        if (self.amount) {
            self.amount = Math.round(self.amount * 100) / 100;
        }
        if (!self.cardSelected || !self.amount) {
            return false;
        }

        $api.payment.handlingcharge({
            channelaccount: self.cardSelected.id,
            amount: self.amount
        }, function(res) {

            self.fee = res.result.amount;

            $uibModal.open({
                templateUrl: 'withdraw_request_confirmation.html',
                controllerAs: 'self',
                controller: ["$uibModalInstance", "UI", "data", function($uibModalInstance, UI, data) {
                    this.submit = function() {
                        $uibModalInstance.close(this.detail);
                    };
                    this.cancel = function() {
                        $uibModalInstance.dismiss('cancel')
                    };
                    this.detail = data;
                    this.detail.timecreate = moment().unix();
                    this.detail.applicant = EMAPP.Account._id;
                }],
                resolve: {
                    data: function() {
                        return {
                            card: self.cardSelected,
                            amount: self.amount,
                            fee: self.fee,
                            project: self.projectid
                        }
                    }
                },
                size: 'md'
            }).result.then(function(result) {
                $api.withdraw.apply({
                    project: result.project,
                    amount: result.amount,
                    channelaccount: result.card.id
                }, function(res) {
                    if (res.code == 0) {
                        swal("成功", "已提交成功", "success");
                        $state.go('admin.property.withdraw', {
                            projectid: self.projectid
                        }, {
                            reload: true
                        });
                    } else {
                        swal("错误", res.message, "error");
                    }
                });
            });

        });
    };

}]);