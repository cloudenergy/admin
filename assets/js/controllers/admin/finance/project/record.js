angular.module('app').controller('Finance.project.record', ["$scope", "$api", "$filter", "$state", "$stateParams", "$timeout", "$q", "uiGridConstants", function ($scope, $api, $filter, $state, $stateParams, $timeout, $q, uiGridConstants) {

    var self = this,
        nowDate = new Date();

    self.tab = $stateParams.tab || 'all';
    self.projectid = $stateParams.projectid;

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

    //状态
    self.status = [{
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

    angular.forEach(self.status, function (item) {
        this[item.key] = {
            title: item.title,
            class: item.class
        };
    }, self.status);

    self.projectname = $state.$current.parent.data.title = EMAPP.Project[self.projectid].title;

    //筛选
    self.filter = function () {
        self.gridOptions.enableFiltering = !self.gridOptions.enableFiltering;
        self.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    //导出
    self.export = function () {
        self.gridOptions.exporterCsvFilename = (self.projectname ? self.projectname + '_' : '') + {
            all: '收支明细',
            in: '收入',
            out: '提现'
        }[self.tab] + '_' + self.startDate.replace(/\-/g, '') + '_' + self.endDate.replace(/\-/g, '') + '.csv';
        self.gridApi.exporter.csvExport('visible', 'visible', angular.element(document.querySelectorAll('.subContent')));
    };

    self.list = function (loadMore) {
        if (loadMore && self.gridOptions.paging && self.gridOptions.paging.count <= (self.gridOptions.paging.pageindex * self.gridOptions.paging.pagesize)) {
            return;
        }
        var options = {
            // payer: 'PLT',
            // uid: EMAPP.Account._id,//用户ID
            project: self.projectid || undefined,
            key: self.searchText || undefined, //项目名或账户名
            from: self.startDate.replace(/\-/g, ''), //查询起始'YYYYMMDD'
            to: self.endDate.replace(/\-/g, ''), //查询截止'YYYYMMDD'
            // flow: 'EARNING',//流水方向(收入EARNING/支出EXPENSE)
            // category: 流水类型
            // status: 流水状态,
            pageindex: (loadMore && self.gridOptions.paging ? self.gridOptions.paging.pageindex : 0) + 1,
            pagesize: 100,
            cancellable: true
        };

        if (self.tab == 'in') {
            options.flow = 'EARNING';
            self.gridOptions.columnDefs = inColumn;
        }
        if (self.tab == 'all') {
            self.gridOptions.columnDefs = inColumn;
        }
        if (self.tab == 'out') {
            options.flow = 'EXPENSE';
            self.gridOptions.columnDefs = outColumn;
        }
        if (self.status.selected) {
            options.status = self.status.selected;
        }

        return $api.business.fundflow(options, function (data) {
            data = data.result || {};
            angular.forEach(data.detail, function (item) {
                item.timecreate = item.timecreate && $filter('date')(item.timecreate * 1000, 'yyyy-M-dd H:mm:ss') || '';
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

    var outColumn = [{
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
            displayName: '交易金额 ¥',
            name: 'amount',
            width: '*',
            minWidth: 120,
            cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{\'text-danger\': COL_FIELD>0, \'text-success\': COL_FIELD<0}" ng-if="COL_FIELD" ng-bind="COL_FIELD"></div>'
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
            cellTemplate: '<div class="ui-grid-cell-contents text-{{grid.appScope.self.status[COL_FIELD].class}}" ng-bind="grid.appScope.self.status[COL_FIELD].title"></div>'
        }, {
            displayName: '到账时间',
            name: 'timepaid',
            width: '*',
            minWidth: 130
        }, {
            displayName: '操作帐号',
            name: 'operator',
            minWidth: 200
        }, {
            displayName: '操作后余额',
            name: 'balance',
            minWidth: 100
        }, {
            displayName: '提交时间',
            name: 'timecreate',
            width: '*',
            minWidth: 130,
            enableColumnMenu: false
        }, {
            displayName: '跟踪',
            name: 'operation',
            minWidth: 80,
            cellTemplate: '<div class="ui-grid-cell-contents text-primary"><a class="text-primary" href="javascript:void(0)">查看详情</a></div>'
        }],
        inColumn = [{
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
            displayName: '交易金额 ¥',
            name: 'amount',
            width: '*',
            minWidth: 120,
            cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{\'text-danger\': COL_FIELD<0, \'text-success\': COL_FIELD>0}" ng-if="COL_FIELD" ng-bind="COL_FIELD"></div>'
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
            cellTemplate: '<div class="ui-grid-cell-contents text-{{grid.appScope.self.status[COL_FIELD].class}}" ng-bind="grid.appScope.self.status[COL_FIELD].title"></div>'
        }, {
            displayName: '操作后余额',
            name: 'balance',
            minWidth: 100
        }, {
            displayName: '提交时间',
            name: 'timecreate',
            width: '*',
            minWidth: 130,
            enableColumnMenu: false
        }];

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
                value = self.status[value] && self.status[value].title || '';
            }
            return value === 0 ? 0 : ('="' + (value || '') + '"');
        },
        columnDefs: outColumn
    };

    self.list();
}]);