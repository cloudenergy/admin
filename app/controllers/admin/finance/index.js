angular.module('app').controller('Finance', ["$api", "$filter", function($api, $filter) {

    var self = this;

    self.status = {
        CHECKING: '等待审核',
        CHECKFAILED: '审核失败',
        PROCESSING: '正在处理',
        FAILED: '处理失败',
        SUCCESS: '完成'
    };

    self.operation = {
        color: {
            CHECKING: 'text-primary',
            PROCESSING: 'text-warning',
            CHECKFAILED: 'text-danger',
            FAILED: 'text-danger',
            SUCCESS: 'text-success'
        },
        text: {
            CHECKING: '审核',
            PROCESSING: '状态',
            CHECKFAILED: '查看',
            FAILED: '查看',
            SUCCESS: '查看'
        }
    };

    $api.business.accountbalance({
        project: 'PLT'
    }, function(data) {
        self.accountbalance = data.result || {};
        self.accountbalance.total = Math.round((self.accountbalance.cash + self.accountbalance.frozen) * 100) / 100;
        self.accountbalance.cash = Math.round(self.accountbalance.cash * 100) / 100;
        self.accountbalance.frozen = Math.round(self.accountbalance.frozen * 100) / 100;
        self.accountbalance.earning = Math.round(self.accountbalance.earning * 100) / 100;
        self.accountbalance.withdraw = Math.round(self.accountbalance.withdraw * 100) / 100;
    });

    $api.channelaccount.info({
        // project: 'PLT',
        // status: 'CHECKING',
        all: 1,
        flow: 'EXPENSE',
        pageindex: 1,
        pagesize: 6
    }, function(data) {
        self.card = data && data.result && data.result.detail || [];
        angular.forEach(self.card, function(item) {
            if (item.locate && angular.isString(item.locate)) {
                angular.forEach(JSON.parse(item.locate), function(val, key) {
                    this.push(val)
                }, item.locate = []);
                item.locate = item.locate.join('-');
            }
        });
    });

    $api.withdraw.info({
        project: 'PLT',
        // from: $filter('date')(nowDate, 'yyyy0101'),
        // to: $filter('date')(nowDate, 'yyyyMMdd'),
        // flow: 'EXPENSE',
        // category: 'WITHDRAW',
        // status: 'CHECKING',
        pageindex: 1,
        pagesize: 6
    }, function(data) {
        self.withdraw = data && data.result && data.result.detail || [];
        angular.forEach(self.withdraw, function(item) {
            var ca = [];
            item.channelaccount.name && ca.push(item.channelaccount.name);
            item.channelaccount.origin && ca.push(item.channelaccount.origin);
            item.channelaccount.account && ca.push('尾号: ' + item.channelaccount.account.substr(item.channelaccount.account.length - 4));
            item.channelaccount = ca.join(' | ') || '关联账户不存在';
        });
    });

}]);