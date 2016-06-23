angular.module("app").controller("Property.withdraw",["$api","$filter","$timeout","$state","$stateParams","$uibModal",function(t,a,n,c,e,o){var r,u=this;u.projectid=e.projectid,u.cardSelected=null,u.calAmount=function(){r&&n.cancel(r),r=n(function(){u.amount=u.amount&&Math.round(100*u.amount)/100||u.amount},666)},t.project.info({id:u.projectid},function(t){u.project=t.result,c.$current.parent.data.title="物业财务 - "+t.result.title}),t.business.accountbalance({project:u.projectid},function(t){u.accountbalance=t.result||{},u.accountbalance.total=Math.round(100*(u.accountbalance.cash+u.accountbalance.frozen))/100,u.accountbalance.cash=Math.round(100*u.accountbalance.cash)/100,u.accountbalance.frozen=Math.round(100*u.accountbalance.frozen)/100,u.accountbalance.earning=Math.round(100*u.accountbalance.earning)/100,u.accountbalance.withdraw=Math.round(100*u.accountbalance.withdraw)/100}),t.channelaccount.info({project:u.projectid,all:!0,flow:"EXPENSE",status:"SUCCESS"},function(t){u.cardData=t.result||[]}),u.inject=function(){return u.amount&&(u.amount=Math.round(100*u.amount)/100),u.cardSelected&&u.amount?void t.payment.handlingcharge({channelaccount:u.cardSelected.id,amount:u.amount},function(a){u.fee=a.result.PRJ,o.open({templateUrl:"withdraw_request_confirmation.html",controllerAs:"self",controller:["$uibModalInstance","UI","data",function(t,a,n){this.submit=function(){t.close(this.detail)},this.cancel=function(){t.dismiss("cancel")},this.detail=n,this.detail.timecreate=moment().unix(),this.detail.applicant=EMAPP.Account._id}],resolve:{data:function(){return{card:u.cardSelected,amount:u.amount,fee:u.fee,project:u.projectid}}},size:"md"}).result.then(function(a){t.withdraw.apply({project:a.project,amount:a.amount,channelaccount:a.card.id},function(t){0==t.code?(swal("成功","已提交成功","success"),c.go("admin.property.withdraw")):swal("错误",t.message,"error")})})}):!1}}]);