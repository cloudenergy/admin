EMAPP.register.controller("CollectorCreate",["$scope","$location","SettingMenu","Collector","Project","API","Auth","$stateParams","UI",function(r,t,e,o,c,n,l,i,a){l.Check(function(){function e(r){a.AlertError(r.data.message)}r.submit=function(){var c=angular.copy(r.collector);c.project=c.project._id,n.Query(o.add,c,function(r){r.code?a.AlertWarning(r.message):t.path("/admin/collector/info")},e)};i.project;r.isEdit=!1,n.Query(c.info,function(t){t.err||(r.projects=angular.isArray(t.result)?t.result:[t.result],r.collector=r.collector||{},r.collector.project=_.find(r.projects,function(r){return r._id==i.project}))})})}]);