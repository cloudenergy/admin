angular.module("app").controller("Finance.record.out.detail",["$filter","$api","$state","$stateParams","$uibModal",function(t,e,n,i,r){var o=this;o.status={CHECKING:"等待审核",CHECKFAILED:"审核失败",PROCESSING:"正在处理",FAILED:"处理失败",SUCCESS:"完成"},o.textColor={CHECKING:"text-primary",PROCESSING:"text-warning",CHECKFAILED:"text-danger",FAILED:"text-danger",SUCCESS:"text-success"},o.projectname="云能源",o.projectid=i.projectid,o.orderno=i.orderno,o.card="",o.sash=0,o.pwd="",o.projectid&&e.project.info({id:o.projectid},function(t){n.$current.parent.data.title=t.result.title}),o.getDetail=function(){o.orderno&&e.withdraw.details({id:o.orderno},function(t){o.detail=t.result||{}})},o.getDetail(),o.inject=function(){swal({title:"确认通过此项提现申请吗？",type:"warning",showCancelButton:!0,cancelButtonText:"取消",confirmButtonText:"确认",confirmButtonColor:"#ec6c62"},function(){e.withdraw.checking({id:o.orderno,status:"PASSED",desc:"审核通过"},o.getDetail)})},o.reject=function(t){r.open({templateUrl:"finance-record-detail-modal-reject.html",controllerAs:"self",controller:["$uibModalInstance","UI",function(t,e){this.submit=function(){this.desc?t.close(this.desc):e.AlertWarning("描述内容不能为空","请输入描述信息")},this.cancel=function(){t.dismiss("cancel")}}],size:t}).result.then(function(t){t&&e.withdraw.checking({id:o.orderno,status:"REJECT",desc:t},o.getDetail)})}}]);