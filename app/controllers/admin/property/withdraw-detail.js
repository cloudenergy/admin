angular.module("app").directive("withdrawDetail",["$api","$uibModal",function(e,t){return{restrict:"A",link:function(a,i,c,d){!function(a){a&&"WITHDRAW"===a.category&&i.click(function(){a.popup=!0,e.business.ordernodetail({id:a.id},function(e){t.open({size:"lg",windowClass:"no-border",templateUrl:"templates/admin/property/withdraw-detail.html?rev=aaedc20996",controllerAs:"self",controller:["$filter","$uibModalInstance",function(t,a){var i=this;i.detail=e.result||{},i.detail.timecreate=i.detail.timecreate&&t("date")(1e3*i.detail.timecreate,"yyyy-M-dd H:mm:ss")||"",i.detail.timecheck=i.detail.timecheck&&t("date")(1e3*i.detail.timecheck,"yyyy-M-dd H:mm:ss")||"",i.detail.timepaid=i.detail.timepaid&&t("date")(1e3*i.detail.timepaid,"yyyy-M-dd H:mm:ss")||"",i.detail.channelaccount&&(i.detail.channelaccount.tail_account=(i.detail.channelaccount.account||"").replace(/\d+(\d{4})$/,"$1")),i.classes={create:{border:i.detail.timecreate&&"border-success"||"",title:i.detail.timecreate&&"text-success"||"text-muted",icon:i.detail.timecreate&&"fa-check-circle"||"fa-clock-o",text:i.detail.timecreate&&"申请提交成功"||"等待申请"},line_check:i.detail.timecreate&&"border-success"||"border-default",check:{border:i.detail.timecreate&&({CHECKING:"border-warning",CHECKFAILED:"border-danger"}[i.detail.status]||"border-success")||"border-default",title:i.detail.timecreate&&({CHECKING:"text-warning",CHECKFAILED:"text-danger"}[i.detail.status]||"text-success")||"text-muted",icon:i.detail.timecreate&&({CHECKING:"fa-clock-o",CHECKFAILED:"fa-exclamation-circle"}[i.detail.status]||"fa-check-circle")||"fa-clock-o",text:i.detail.timecreate&&({CHECKING:"等待审核",CHECKFAILED:"审核失败"}[i.detail.status]||"审核通过并提交银行")||"等待审核"},line_paid:i.detail.timecreate&&({CHECKING:"border-default",CHECKFAILED:"border-default"}[i.detail.status]||"border-success")||"border-default",paid:{border:{SUCCESS:"border-success",FAILED:"border-danger",PROCESSING:"border-warning"}[i.detail.status]||"border-default",title:{SUCCESS:"text-success",FAILED:"text-danger",PROCESSING:"text-warning"}[i.detail.status]||"text-muted",icon:{SUCCESS:"fa-check-circle",FAILED:"fa-exclamation-circle"}[i.detail.status]||"fa-clock-o",text:{SUCCESS:"交易成功",FAILED:"交易失败",PROCESSING:"正在处理"}[i.detail.status]||"等待交易"}},i.Cancel=a.dismiss}]}).result.then(function(){delete a.popup},function(){delete a.popup})})})}(a.$eval(c.withdrawDetail))}}}]);