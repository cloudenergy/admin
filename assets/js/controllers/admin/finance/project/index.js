angular.module('app').controller('Finance.project.index', ["$api", "$filter", "$location", "$state", "$stateParams", "$uibModal", "UI", function ($api, $filter, $location, $state, $stateParams, $uibModal, UI) {

    var self = this;
    self.projectid = $stateParams.projectid;

    self.getCardList = function () {
        $api.channelaccount.info({
            project: self.projectid,
            all: true,
            flow: 'EXPENSE'
        }, function (data) {
            self.cardData = data.result || [];
        });
    };

    self.getCard = function (item) {

        $api.bank.info(function (data) {
            $uibModal.open({
                // size: size,
                templateUrl: 'modal-finance-project-card.html',
                controllerAs: 'self',
                controller: ["$api", "$uibModalInstance", "UI", function ($api, $uibModalInstance, UI) {

                    this.bankData = data.result;
                    this.card = item || {};
                    this.card.locate = angular.isString(this.card.locate) && JSON.parse(this.card.locate || null) || this.card.locate || {
                        province: '浙江省',
                        city: '杭州市',
                        district: '西湖区'
                    };

                    angular.forEach(this.bankData, $.proxy(function (item) {
                        this.bankData[item.id] = item;
                        if (this.card.origin === item.title) {
                            this.card.origin = item.id;
                        }
                    }, this));

                    this.submit = function () {
                        $api.channelaccount.add({
                            id: this.card.id || undefined,
                            flow: this.card.flow || 'EXPENSE',
                            belongto: this.card.belongto ? undefined : self.projectid,
                            name: this.card.name,
                            account: this.card.account,
                            origin: this.bankData[this.card.origin].title,
                            subbranch: this.card.subbranch,
                            locate: this.card.locate
                        }, $uibModalInstance.close);
                    };

                    this.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                }]
            }).result.then(self.getCardList);
        });
    };

    self.removeCard = function (item) {
        swal({
            title: '确认删除此项吗？',
            text: '卡号：' + item.account,
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            confirmButtonColor: '#ec6c62'
        }, function () {
            $api.channelaccount.delete({
                id: item.id
            }, self.getCardList);
        });
    };

    self.project = EMAPP.Project[self.projectid];

    $state.$current.data.title = self.project.title;

    self.getCardList();

    $api.business.accountbalance({
        project: self.projectid
    }, function (data) {
        self.accountbalance = data.result || {};
        self.accountbalance.total = Math.round((self.accountbalance.cash + self.accountbalance.frozen) * 100) / 100;
        self.accountbalance.cash = Math.round(self.accountbalance.cash * 100) / 100;
        self.accountbalance.frozen = Math.round(self.accountbalance.frozen * 100) / 100;
        self.accountbalance.earning = Math.round(self.accountbalance.earning * 100) / 100;
        self.accountbalance.withdraw = Math.round(self.accountbalance.withdraw * 100) / 100;
    });

}]);