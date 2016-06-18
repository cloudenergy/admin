angular.module("app").controller("Finance.card",["$scope","$filter","$timeout","$api","$q","$state","$stateParams","uiGridConstants",function(e,i,t,n,a,l,r,o){var d=this;d.paneHeight=90.01,d.status=[{key:"CHECKING",title:"等待审核"},{key:"FAILED",title:"审核失败"},{key:"SUCCESS",title:"审核通过"}],angular.forEach(d.status,function(e){this[e.key]=e.title},d.status),d.filter=function(){d.gridOptions.enableFiltering=!d.gridOptions.enableFiltering,d.gridApi.core.notifyDataChange(o.dataChange.COLUMN)},d["export"]=function(){d.gridOptions.exporterCsvFilename="平台财务_银行卡管理.csv",d.gridApi.exporter.csvExport("visible","visible",angular.element(document.querySelectorAll(".subContent")))},d.list=function(e){return e&&d.gridOptions.paging&&d.gridOptions.paging.count<=d.gridOptions.paging.pageindex*d.gridOptions.paging.pagesize?void 0:n.channelaccount.info({all:1,flow:"EXPENSE",pageindex:(e&&d.gridOptions.paging?d.gridOptions.paging.pageindex:0)+1,pagesize:100},function(n){return n=n.result||{},angular.forEach(n.detail,function(e){e.timecreate=e.timecreate&&i("date")(1e3*e.timecreate,"yyyy-M-dd H:mm:ss")||""}),e?d.gridOptions.data=d.gridOptions.data.concat(n.detail||[]):(d.gridOptions.data=n.detail||[],d.gridOptions.data.length&&t(function(){d.gridApi.core.scrollTo(d.gridOptions.data[0],d.gridOptions.columnDefs[0])})),angular.forEach(d.gridOptions.data,function(e){e.locate&&angular.isString(e.locate)&&(angular.forEach(JSON.parse(e.locate),function(e,i){this.push(e)},e.locate=[]),e.locate=e.locate.join("-"))}),d.gridOptions.paging=n.paging,t(function(){d.paneHeight=90}),d.gridApi.grid.element.height("auto"),n}).$promise},d.list(),d.gridOptions={onRegisterApi:function(i){i.infiniteScroll.on.needLoadMoreData(e,function(){var e=a.defer(),t=e.resolve,n=function(){i.infiniteScroll.dataLoaded(),e.reject()};return function(e){e?e.then(function(){i.infiniteScroll.saveScrollPercentage(),i.infiniteScroll.dataLoaded(!1,!0).then(t,n)},n):n()}(d.list(!0)),e.promise}),d.gridApi=i},infiniteScrollDown:!0,enableColumnResizing:!0,exporterOlderExcelCompatibility:!0,exporterFieldCallback:function(e,i,t,n){return/status/.test(t.field)&&(n=d.status[n]||""),0===n?0:'="'+(n||"")+'"'},columnDefs:[{displayName:"",name:"$index",type:"number",width:50,minWidth:50,enableColumnMenu:!1,exporterSuppressExport:!0,headerCellClass:"text-center",headerCellTemplate:'<div class="ui-grid-cell-contents">序号</div>',cellClass:"text-center",cellTemplate:'<div class="ui-grid-cell-contents" ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"></div>'},{displayName:"项目名称",name:"project",width:"*",minWidth:120,enableColumnMenu:!1},{displayName:"银行卡号",name:"account",width:"*",minWidth:180,enableColumnMenu:!1},{displayName:"开户银行",name:"origin",width:"*",minWidth:120,enableColumnMenu:!1},{displayName:"支行名称",name:"subbranch",width:"*",minWidth:120,enableColumnMenu:!1},{displayName:"账户归属",name:"locate",width:"*",minWidth:220,enableColumnMenu:!1},{displayName:"申请状态",name:"status",width:"*",minWidth:120,enableColumnMenu:!1,cellTemplate:"<div class=\"ui-grid-cell-contents\" ng-class=\"{'text-primary':COL_FIELD==='CHECKING','text-success':COL_FIELD==='SUCCESS','text-danger':COL_FIELD==='FAILED'}\" ng-bind=\"grid.appScope.self.status[COL_FIELD]\"></div>"},{displayName:"申请时间",name:"timecreate",width:"*",minWidth:130},{displayName:"操作",name:"operation",width:"*",minWidth:80,enableColumnMenu:!1,exporterSuppressExport:!0,cellTemplate:"<div class=\"ui-grid-cell-contents text-primary\"><a ui-sref=\"admin.finance.card.detail({id:row.entity.id})\">{{{true:'审核',false:'查看详情'}[row.entity.status==='CHECKING']}}</a></div>"}]}}]);