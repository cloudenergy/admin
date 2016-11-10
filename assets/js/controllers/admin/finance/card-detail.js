angular.module('app').controller('Finance.card.detail', ["$api", "$state", "$stateParams", "$uibModal", function ($api, $state, $stateParams, $uibModal) {

    var self = this;

    self.id = $stateParams.id;

    //状态
    self.status = [{
        key: 'CHECKING',
        title: '等待审核'
    }, {
        key: 'FAILED',
        title: '审核失败'
    }, {
        key: 'SUCCESS',
        title: '审核通过'
    }];
    angular.forEach(self.status, function (item) {
        this[item.key] = item.title;
    }, self.status);

    self.getInfo = function () {
        $api.channelaccount.info({
            id: self.id
        }, $.proxy(function (data) {
            this.detail = data.result[0] || {};
            if (this.detail.locate && angular.isString(this.detail.locate)) {
                angular.forEach(JSON.parse(this.detail.locate), function (val, key) {
                    this.push(val);
                }, this.detail.locate = []);
                this.detail.locate = this.detail.locate.join('-');
            }
        }, self));
    };

    self.getInfo();

    self.inject = function () {
        swal({
            title: '确认审核通过此项吗？',
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确认'
        }, function () {
            $api.channelaccount.checking({
                id: self.id,
                status: 'SUCCESS',
                reason: '审核通过'
            }, self.getInfo);
        });
    };

    self.reject = function (size) {
        $uibModal.open({
            templateUrl: 'finance-card-detail-modal-reject.html',
            controllerAs: 'self',
            controller: ["$uibModalInstance", "UI", function ($uibModalInstance, UI) {
                this.submit = function () {
                    this.reason ? $uibModalInstance.close(this.reason) : UI.AlertWarning('描述内容不能为空', '请输入描述信息');
                };
                this.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }],
            size: size
        }).result.then(function (reason) {
            reason && $api.channelaccount.checking({
                id: self.id,
                status: 'FAILED',
                reason: reason
            }, self.getInfo);
        });
    };

}]);