angular.module("app").controller("energycategoryupdate",["$rootScope","$scope","$stateParams","$location","SettingMenu","Energycategory","Auth","API","UI",function(e,t,r,n,o,a,c,u,i){c.Check(function(){function e(e){i.AlertError(e.data.message)}t.submit=function(e){u.Query(a.update,t.energycategory,function(e){i.AlertSuccess("保存成功"),n.path("/admin/energycategory/info")},function(e){i.AlertError(e.data.message)})},u.Query(a.info,{id:r.id},function(e){e.err||(t.energycategory=e.result)},e)})}]);