angular.module('app').controller('Finance.record.out.detail', ["$filter", "$api", "$state", "$stateParams", "$uibModal", function($filter, $api, $state, $stateParams, $uibModal) {

    var self = this;

    self.status = {
        CHECKING: '等待审核',
        CHECKFAILED: '审核失败',
        PROCESSING: '正在处理',
        FAILED: '处理失败',
        SUCCESS: '完成'
    };

    self.textColor = {
        CHECKING: 'text-primary',
        PROCESSING: 'text-warning',
        CHECKFAILED: 'text-danger',
        FAILED: 'text-danger',
        SUCCESS: 'text-success'
    };

    self.projectname = '云能源';
    self.projectid = $stateParams.projectid;
    self.orderno = $stateParams.orderno;

    self.card = '';
    self.sash = 0;
    self.pwd = '';

    self.projectid && $api.project.info({
        id: self.projectid
    }, function(data) {
        $state.$current.parent.data.title = data.result.title;
    });

    self.getDetail = function() {
        self.orderno && $api.withdraw.details({
            id: self.orderno
        }, function(data) {
            self.detail = data.result || {};
        })
    };

    self.getDetail();

    self.inject = function() {
        swal({
            title: '确认通过此项提现申请吗？',
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            confirmButtonColor: '#ec6c62'
        }, function() {
            $api.withdraw.checking({
                id: self.orderno,
                status: 'PASSED',
                desc: '审核通过'
            }, self.getDetail)
        })
    };

    self.reject = function(size) {
        $uibModal.open({
            templateUrl: 'finance-record-detail-modal-reject.html',
            controllerAs: 'self',
            controller: ["$uibModalInstance", "UI", function($uibModalInstance, UI) {
                this.submit = function() {
                    this.desc ? $uibModalInstance.close(this.desc) : UI.AlertWarning('描述内容不能为空', '请输入描述信息')
                };
                this.cancel = function() {
                    $uibModalInstance.dismiss('cancel')
                };
            }],
            size: size
        }).result.then(function(desc) {
            desc && $api.withdraw.checking({
                id: self.orderno,
                status: 'REJECT',
                desc: desc
            }, self.getDetail)
        });
    };

}]);