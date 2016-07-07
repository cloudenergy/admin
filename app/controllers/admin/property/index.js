angular.module('app').controller('Property.index', ["$scope", "$api", "$state", "$stateParams", "$uibModal", function($scope, $api, $state, $stateParams, $uibModal) {

    var self = this,
        KEY_PROJECT = EMAPP.Account._id + '_property_index_projectid';

    self.projectid = $stateParams.projectid;

    // 电表:ELECTRICITYMETER
    // 冷水表:COLDWATERMETER
    // 热水表:HOTWATERMETER
    // 能量表:ENERGYMETER
    // 温控器:TEMPRATURECONTROL
    // 物业费:emfinance finance-property text-success
    // 租金:emfinance finance-rent text-success
    self.deviceType = [{
        key: 'ELECTRICITYMETER',
        title: '电表',
        icon: 'emfinance finance-electricity text-warning'
    }, {
        key: 'COLDWATERMETER',
        title: '冷水表',
        icon: 'emfinance finance-water text-info'
    }, {
        key: 'HOTWATERMETER',
        title: '热水表',
        icon: 'emfinance finance-water text-danger'
    }, {
        key: 'ENERGYMETER',
        title: '能量表',
        icon: 'emfinance finance-power text-danger'
    }, {
        key: 'TEMPRATURECONTROL',
        title: '温控器',
        icon: 'emfinance finance-temprature text-info'
    }];
    angular.forEach(self.deviceType, function(item) {
        this[item.key] = item;
    }, self.deviceType);

    //类型
    self.category = [{
        key: 'RECHARGING',
        title: '充值'
    }, {
        key: 'PAYFEES',
        title: '缴费'
    }, {
        key: 'HANDLINGCHARGE',
        title: '手续费'
    }, {
        key: 'WITHDRAW',
        icon: 'emfinance finance-withdraw text-danger',
        title: '提现'
    }, {
        key: 'HANDLINGCHARGERCG',
        icon: 'emfinance finance-serve text-warning',
        title: '充值服务费'
    }, {
        key: 'HANDLINGCHARGEWTD',
        icon: 'emfinance finance-serve text-warning',
        title: '提现服务费'
    }, {
        key: 'alipay',
        icon: 'emfinance finance-alipay text-info',
        title: '支付宝手机支付'
    }, {
        key: 'wx',
        icon: 'emfinance finance-wechat text-success',
        title: '微信支付'
    }, {
        key: 'wx_pub',
        icon: 'emfinance finance-wechat-official text-success',
        title: '微信公众号支付'
    }, {
        key: 'bankcard',
        icon: 'emfinance finance-unionpay text-primary',
        title: '银行卡支付'
    }];
    angular.forEach(self.category, function(item) {
        this[item.key] = item;
    }, self.category);

    self.format = 'YYYY-MM';
    self.viewDate = moment().format(self.format);

    $scope.$watch(function() {
        return self.viewDate
    }, function(val) {
        if (self.projects.length) {
            GetFundflowStatistic();
            GetFundflow();
        }
    });

    self.projects = [];
    self.projects.select = function() {
        localStorage.setItem(KEY_PROJECT, self.projects.selected);
        $state.go($state.current.name, {
            projectid: self.projects.selected
        }, {
            reload: true
        });
    };

    /* 获取项目信息 */
    $api.project.info(function(data) {

        data.result = angular.isArray(data.result) ? data.result : [data.result];
        angular.forEach(data.result, function(item) {
            this.push(item);
            this[item._id] = item;
        }, self.projects);

        if (self.projects.length) {

            if (!self.projectid && self.projects.length > 1 && localStorage.getItem(KEY_PROJECT)) {
                self.projectid = localStorage.getItem(KEY_PROJECT);
            }

            angular.forEach(self.projects, function(item) {
                if (item._id === self.projectid) {
                    self.projects.selected = item._id;
                }
            });
            self.projects.selected = self.projects.selected || self.projects[0]._id;

            $state.$current.data.title = '物业财务 - ' + self.projects[self.projects.selected].title;

            GetAccountbalance();

            GetCardList();

            GetFundflowStatistic();

            GetFundflow();

        }

    });

    /* 获取编辑银行卡 */
    self.getCard = function(item) {
        $api.bank.info(function(data) {
            $uibModal.open({
                // size: size,
                templateUrl: 'modal-property-card.html',
                controllerAs: 'self',
                controller: ["$api", "$uibModalInstance", function($api, $uibModalInstance) {

                    this.bankData = data.result;
                    this.card = item && angular.copy(item) || {};
                    this.card.locate = angular.isString(this.card.locate) && JSON.parse(this.card.locate || null) || this.card.locate || {
                        province: '浙江省',
                        city: '杭州市',
                        district: '西湖区'
                    };

                    angular.forEach(this.bankData, $.proxy(function(item) {
                        this.bankData[item.id] = item;
                        if (this.card.origin === item.title) {
                            this.card.origin = item.id;
                        }
                    }, this));

                    this.submit = function() {
                        $api.channelaccount.add({
                            id: this.card.id || undefined,
                            flow: this.card.flow || 'EXPENSE',
                            belongto: this.card.belongto ? undefined : self.projects.selected,
                            name: this.card.name,
                            account: this.card.account,
                            type: this.card.origin,
                            origin: this.bankData[this.card.origin].title,
                            subbranch: this.card.subbranch,
                            locate: this.card.locate
                        }, $uibModalInstance.close);
                    };

                    this.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };

                }]
            }).result.then(GetCardList);
        });
    };

    /* 删除银行卡 */
    self.removeCard = function(item) {
        swal({
            title: '确认删除此项吗？',
            text: '卡号：' + item.account,
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            confirmButtonColor: '#ec6c62'
        }, function() {
            $api.channelaccount.delete({
                id: item.id
            }, GetCardList);
        });
    };

    /* 获取账户金额 */
    function GetAccountbalance() {
        $api.business.accountbalance({
            project: self.projects.selected
        }, function(data) {
            self.accountbalance = data.result || {};
            self.accountbalance.total = Math.round((self.accountbalance.cash + self.accountbalance.frozen) * 100) / 100;
            self.accountbalance.cash = Math.round(self.accountbalance.cash * 100) / 100;
            self.accountbalance.frozen = Math.round(self.accountbalance.frozen * 100) / 100;
            self.accountbalance.earning = Math.round(self.accountbalance.earning * 100) / 100;
            self.accountbalance.withdraw = Math.round(self.accountbalance.withdraw * 100) / 100;
        });
    }

    /* 获取银行卡信息 */
    function GetCardList() {
        $api.channelaccount.info({
            project: self.projects.selected,
            all: true,
            flow: 'EXPENSE'
        }, function(data) {

            self.cardInfo = data.result && data.result[0] || {};

            self.cardInfo.timecreate = self.cardInfo.timecreate && moment(self.cardInfo.timecreate * 1000).format('YYYY-M-DD H:mm:ss') || '';
            self.cardInfo.timeenable = self.cardInfo.timeenable && moment(self.cardInfo.timeenable * 1000).format('YYYY-M-DD H:mm:ss') || '';
            self.cardInfo.timeexpire = self.cardInfo.timeexpire && moment(self.cardInfo.timeexpire * 1000).format('YYYY-M-DD H:mm:ss') || '';

            self.cardInfo.tail = (self.cardInfo.account || '').replace(/\d+(\d{4})$/, '$1');

        });
    }

    /* 获取项目资金流水统计 */
    function GetFundflowStatistic() {
        $api.business.projectfundflowstatistic({
            time: self.viewDate.replace(/\-/g, ''),
            project: self.projects.selected
        }, function(data) {
            data = data.result || {};
            // 收入
            data.earning && angular.forEach(data.earning.category, function(item, key) {
                this.push(angular.extend(item, {
                    name: key
                }));
            }, data.earning.category = []);
            // 支出
            data.expenses && angular.forEach(data.expenses.category, function(item, key) {
                this.push(angular.extend(item, {
                    category: key
                }));
            }, data.expenses.category = []);
            // 消耗
            data.consumption && angular.forEach(data.consumption.category, function(item, key) {
                this.push(angular.extend(item, {
                    category: key
                }));
            }, data.consumption.category = []);
            self.fundflowstatistic = data;
        });
    }

    /* 获取流水信息 */
    function GetFundflow() {
        $api.business.fundflow({
            project: self.projects.selected,
            from: self.viewDate.replace(/\-/g, '') + '01',
            to: moment(self.viewDate.replace(/\-/g, '') + '01', 'YYYYMMDD').add(1, 'month').subtract(1, 'day').format('YYYYMMDD'),
            pageindex: 1,
            pagesize: 6
        }, function(res) {
            self.fundflow = res.result.detail;
            angular.forEach(self.fundflow, function(item) {

                if (item.channelaccount && item.channelaccount.account) {
                    item.channelaccount.tail = item.channelaccount.account.replace(/\d+(\d{4})$/, '$1');
                }

                item.timecreate = item.timecreate && moment(item.timecreate * 1000).format('YYYY-M-DD H:mm:ss') || '';
                item.timecheck = item.timecheck && moment(item.timecheck * 1000).format('YYYY-M-DD H:mm:ss') || '';
                item.timepaid = item.timepaid && moment(item.timepaid * 1000).format('YYYY-M-DD H:mm:ss') || '';

            });
        });
    }

}]);