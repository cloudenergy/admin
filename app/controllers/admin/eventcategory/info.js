angular.module("app").controller("eventcategoryIndex",["$rootScope","$scope","SettingMenu","Eventcategory","API","Auth","UI","$q","Project",function(e,t,a,n,o,r,u,c,l){t.gateways={SMS:"短信通知",APP:"Web，APP通知",EMAIL:"邮件通知",WECHAT:"微信通知"},t.isGatewayOn=function(e,t){return-1!=e.enablegateway.indexOf(t)},t.updateGateway=function(e,a,r){var u=e.enablegateway.indexOf(a);r.target.checked&&-1==u?e.enablegateway.push(a):e.enablegateway.splice(u,1);var c={templateid:e.id,gateway:e.enablegateway,project:t.projectSelected._id};o.Query(n.update,c,function(e){console.log("update: ",e)})},t.operateStatus={add:{isEnable:!1,url:"/add"},"delete":{isEnable:!1,url:"/delete"},update:{isEnable:!1,url:"/update"}},t.askingRemoveID=void 0,r.Check(t.operateStatus,function(){function e(e){u.AlertError(e.data.message)}o.Query(l.info,function(e){e.err||(t.projects=angular.isArray(e.result)?e.result:[e.result],t.projectSelected=t.projects.length?t.projects[0]:null)}),t.$watch("projectSelected",function(e){e&&o.Query(n.info,{project:e._id},function(e){e.err||(t.Eventcategory=e.result)})}),t.DoRemove=function(a,r,u){a.preventDefault();var c=u;o.Query(n["delete"],{id:r},function(e){t.Eventcategory.splice(c,1)},e)},t.AskForRemove=function(e,a){e.preventDefault(),t.askingRemoveID=a},t.CancelRemove=function(e,a){e.preventDefault(),t.askingRemoveID=void 0}})}]);