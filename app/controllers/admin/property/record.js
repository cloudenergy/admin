angular.module('app').controller('Property.record', ["$scope", "$timeout", "$api", "$state", "$stateParams", function($scope, $timeout, $api, $state, $stateParams) {

    var self = this,
        KEY_PAGESIZE = EMAPP.Account._id + '_property_record_pagesize',
        Array_status = [{
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
        }],
        Array_category_in = [{
            key: 'RECHARGING',
            title: '充值'
        }, {
            key: 'alipay',
            title: '支付宝手机支付'
        }, {
            key: 'wx',
            title: '微信支付'
        }, {
            key: 'wx_pub',
            title: '微信公众号支付'
        }, {
            key: 'bankcard',
            title: '银行卡支付'
        }, {
            key: 'manual',
            title: '人工充值'
        }],
        Array_category_out = [{
            key: 'WITHDRAW',
            title: '提现'
        }, {
            key: 'HANDLINGCHARGERCG',
            title: '充值服务费'
        }, {
            key: 'HANDLINGCHARGEWTD',
            title: '提现服务费'
        }];

    $scope.$watchGroup([function() {
        return self.startDate;
    }, function() {
        return self.endDate;
    }], function() {
        if (self.dateRange.temp) {
            $timeout(function() {
                delete self.dateRange.temp;
            }, 10);
        } else {
            delete self.dateRange.selected;
        }
        self.listData && self.list();
    });
    $scope.$watch(function() {
        return self.paging.index;
    }, function() {
        self.listData && self.list();
    });
    $scope.$watch(function() {
        return self.paging.size;
    }, function(val) {
        localStorage.setItem(KEY_PAGESIZE, val);
        self.listData && self.list();
    });

    $scope.$watch('Project.selected', function() {
        self.list();
    });

    self.tab = $stateParams.tab || 'all';

    self.startDate = moment().format('YYYY-MM-01');
    self.endDate = moment().format('YYYY-MM-DD');

    //金额过滤
    self.amount = {};

    //日期范围
    self.dateRange = ['今天', '昨天', '最近7天', '最近30天'];
    self.dateRange.select = function(key) {
        self.dateRange.temp = true;
        switch (self.dateRange.selected = key) {
            case 0:
                self.startDate = self.endDate = moment().format('YYYY-MM-DD');
                break;
            case 1:
                self.startDate = self.endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                break;
            case 2:
                self.startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
                self.endDate = moment().format('YYYY-MM-DD');
                break;
            case 3:
                self.startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
                self.endDate = moment().format('YYYY-MM-DD');
                break;
        }
    };

    //状态
    self.status = [{
        title: '全部状态'
    }].concat(Array_status);
    angular.forEach(self.status, function(item) {
        this[item.key] = {
            title: item.title,
            class: item.class
        };
    }, self.status);

    //类型
    self.category = [{
        title: '全部类型'
    }];
    if (self.tab === 'in') {
        self.category = self.category.concat(Array_category_in);
    }
    if (self.tab === 'out') {
        self.category = self.category.concat(Array_category_out);
    }
    if (self.tab === 'all') {
        self.category = self.category.concat(Array_category_in);
        self.category = self.category.concat(Array_category_out);
    }
    angular.forEach(self.category, function(item) {
        this[item.key] = item;
    }, self.category);
    self.category.selected = $stateParams.category || undefined;

    //分页设置
    self.paging = {
        index: 1,
        size: parseInt(localStorage.getItem(KEY_PAGESIZE) || 10),
        items: [{
            key: 10,
            title: '每页10条'
        }, {
            key: 15,
            title: '每页15条'
        }, {
            key: 30,
            title: '每页30条'
        }, {
            key: 50,
            title: '每页50条'
        }, {
            key: 100,
            title: '每页100条'
        }]
    };

    self.list = function() {
        $api.business.fundflow(angular.extend(GetOptions(), {
            pageindex: self.paging.index,
            pagesize: self.paging.size,
            cancellable: true
        }), function(data) {

            delete $api.$request;

            data = data.result || {};

            angular.forEach(data.detail, function(item) {
                if (item.channelaccount && item.channelaccount.account) {
                    item.channelaccount.tail = item.channelaccount.account.replace(/\d+(\d{4})$/, '$1');
                }
                item.timecreate = item.timecreate && moment(item.timecreate * 1000).format('YYYY-M-DD H:mm:ss') || '';
                item.timecheck = item.timecheck && moment(item.timecheck * 1000).format('YYYY-M-DD H:mm:ss') || '';
                item.timepaid = item.timepaid && moment(item.timepaid * 1000).format('YYYY-M-DD H:mm:ss') || '';
            });

            self.listData = data.detail || [];
            self.listData.index = (data.paging || {}).pageindex || 1;
            self.listData.total = (data.paging || {}).count || 0;

            self.statistic = data.statistic || {};

        });
    };

    self.exportProjectflow = function() {
        delete self.downloadFile;
        $api.export.projectflow(angular.extend(GetOptions(), {
            type: {
                all: 'ALL',
                in: 'EARNING',
                out: 'EXPENSES'
            }[self.tab]
        }), function(data) {
            if (data.result.fn) {
                var options = GetOptions();
                self.downloadFile = data.result.fn;
                self.downloadName = self.projectname + '_' + $state.$current.data.title + '_' + options.from + '_' + options.to;
            }
        });
    };

    function GetOptions() {
        return {
            project: EMAPP.Project.selected._id,
            key: self.searchText || undefined, //项目名或账户名
            from: self.startDate.replace(/\-/g, ''), //查询起始'YYYYMMDD'
            to: self.endDate.replace(/\-/g, ''), //查询截止'YYYYMMDD'
            flow: {
                // all: undefined,
                in: 'EARNING',
                out: 'EXPENSE'
            }[self.tab], //流水方向(收入EARNING/支出EXPENSE)
            category: self.category.selected || undefined, //流水类型
            status: self.status.selected || undefined, //流水状态
            amount: [
                self.amount.start === undefined ? null : parseFloat(self.amount.start),
                self.amount.end === undefined ? null : parseFloat(self.amount.end)
            ]
        };
    }

}]);