angular.module('app').controller('Finance.project.list', ["$filter", "$timeout", "$api", "$q", "$state", "$stateParams", "uiGridConstants", function ($filter, $timeout, $api, $q, $state, $stateParams, uiGridConstants) {

    var self = this;

    self.paneHeight = 90;
    self.searchText = '';

    //筛选
    self.filter = function () {
        self.gridOptions.enableFiltering = !self.gridOptions.enableFiltering;
        self.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    //导出
    self.export = function () {
        self.gridOptions.exporterCsvFilename = '平台财务_项目列表.csv';
        self.gridApi.exporter.csvExport('visible', 'visible', angular.element(document.querySelectorAll('.subContent')));
    };

    self.list = function () {
        $api.project.info({
            titlereg: self.searchText || undefined
        }, function (data) {
            self.gridOptions.data = angular.isArray(data.result) ? data.result : [data.result];
            self.gridApi.grid.element.height('auto');
        });
    };

    self.list();

    self.gridOptions = {
        onRegisterApi: function (gridApi) {
            self.gridApi = gridApi;
        },
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
            name: 'title',
            width: '*',
            minWidth: 120,
            enableColumnMenu: false,
            cellTemplate: '<div  class="ui-grid-cell-contents text-primary"><a ui-sref="admin.finance.project.info({projectid:row.entity._id})" ng-bind="COL_FIELD"></a></div>'
        }, {
            displayName: '项目余额 ¥',
            name: 'billingAccount.cash',
            width: '*',
            minWidth: 120,
            enableColumnMenu: false
        }, {
            displayName: '',
            name: 'view',
            width: '*',
            minWidth: 100,
            enableColumnMenu: false,
            exporterSuppressExport: true,
            headerCellClass: 'text-center',
            headerCellTemplate: '<div  class="ui-grid-cell-contents">查看记录</div>',
            cellClass: 'text-center',
            cellTemplate: '<div  class="ui-grid-cell-contents text-primary"><a ui-sref="admin.finance.project.info.record({tab:\'in\',projectid:row.entity._id})">收入记录</a><a class="ml20" ui-sref="admin.finance.project.info.record({tab:\'out\',projectid:row.entity._id})">提现记录</a></div>'
        }, {
            displayName: '',
            name: 'operation',
            width: '*',
            minWidth: 220,
            enableColumnMenu: false,
            exporterSuppressExport: true,
            headerCellClass: 'text-center',
            headerCellTemplate: '<div  class="ui-grid-cell-contents">操作</div>',
            cellClass: 'text-center',
            cellTemplate: '<div  class="ui-grid-cell-contents text-primary"><a ui-sref="admin.finance.project.info({projectid:row.entity._id})">配置银行账户</a><a class="ml20" ui-sref="admin.finance.project.info.withdraw({projectid:row.entity._id})">转账</a></div>'
        }]
    };

}]);