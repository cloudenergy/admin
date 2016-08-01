angular.module('app').controller('Finance.record.out', ["$scope", "$filter", "$timeout", "$api", "$q", "$state", "$stateParams", "uiGridConstants", function($scope, $filter, $timeout, $api, $q, $state, $stateParams, uiGridConstants) {

    var self = this,
        nowDate = new Date();

    self.projectid = $stateParams.projectid;

    self.paneHeight = 90.01;

    self.searchText = '';

    self.startDate = $filter('date')(nowDate, 'yyyy-MM-01');
    self.endDate = $filter('date')(nowDate, 'yyyy-MM-dd');

    //类型
    self.types = [{
        title: '全部类型'
    }, {
        key: 'RECHARGING',
        title: '充值'
    }, {
        key: 'WITHDRAW',
        title: '提现'
    }, {
        key: 'PAYFEES',
        title: '缴费'
    }, {
        key: 'HANDLINGCHARGE',
        title: '服务费'
    }];
    angular.forEach(self.types, function(item) {
        this[item.key] = item.title;
    }, self.status);

    //状态
    self.status = [{
        title: '全部状态'
    }, {
        key: 'CHECKING',
        title: '等待审核'
    }, {
        key: 'CHECKFAILED',
        title: '审核失败'
    }, {
        key: 'PROCESSING',
        title: '正在处理'
    }, {
        key: 'FAILED',
        title: '处理失败'
    }, {
        key: 'SUCCESS',
        title: '完成'
    }];
    angular.forEach(self.status, function(item) {
        this[item.key] = item.title;
    }, self.status);

    //操作相关：颜色，图标，文字
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
            CHECKFAILED: '查看明细',
            FAILED: '查看明细',
            SUCCESS: '查看明细'
        }
    };

    //日期选择
    $('#start_date').bind('dp.change', function(event) {
        $timeout(function() {
            event.date && event.oldDate && self.list();
        });
    });
    $('#end_date').bind('dp.change', function(event) {
        $timeout(function() {
            event.date && event.oldDate && self.list();
        });
    });

    //筛选
    self.filter = function() {
        self.gridOptions.enableFiltering = !self.gridOptions.enableFiltering;
        self.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    //导出
    self.export = function() {
        self.gridOptions.exporterCsvFilename = '平台财务_支出_' + (self.projectname ? self.projectname + '_' : '') + self.startDate.replace(/\-/g, '') + '_' + self.endDate.replace(/\-/g, '') + '.csv';
        self.gridApi.exporter.csvExport('visible', 'visible', angular.element(document.querySelectorAll('.subContent')));
    };

    if (self.projectid) {

        $state.$current.data.title = self.projectname = EMAPP.Project[self.projectid].title;

        $api.business.accountbalance({
            project: self.projectid
        }, function(data) {
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
    self.placeholder = self.projectid && "商户名称" || "项目名称";
    self.list = function(loadMore) {
        if (loadMore && self.gridOptions.paging && self.gridOptions.paging.count <= (self.gridOptions.paging.pageindex * self.gridOptions.paging.pagesize)) return;
        return $api.business.pltfundflow({
            // payer: 'PLT',
            // uid: EMAPP.Account._id,//用户ID
            projectid: self.projectid || undefined,
            key: self.searchText || undefined, //项目名或账户名
            from: self.startDate.replace(/\-/g, ''), //查询起始'YYYYMMDD'
            to: self.endDate.replace(/\-/g, ''), //查询截止'YYYYMMDD'
            flow: 'EXPENSE', //流水方向(收入EARNING/支出EXPENSE)
            category: self.types.selected || undefined, //流水类型
            status: self.status.selected || undefined, //流水状态,
            pageindex: (loadMore && self.gridOptions.paging ? self.gridOptions.paging.pageindex : 0) + 1,
            pagesize: 100
        }, function(data) {
            data = data.result || {};
            angular.forEach(data.detail, function(item) {
                item.timecreate = item.timecreate && $filter('date')(item.timecreate * 1000, 'yyyy-M-dd H:mm:ss') || '';
                var ca = [];
                item.channelaccount.name && ca.push(item.channelaccount.name);
                item.channelaccount.origin && ca.push(item.channelaccount.origin);
                item.channelaccount.account && ca.push('尾号: ' + item.channelaccount.account.substr(item.channelaccount.account.length - 4));
                item.channelaccount = ca.join(' | ') || '关联账户不存在';
            });
            if (loadMore) {
                self.gridOptions.data = self.gridOptions.data.concat(data.detail || []);
            } else {
                self.gridOptions.data = data.detail || [];
                self.gridOptions.data.length && $timeout(function() {
                    self.gridApi.core.scrollTo(self.gridOptions.data[0], self.gridOptions.columnDefs[0]);
                });
            }
            self.gridOptions.paging = data.paging;
            $timeout(function() {
                self.paneHeight = 90;
            });
            self.gridApi.grid.element.height('auto');
            return data;
        }).$promise;
    };

    self.list();

    self.gridOptions = {
        onRegisterApi: function(gridApi) {
            gridApi.infiniteScroll.on.needLoadMoreData($scope, function() {
                var defer = $q.defer(),
                    inject = defer.resolve,
                    reject = function() {
                        gridApi.infiniteScroll.dataLoaded();
                        defer.reject();
                    };
                (function(promise) {
                    if (promise) {
                        promise.then(function() {
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
        exporterFieldCallback: function(grid, row, col, value) {
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
            name: 'projectname',
            width: '*',
            minWidth: 120,
            visible: !self.projectid,
            enableColumnMenu: false,
            cellTemplate: '<div class="ui-grid-cell-contents text-primary"><a ui-sref="admin.finance.record.out.project({projectid:row.entity.project})" ng-bind="COL_FIELD"></a></div>'
        }, {
            displayName: '交易帐户',
            name: 'channelaccount',
            width: '*',
            minWidth: 220,
            enableColumnMenu: false
        }, {
            displayName: '提现金额 ¥',
            name: 'amount',
            width: '*',
            minWidth: 120
        }, {
            displayName: '操作后余额 ¥',
            name: 'balance',
            width: '*',
            minWidth: 120,
            enableColumnMenu: false
        }, {
            displayName: '交易类型',
            name: 'category',
            width: '*',
            minWidth: 100,
            enableColumnMenu: false
        }, {
            displayName: '交易状态',
            name: 'status',
            width: '*',
            minWidth: 100,
            enableColumnMenu: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ng-class="grid.appScope.self.operation.color[row.entity.status]" ng-bind="grid.appScope.self.status[COL_FIELD]"></div>'
        }, {
            displayName: '提交时间',
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
            cellTemplate: '<div class="ui-grid-cell-contents text-primary"><a class="text-primary" ui-sref="admin.finance.record.out.project.detail({projectid:row.entity.project,orderno:row.entity.orderno})" ng-bind="grid.appScope.self.operation.text[row.entity.status]"></a></div>'
        }]
    };

}]);