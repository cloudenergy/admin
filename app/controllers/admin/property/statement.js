angular.module('app').controller('Property.statement', ["$scope", "$api", "$state", "$stateParams", "$timeout", "$q", function($scope, $api, $state, $stateParams, $timeout, $q) {

    var self = this,
        KEY_PAGESIZE = EMAPP.Account._id + '_property_statement_pagesize';

    self.tab = $stateParams.tab || 'daily';
    self.format = self.tab === 'daily' ? 'YYYY-MM' : 'YYYY';
    self.viewDate = moment().format(self.format);

    $scope.$watch(function() {
        return self.viewDate
    }, function(val) {
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

    $scope.$watch('Project.selected', function(item) {
        self.projectid = item._id;
        self.list();
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

    self.list = function() {
        $api.business[self.tab + 'fundsummary']({
            project: self.projectid,
            time: self.viewDate.replace(/\-/g, ''),
            pageindex: self.paging.index,
            pagesize: self.paging.size
        }, function(data) {

            data = data.result || {};

            angular.forEach(data.detail, function(item) {
                if (!Object.keys(item.earning).length && !Object.keys(item.expenses).length && !Object.keys(item.projectbalance).length && !Object.keys(item.consumption).length && !Object.keys(item.departmentbalance).length) {
                    item.isnull = true;
                }
            });

            self.listData = data.detail || [];
            self.listData.index = (data.paging || {}).pageindex || 1;
            self.listData.total = (data.paging || {}).count || 0;

        });
    };

    // 账单
    self.exportBill = function(item) {
        delete item.downloadFileBill;
        if (self.tab === 'daily') {
            $api.export.projectdailybill({
                project: self.projectid,
                time: item.time
            }, function(data) {
                if (data.result.fn) {
                    item.downloadFileBill = data.result.fn;
                    item.downloadNameBill = EMAPP.Project.selected.title + '_' + $state.$current.data.title + '_日账单_' + item.time;
                }
            });
        } else {
            $api.export.projectmonthlybill({
                project: self.projectid,
                time: item.time
            }, function(data) {
                if (data.result.fn) {
                    item.downloadFileBill = data.result.fn;
                    item.downloadNameBill = EMAPP.Project.selected.title + '_' + $state.$current.data.title + '_月账单_' + item.time;
                }
            });
        }
    };

    // 回单
    self.exportReceipt = function(item) {
        delete item.downloadFileReceipt;
        if (self.tab === 'daily') {
            $api.export.projectdailyreceipt({
                project: self.projectid,
                time: item.time
            }, function(data) {
                if (data.result.fn) {
                    item.downloadFileReceipt = data.result.fn;
                    item.downloadNameReceipt = EMAPP.Project.selected.title + '_' + $state.$current.data.title + '_日回单_' + item.time;
                }
            });
        } else {
            $api.export.projectmonthlyreceipt({
                project: self.projectid,
                time: item.time
            }, function(data) {
                if (data.result.fn) {
                    item.downloadFileReceipt = data.result.fn;
                    item.downloadNameReceipt = EMAPP.Project.selected.title + '_' + $state.$current.data.title + '_月回单_' + item.time;
                }
            });
        }
    };

}]);