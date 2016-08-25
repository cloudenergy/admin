angular.module('app').controller('Property.consume', ["$scope", "$api", "$state", function($scope, $api, $state) {

    var self = this,
        KEY_PAGESIZE = EMAPP.Account._id + '_property_consume_pagesize';

    self.searchText = '';
    self.startDate = moment().format('YYYY-MM-01');
    self.endDate = moment().format('YYYY-MM-DD');


    $scope.$watchGroup(['self.startDate', 'self.endDate'], function() {
        if (self.listData) {
            GetStatistic();
            self.list();
        }
    });
    $scope.$watch('self.category.selected', function() {
        if (self.listData) {
            GetStatistic();
            self.list();
        }
    });
    $scope.$watch('self.paging.index', function() {
        self.listData && self.list();
    });
    $scope.$watch('self.paging.size', function(val) {
        localStorage.setItem(KEY_PAGESIZE, val);
        self.listData && self.list();
    });

    $scope.$watch('Project.selected', function(item) {
        self.projectid = item._id;
        GetStatistic();
        self.list();
    });

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
            to: self.endDate.replace(/\-/g, ''),
            cancellable: true
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
            pagesize: self.paging.size,
            cancellable: true
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
                self.downloadName = EMAPP.Project.selected.title + '_' + $state.$current.data.title + '_' + self.startDate.replace(/\-/g, '') + '_' + self.endDate.replace(/\-/g, '');
            }
        });
    };

}]);