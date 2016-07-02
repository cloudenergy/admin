angular.module("app").controller("Property.record",["$scope","$api","$state","$stateParams",function(t,e,a,n){function o(){var t={project:i.projectid||void 0,key:i.searchText||void 0,from:i.startDate.replace(/\-/g,""),to:i.endDate.replace(/\-/g,""),flow:{"in":"EARNING",out:"EXPENSE"}[i.tab],category:i.category.selected||void 0,status:i.status.selected||void 0,amount:[void 0===i.amount.start?null:parseFloat(i.amount.start),void 0===i.amount.end?null:parseFloat(i.amount.end)]};if(void 0!==i.dateRange.selected)switch(i.dateRange.selected){case 0:t.from=t.to=moment().format("YYYYMMDD");break;case 1:t.from=t.to=moment().subtract(1,"day").format("YYYYMMDD");break;case 2:t.from=moment().subtract(7,"day").format("YYYYMMDD"),t.to=moment().format("YYYYMMDD");break;case 3:t.from=moment().subtract(30,"day").format("YYYYMMDD"),t.to=moment().format("YYYYMMDD")}return t}var i=this,c=EMAPP.Account._id+"_property_record_daterange",r=EMAPP.Account._id+"_property_record_pagesize";t.$watch(function(){return i.startDate},function(t){i.listData&&i.list()}),t.$watch(function(){return i.endDate},function(t){i.listData&&i.list()}),t.$watch(function(){return i.paging.index},function(){i.list()}),t.$watch(function(){return i.paging.size},function(t){localStorage.setItem(r,t),i.listData&&i.list()}),i.tab=n.tab||"all",i.projectid=n.projectid,i.startDate=moment().format("YYYY-MM-01"),i.endDate=moment().format("YYYY-MM-DD"),i.amount={},i.dateRange=["今天","昨天","最近7天","最近30天"],i.dateRange.selected=localStorage.getItem(c)||void 0,i.dateRange.selected&&(i.dateRange.selected=parseInt(i.dateRange.selected)),i.dateRange.select=function(t){i.dateRange.selected===t?(localStorage.removeItem(c),delete i.dateRange.selected):(localStorage.setItem(c,t),i.dateRange.selected=t),i.list()},i.status=[{title:"全部状态"},{key:"CHECKING",title:"等待审核","class":"primary"},{key:"CHECKFAILED",title:"审核失败","class":"warning"},{key:"PROCESSING",title:"正在处理","class":"info"},{key:"FAILED",title:"处理失败","class":"danger"},{key:"SUCCESS",title:"完成","class":"success"}],angular.forEach(i.status,function(t){this[t.key]={title:t.title,"class":t["class"]}},i.status),i.category=[{title:"全部类型"},{key:"RECHARGING",title:"充值"},{key:"WITHDRAW",title:"提现"},{key:"PAYFEES",title:"缴费"},{key:"HANDLINGCHARGE",title:"手续费"},{key:"HANDLINGCHARGERCG",title:"充值服务费"},{key:"HANDLINGCHARGEWTD",title:"提现服务费"},{key:"alipay",title:"支付宝手机支付"},{key:"wx",title:"微信支付"},{key:"wx_pub",title:"微信公众号支付"},{key:"bankcard",title:"银行卡支付"}],angular.forEach(i.category,function(t){this[t.key]=t},i.category),i.category.selected=n.category||void 0,e.project.info({id:i.projectid},function(t){i.projectname=t.result.title,a.$current.parent.data.title="物业财务 - "+t.result.title}),i.paging={index:1,size:parseInt(localStorage.getItem(r)||10),items:[{key:10,title:"每页10条"},{key:15,title:"每页15条"},{key:30,title:"每页30条"},{key:50,title:"每页50条"},{key:100,title:"每页100条"}]},i.list=function(){e.$request&&e.$request.$cancelRequest(),e.$request=e.business.fundflow(angular.extend(o(),{pageindex:i.paging.index,pagesize:i.paging.size}),function(t){delete e.$request,t=t.result||{},angular.forEach(t.detail,function(t){t.channelaccount&&t.channelaccount.account&&(t.channelaccount.tail=t.channelaccount.account.replace(/\d+(\d{4})$/,"$1")),t.timecreate=t.timecreate&&moment(1e3*t.timecreate).format("YYYY-M-DD H:mm:ss")||"",t.timecheck=t.timecheck&&moment(1e3*t.timecheck).format("YYYY-M-DD H:mm:ss")||"",t.timepaid=t.timepaid&&moment(1e3*t.timepaid).format("YYYY-M-DD H:mm:ss")||""}),i.listData=t.detail||[],i.listData.index=(t.paging||{}).pageindex||1,i.listData.total=(t.paging||{}).count||0,i.statistic=t.statistic||{}})},i.exportProjectflow=function(){delete i.downloadFile,e["export"].projectflow(angular.extend(o(),{type:{all:"ALL","in":"EARNING",out:"EXPENSES"}[i.tab]}),function(t){if(t.result.fn){var e=o();i.downloadFile=t.result.fn,i.downloadName=i.projectname+"_"+a.$current.data.title+"_"+e.from+"_"+e.to}})}}]);