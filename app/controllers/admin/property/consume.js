angular.module('app').controller('Property.consume', ["$scope", "$api", "$state", "$stateParams", function($scope, $api, $state, $stateParams) {

    var self = this,
        KEY_PAGESIZE = EMAPP.Account._id + '_property_consume_pagesize';

    self.projectid = $stateParams.projectid;

    self.searchText = '';
    self.startDate = moment().format('YYYY-MM-01');
    self.endDate = moment().format('YYYY-MM-DD');

    $scope.$watch(function() {
        return self.startDate;
    }, function() {
        if (self.listData) {
            GetStatistic();
            self.list();
        }
    });
    $scope.$watch(function() {
        return self.endDate;
    }, function() {
        // if (self.listData) {
        GetStatistic();
        self.list();
        // }
    });
    $scope.$watch(function() {
        return self.category.selected;
    }, function() {
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

    self.category = [{
        title: '全部类型'
    }, {
        key: 'PAYELECTRICITY',
        title: '电费'
    }, {
        key: 'PAYCOLDWATER',
        title: '冷水费'
    }, {
        key: 'PAYHOTWATER',
        title: '热水费'
    }, {
        key: 'PAYPROPERTY',
        title: '物业费'
    }, {
        key: 'PAYPARKING',
        title: '停车费'
    }];
    angular.forEach(self.category, function(item) {
        this[item.key] = item;
    }, self.category);

    //设置面包屑
    $api.project.info({
        id: self.projectid
    }, function(data) {
        self.projectname = data.result.title;
        $state.$current.parent.data.title = '物业财务 - ' + data.result.title;
    });

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

    function GetStatistic() {
        $api.business.departmentconsumptionstatistic({
            project: self.projectid,
            from: self.startDate.replace(/\-/g, ''),
            to: self.endDate.replace(/\-/g, '')
        }, function(data) {

            self.statistic = data.result || {};

            // 消耗
            angular.forEach(self.statistic.consumption.category, function(item, key) {
                this.push(angular.extend(item, {
                    category: key
                }));
            }, self.statistic.consumption.category = []);

        });
    }

    self.list = function() {
        $api.business.departmentconsumptiondetail({
            project: self.projectid,
            key: self.searchText || undefined, //商户名称/账号关键字
            category: self.category.selected || undefined, // 消耗类型
            from: self.startDate.replace(/\-/g, ''),
            to: self.endDate.replace(/\-/g, ''),
            pageindex: self.paging.index,
            pagesize: self.paging.size
        }, function(data) {

            data = data.result || {};

            angular.forEach(data.detail, function(item, key) {
                if (!Object.keys(item.earning && item.earning.category).length && !Object.keys(item.consumption && item.consumption.category).length) {
                    item.isnull = true;
                }
                item.key = key;
                this.push(item);
            }, data.detail = []);

            self.listData = data.detail;
            self.listData.index = (data.paging || {}).pageindex || 1;
            self.listData.total = (data.paging || {}).count || 0;

        });
    };

    self.exportConsumptiondetail = function() {
        delete self.downloadFile;
        $api.export.consumptiondetail({
            project: self.projectid,
            from: self.startDate.replace(/\-/g, ''),
            to: self.endDate.replace(/\-/g, '')
        }, function(data) {
            if (data.result.fn) {
                self.downloadFile = data.result.fn;
                self.downloadName = self.projectname + '_' + $state.$current.data.title + '_' + self.startDate.replace(/\-/g, '') + '_' + self.endDate.replace(/\-/g, '');
            }
        });
    };

}]);