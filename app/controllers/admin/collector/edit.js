angular.module("app").controller("CollectorEdit",["$scope","$location","$stateParams","SettingMenu","Collector","Project","API","Auth","UI",function(o,t,r,e,c,n,i,l,u){l.Check(function(){function l(o){u.AlertError(o.data.message)}e(function(t){o.menu=t}),o.submit=function(){var e=angular.copy(o.collector);e.project=e.project._id,e._id=r.id,console.log(e),i.Query(c.update,e,function(o){t.path("/admin/collector/info")},l)},o.isEdit=!0,i.Query(c.info,{id:r.id},function(t){t.err||(o.collector=t.result,i.Query(n.info,function(t){t.err||(o.projects=angular.isArray(t.result)?t.result:[t.result],o.collector.project=_.find(o.projects,function(t){return t._id==o.collector.project._id}))}))},l)})}]);