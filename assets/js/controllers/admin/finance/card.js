angular.module('app').controller('Finance.card', ["$scope", "$filter", "$timeout", "$api", "$q", "$state", "$stateParams", "uiGridConstants", function ($scope, $filter, $timeout, $api, $q, $state, $stateParams, uiGridConstants) {

    var self = this;

    self.paneHeight = 90.01;

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

    //筛选
    self.filter = function () {
        self.gridOptions.enableFiltering = !self.gridOptions.enableFiltering;
        self.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    //导出
    self.export = function () {
        self.gridOptions.exporterCsvFilename = '平台财务_银行卡管理.csv';
        self.gridApi.exporter.csvExport('visible', 'visible', angular.element(document.querySelectorAll('.subContent')));
    };

    self.list = function (loadMore) {
        if (loadMore && self.gridOptions.paging && self.gridOptions.paging.count <= (self.gridOptions.paging.pageindex * self.gridOptions.paging.pagesize)) {
            return;
        }
        return $api.channelaccount.info({
            // project: 'PLT',
            // status: 'CHECKING',
            all: 1,
            flow: 'EXPENSE',
            pageindex: (loadMore && self.gridOptions.paging ? self.gridOptions.paging.pageindex : 0) + 1,
            pagesize: 100
        }, function (data) {
            data = data.result || {};
            angular.forEach(data.detail, function (item) {
                item.timecreate = item.timecreate && $filter('date')(item.timecreate * 1000, 'yyyy-M-dd H:mm:ss') || '';
            });
            if (loadMore) {
                self.gridOptions.data = self.gridOptions.data.concat(data.detail || []);
            } else {
                self.gridOptions.data = data.detail || [];
                self.gridOptions.data.length && $timeout(function () {
                    self.gridApi.core.scrollTo(self.gridOptions.data[0], self.gridOptions.columnDefs[0]);
                });
            }
            angular.forEach(self.gridOptions.data, function (item) {
                if (item.locate && angular.isString(item.locate)) {
                    angular.forEach(JSON.parse(item.locate), function (val, key) {
                        this.push(val);
                    }, item.locate = []);
                    item.locate = item.locate.join('-');
                }
            });
            self.gridOptions.paging = data.paging;
            $timeout(function () {
                self.paneHeight = 90;
            });
            self.gridApi.grid.element.height('auto');
            return data;
        }).$promise;
    };

    self.list();

    self.gridOptions = {
        onRegisterApi: function (gridApi) {
            gridApi.infiniteScroll.on.needLoadMoreData($scope, function () {
                var defer = $q.defer(),
                    inject = defer.resolve,
                    reject = function () {
                        gridApi.infiniteScroll.dataLoaded();
                        defer.reject();
                    };
                (function (promise) {
                    if (promise) {
                        promise.then(function () {
                            gridApi.infiniteScroll.saveScrollPercentage();
                            gridApi.infiniteScroll.dataLoaded(false, true).then(inject, reject);
                        }, reject);
                    } else {
                        reject();
                    }
                }(self.list(true)));
                return defer.promise;
            });
            self.gridApi = gridApi;
        },
        infiniteScrollDown: true,
        enableColumnResizing: true,
        exporterOlderExcelCompatibility: true,
        exporterFieldCallback: function (grid, row, col, value) {
            if (/status/.test(col.field)) {
                value = self.status[value] || '';
            }
            return value === 0 ? 0 : ('="' + (value || '') + '"');
        },
        columnDefs: [{
            displayName: '',
            name: '$index',
            type: 'number',
            width: 50,
            minWidth: 50,
            enableColumnMenu: false,
            exporterSuppressExport: true,
            headerCellClass: 'text-center',
            headerCellTemplate: '<div class="ui-grid-cell-contents">序号</div>',
            cellClass: 'text-center',
            cellTemplate: '<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
        }, {
            displayName: '项目名称',
            name: 'project',
            width: '*',
            minWidth: 120,
            enableColumnMenu: false //,
                // cellTemplate: '<div class="ui-grid-cell-contents text-primary"><a ui-sref="admin.finance.card({projectid:row.entity.project})" ng-bind="COL_FIELD"></a></div>'
        }, {
            displayName: '银行卡号',
            name: 'account',
            width: '*',
            minWidth: 180,
            enableColumnMenu: false
        }, {
            displayName: '开户银行',
            name: 'origin',
            width: '*',
            minWidth: 120,
            enableColumnMenu: false
        }, {
            displayName: '支行名称',
            name: 'subbranch',
            width: '*',
            minWidth: 120,
            enableColumnMenu: false
        }, {
            displayName: '账户归属',
            name: 'locate',
            width: '*',
            minWidth: 220,
            enableColumnMenu: false
        }, {
            displayName: '申请状态',
            name: 'status',
            width: '*',
            minWidth: 120,
            enableColumnMenu: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{\'text-primary\':COL_FIELD===\'CHECKING\',\'text-success\':COL_FIELD===\'SUCCESS\',\'text-danger\':COL_FIELD===\'FAILED\'}" ng-bind="grid.appScope.self.status[COL_FIELD]"></div>'
        }, {
            displayName: '申请时间',
            name: 'timecreate',
            width: '*',
            minWidth: 130
        }, {
            displayName: '操作',
            name: 'operation',
            width: '*',
            minWidth: 80,
            enableColumnMenu: false,
            exporterSuppressExport: true,
            cellTemplate: '<div class="ui-grid-cell-contents text-primary"><a ui-sref="admin.finance.card.detail({id:row.entity.id})">{{{true:\'审核\',false:\'查看详情\'}[row.entity.status===\'CHECKING\']}}</a></div>'
        }]
    };

}]);