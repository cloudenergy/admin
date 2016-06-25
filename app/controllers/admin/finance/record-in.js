angular.module("app").controller("Finance.record.in",["$scope","$filter","$templateCache","$timeout","$api","$q","$state","$stateParams","uiGridConstants",function(e,n,t,i,a,o,r,d,c){var l=this,s=new Date;l.projectid=d.projectid,l.paneHeight=90.01,l.searchText="",l.startDate=n("date")(s,"yyyy-MM-01"),l.endDate=n("date")(s,"yyyy-MM-dd"),$("#start_date").bind("dp.change",function(e){i(function(){e.date&&e.oldDate&&l.list()})}),$("#end_date").bind("dp.change",function(e){i(function(){e.date&&e.oldDate&&l.list()})}),l.filter=function(){l.gridOptions.enableFiltering=!l.gridOptions.enableFiltering,l.gridApi.core.notifyDataChange(c.dataChange.COLUMN)},l["export"]=function(){l.gridOptions.exporterCsvFilename="平台财务_收入_"+(l.projectname?l.projectname+"_":"")+l.startDate.replace(/\-/g,"")+"_"+l.endDate.replace(/\-/g,"")+".csv",l.gridApi.exporter.csvExport("visible","visible",angular.element(document.querySelectorAll(".subContent")))},l.projectid&&(a.project.info({id:l.projectid},function(e){l.projectname=e.result.title,r.$current.data.title=l.projectname}),a.business.accountbalance({project:l.projectid},function(e){l.accountbalance=e.result||{},l.accountbalance.total=Math.round(100*(l.accountbalance.cash+l.accountbalance.frozen))/100,l.accountbalance.cash=Math.round(100*l.accountbalance.cash)/100,l.accountbalance.frozen=Math.round(100*l.accountbalance.frozen)/100})),l.list=function(e){return e&&l.gridOptions.paging&&l.gridOptions.paging.count<=l.gridOptions.paging.pageindex*l.gridOptions.paging.pagesize?void 0:a.business.pltfundflow({projectid:l.projectid||void 0,key:l.searchText||void 0,from:l.startDate.replace(/\-/g,""),to:l.endDate.replace(/\-/g,""),flow:"EARNING",pageindex:(e&&l.gridOptions.paging?l.gridOptions.paging.pageindex:0)+1,pagesize:100},function(t){return t=t.result||{},angular.forEach(t.detail,function(e){e.timepaid=e.timepaid&&n("date")(1e3*e.timepaid,"yyyy-M-dd H:mm:ss")||""}),e?l.gridOptions.data=l.gridOptions.data.concat(t.detail||[]):(l.gridOptions.data=t.detail||[],l.gridOptions.data.length&&i(function(){l.gridApi.core.scrollTo(l.gridOptions.data[0],l.gridOptions.columnDefs[0])})),l.gridOptions.paging=t.paging,i(function(){l.paneHeight=90}),l.gridApi.grid.element.height("auto"),t}).$promise},l.list(),l.gridRowChanged=function(){l.sum={amount:0,balance:0},angular.forEach(l.gridApi.core.getVisibleRows(l.gridApi.grid),function(e){"SUCCESS"===e.entity.status&&(l.sum.amount=Math.round(100*(l.sum.amount+e.entity.amount))/100,l.sum.balance=Math.round(100*(l.sum.balance+e.entity.balance))/100)})},l.gridOptions={onRegisterApi:function(n){n.core.on.rowsRendered(e,l.gridRowChanged),n.infiniteScroll.on.needLoadMoreData(e,function(){var e=o.defer(),t=e.resolve,i=function(){n.infiniteScroll.dataLoaded(),e.reject()};return function(e){e?e.then(function(){n.infiniteScroll.saveScrollPercentage(),n.infiniteScroll.dataLoaded(!1,!0).then(t,i)},i):i()}(l.list(!0)),e.promise}),l.gridApi=n},infiniteScrollDown:!0,enableColumnResizing:!0,exporterOlderExcelCompatibility:!0,exporterFieldCallback:function(e,n,t,i){return 0===i?0:'="'+(i||"")+'"'},columnDefs:[{displayName:"",name:"$index",type:"number",width:50,minWidth:50,enableColumnMenu:!1,exporterSuppressExport:!0,headerCellClass:"text-center",headerCellTemplate:'<div class="ui-grid-cell-contents">序号</div>',cellClass:"text-center",cellTemplate:'<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'},{displayName:"项目名称",name:"projectname",width:"*",minWidth:120,visible:!l.projectid,enableColumnMenu:!1,cellTemplate:'<div class="ui-grid-cell-contents text-primary"><a ui-sref="admin.finance.record.in.project({projectid:row.entity.project})" ng-bind="COL_FIELD"></a></div>'},{displayName:"充值商户",name:"from",width:"*",minWidth:120,enableColumnMenu:!1},{displayName:"充值金额 ¥",name:"amount",width:"*",minWidth:120,headerCellTemplate:function(){return t.get("ui-grid/uiGridHeaderCell").replace('</sub></span></div><div role="button" tabindex="0"','</sub></span><div class="text-info">合计：{{grid.appScope.self.sum.amount}}</div></div><div role="button" tabindex="0"')}},{displayName:"充值后余额 ¥",name:"balance",width:"*",minWidth:120,enableColumnMenu:!1},{displayName:"到账时间",name:"timepaid",width:"*",minWidth:130}]}}]);