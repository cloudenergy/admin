angular.module("app").directive("recordSuccess",["$api","$uibModal",function(e,t){return{restrict:"A",link:function(i,n,l,o){!function(i){i&&"RECHARGING"===i.category&&n.click(function(){i.popup=!0,e.business.ordernodetail({id:i.id},function(e){t.open({size:"lg",windowClass:"no-border",templateUrl:"templates/admin/property/record-success.html?rev=9e1ac025de",controllerAs:"self",controller:["$filter","$uibModalInstance",function(t,i){var n=this;n.detail=e.result||{},n.detail.timepaid=n.detail.timepaid&&t("date")(1e3*n.detail.timepaid,"yyyy-M-dd H:mm:ss")||"",n.Cancel=i.dismiss}]}).result.then(function(){delete i.popup},function(){delete i.popup})})})}(i.$eval(l.recordSuccess))}}}]);