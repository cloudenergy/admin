angular.module('app').controller('Finance.record.in', ["$scope", "$filter", "$templateCache", "$timeout", "$api", "$q", "$state", "$stateParams", "uiGridConstants", function ($scope, $filter, $templateCache, $timeout, $api, $q, $state, $stateParams, uiGridConstants) {

    var self = this,
        nowDate = new Date();

    self.projectid = $stateParams.projectid;

    self.paneHeight = 90.01;

    self.searchText = '';
    self.startDate = $filter('date')(nowDate, 'yyyy-MM-01');
    self.endDate = $filter('date')(nowDate, 'yyyy-MM-dd');

    $('#start_date').bind('dp.change', function (event) {
        $timeout(function () {
            event.date && event.oldDate && self.list();
        });
    });
    $('#end_date').bind('dp.change', function (event) {
        $timeout(function () {
            event.date && event.oldDate && self.list();
        });
    });

    //筛选
    self.filter = function () {
        self.gridOptions.enableFiltering = !self.gridOptions.enableFiltering;
        self.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    //导出
    self.export = function () {
        self.gridOptions.exporterCsvFilename = '平台财务_收入_' + (self.projectname ? self.projectname + '_' : '') + self.startDate.replace(/\-/g, '') + '_' + self.endDate.replace(/\-/g, '') + '.csv';
        self.gridApi.exporter.csvExport('visible', 'visible', angular.element(document.querySelectorAll('.subContent')));
    };

    if (self.projectid) {

        $state.$current.data.title = self.projectname = EMAPP.Project[self.projectid].title;

        $api.business.accountbalance({
            project: self.projectid
        }, function (data) {
            // cash: 可用金额,
            // frozen: 不可用金额,
            // earning: 收入,
            // withdraw: 提现
            self.accountbalance = data.result || {};
            self.accountbalance.total = Math.round((self.accountbalance.cash + self.accountbalance.frozen) * 100) / 100;
            self.accountbalance.cash = Math.round(self.accountbalance.cash * 100) / 100;
            self.accountbalance.frozen = Math.round(self.accountbalance.frozen * 100) / 100;
        });

    }
    self.placeholder = self.projectid && '商户名称' || '项目名称';
    self.list = function (loadMore) {
        if (loadMore && self.gridOptions.paging && self.gridOptions.paging.count <= (self.gridOptions.paging.pageindex * self.gridOptions.paging.pagesize)) {
            return;
        }
        return $api.business.pltfundflow({
            // payer: 'PLT',
            // uid: EMAPP.Account._id,//用户ID
            projectid: self.projectid || undefined,
            key: self.searchText || undefined, //项目名或账户名
            from: self.startDate.replace(/\-/g, ''), //查询起始'YYYYMMDD'
            to: self.endDate.replace(/\-/g, ''), //查询截止'YYYYMMDD'
            flow: 'EARNING', //流水方向(收入EARNING/支出EXPENSE)
            // category: 流水类型
            // status: 流水状态,
            pageindex: (loadMore && self.gridOptions.paging ? self.gridOptions.paging.pageindex : 0) + 1,
            pagesize: 100,
            cancellable: true
        }, function (data) {
            data = data.result || {};
            angular.forEach(data.detail, function (item) {
                item.timepaid = item.timepaid && $filter('date')(item.timepaid * 1000, 'yyyy-M-dd H:mm:ss') || '';
            });
            if (loadMore) {
                self.gridOptions.data = self.gridOptions.data.concat(data.detail || []);
            } else {
                self.gridOptions.data = data.detail || [];
                self.gridOptions.data.length && $timeout(function () {
                    self.gridApi.core.scrollTo(self.gridOptions.data[0], self.gridOptions.columnDefs[0]);
                });
            }
            self.gridOptions.paging = data.paging;
            $timeout(function () {
                self.paneHeight = 90;
            });
            self.gridApi.grid.element.height('auto');
            return data;
        }).$promise;
    };

    self.list();

    self.gridRowChanged = function () {
        self.sum = {
            amount: 0,
            balance: 0
        };
        angular.forEach(self.gridApi.core.getVisibleRows(self.gridApi.grid), function (item) {
            if (item.entity.status === 'SUCCESS') {
                self.sum.amount = Math.round((self.sum.amount + item.entity.amount) * 100) / 100;
                self.sum.balance = Math.round((self.sum.balance + item.entity.balance) * 100) / 100;
            }
        });
    };

    self.gridOptions = {
        onRegisterApi: function (gridApi) {

            gridApi.core.on.rowsRendered($scope, self.gridRowChanged);

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
            headerCellTemplate: '<div  class="ui-grid-cell-contents">序号</div>',
            cellClass: 'text-center',
            cellTemplate: '<div  class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'
        }, {
            displayName: '项目名称',
            name: 'projectname',
            width: '*',
            minWidth: 120,
            visible: !self.projectid,
            enableColumnMenu: false,
            cellTemplate: '<div  class="ui-grid-cell-contents text-primary"><a ui-sref="admin.finance.record.in.project({projectid:row.entity.project})" ng-bind="COL_FIELD"></a></div>'
        }, {
            displayName: '充值商户',
            name: 'from',
            width: '*',
            minWidth: 120,
            enableColumnMenu: false
        }, {
            displayName: '充值金额 ¥',
            name: 'amount',
            width: '*',
            minWidth: 120,
            headerCellTemplate: function () {
                return $templateCache.get('ui-grid/uiGridHeaderCell')
                    .replace('</sub></span></div><div  role="button" tabindex="0"', '</sub></span><div  class="text-info">合计：{{grid.appScope.self.sum.amount}}</div></div><div  role="button" tabindex="0"');
            }
        }, {
            displayName: '充值后余额 ¥',
            name: 'balance',
            width: '*',
            minWidth: 120,
            enableColumnMenu: false
        }, {
            displayName: '到账时间',
            name: 'timepaid',
            width: '*',
            minWidth: 130
        }]
    };

}]);