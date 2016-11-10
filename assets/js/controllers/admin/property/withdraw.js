angular.module('app').controller('Property.withdraw', ["$scope", "$api", "$timeout", "$uibModal", function ($scope, $api, $timeout, $uibModal) {

    var self = this,
        timer;

    // self.amount = 100;
    self.cardSelected = null;

    self.calAmount = function () {
        timer && $timeout.cancel(timer);
        timer = $timeout(function () {
            self.amount = self.amount && (Math.round(self.amount * 100) / 100) || self.amount;
        }, 666);
    };

    self.inject = function () {
        if (self.amount) {
            self.amount = Math.round(self.amount * 100) / 100;
        }
        if (!self.cardSelected || !self.amount) {
            return false;
        }

        $api.payment.handlingcharge({
            channelaccount: self.cardSelected.id,
            amount: self.amount
        }, function (res) {

            self.fee = res.result.amount;

            $uibModal.open({
                templateUrl: 'withdraw_request_confirmation.html',
                controllerAs: 'self',
                controller: ["$uibModalInstance", "UI", "data", function ($uibModalInstance, UI, data) {
                    this.submit = function () {
                        $uibModalInstance.close(this.detail);
                    };
                    this.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    this.detail = data;
                    this.detail.timecreate = moment().unix();
                    this.detail.applicant = EMAPP.Account._id;
                }],
                resolve: {
                    data: function () {
                        return {
                            card: self.cardSelected,
                            amount: self.amount,
                            fee: self.fee,
                            project: EMAPP.Project.selected._id
                        };
                    }
                },
                size: 'md'
            }).result.then(function (result) {
                $api.withdraw.apply({
                    project: result.project,
                    amount: result.amount,
                    channelaccount: result.card.id
                }, function () {
                    delete self.amount;
                    delete self.cardSelected;
                    swal('成功', '已提交成功', 'success');
                    loadData();
                }, function (data) {
                    swal('错误', data.message, 'error');
                });
            });

        });
    };

    $scope.$watch('Project.selected', loadData);

    function loadData() {

        $api.business.accountbalance({
            project: EMAPP.Project.selected._id
        }, function (data) {
            self.accountbalance = data.result || {};
            self.accountbalance.total = Math.round((self.accountbalance.cash + self.accountbalance.frozen) * 100) / 100;
            self.accountbalance.cash = Math.round(self.accountbalance.cash * 100) / 100;
            self.accountbalance.frozen = Math.round(self.accountbalance.frozen * 100) / 100;
            self.accountbalance.earning = Math.round(self.accountbalance.earning * 100) / 100;
            self.accountbalance.withdraw = Math.round(self.accountbalance.withdraw * 100) / 100;
        });

        $api.channelaccount.info({
            project: EMAPP.Project.selected._id,
            all: true,
            flow: 'EXPENSE',
            status: 'SUCCESS'
        }, function (data) {
            self.cardData = data.result || [];
        });

    }

}]);