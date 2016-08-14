angular.module('app').filter('startFrom', function() {
    return function(input, start) {
        return angular.isArray(input) && input.slice(+start) || input && angular.isArray(input.detail) && input.detail.slice(+start) || [];
    };
}).filter('tradeStatus', function() {
    var status = [{
        key: 'CHECKING',
        title: '等待审核',
        class: 'primary'
    }, {
        key: 'CHECKFAILED',
        title: '审核失败',
        class: 'warning'
    }, {
        key: 'PROCESSING',
        title: '正在处理',
        class: 'info'
    }, {
        key: 'FAILED',
        title: '处理失败',
        class: 'danger'
    }, {
        key: 'SUCCESS',
        title: '完成',
        class: 'success'
    }];
    angular.forEach(status, function(item) {
        status[item.key] = item;
    });
    return function(input, key) {
        return status[input] && status[input][key] || status[input] || input;
    };
}).filter('tradeCategory', function() {
    var category = [{
        key: 'RECHARGING',
        title: '充值'
    }, {
        key: 'WITHDRAW',
        title: '提现',
        icon: 'emfinance finance-withdraw text-danger'
    }, {
        key: 'PAYFEES',
        title: '缴费'
    }, {
        key: 'PAYPROPERTY',
        title: '物业费',
        icon: 'emfinance finance-property text-success'
    }, {
        key: 'PAYPARKING',
        title: '停车费',
        icon: 'emfinance finance-parking text-danger'
    }, {
        key: 'HANDLINGCHARGE',
        title: '手续费'
    }, {
        key: 'PAYELECTRICITY',
        title: '电费',
        icon: 'emfinance finance-electricity text-warning'
    }, {
        key: 'PAYCOLDWATER',
        title: '冷水费',
        icon: 'emfinance finance-water text-info'
    }, {
        key: 'PAYHOTWATER',
        title: '热水费',
        icon: 'emfinance finance-water text-danger'
    }, {
        key: 'PAYACENERGY',
        title: '空调费能量表',
        icon: 'emfinance finance-power text-danger'
    }, {
        key: 'PAYACPANEL',
        title: '空调费面板',
        icon: 'emfinance finance-temprature text-info'
    }, {
        key: 'HANDLINGCHARGERCG',
        title: '充值服务费',
        icon: 'emfinance finance-serve text-warning'
    }, {
        key: 'HANDLINGCHARGEWTD',
        title: '提现服务费',
        icon: 'emfinance finance-serve text-warning'
    }, {
        key: 'alipay',
        title: '支付宝手机支付',
        icon: 'emfinance finance-alipay text-info'
    }, {
        key: 'wx',
        title: '微信支付',
        icon: 'emfinance finance-wechat text-success'
    }, {
        key: 'wx_pub',
        title: '微信公众号支付',
        icon: 'emfinance finance-wechat-official text-success'
    }, {
        key: 'bankcard',
        title: '银行卡支付',
        icon: 'emfinance finance-unionpay text-primary'
    }, {
        key: 'manual',
        title: '人工充值',
        icon: 'emfinance finance-manual text-info'
    }];
    angular.forEach(category, function(item) {
        category[item.key] = item;
    });
    return function(input, key) {
        return category[input] && category[input][key] || category[input] || input;
    };
});