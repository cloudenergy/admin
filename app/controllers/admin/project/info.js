EMAPP.register.controller("projectInfo",["$rootScope","$scope","SettingMenu","Project","API","Auth","UI",function(e,t,n,r,o,u,a){t.operateStatus={create:{isEnable:!1,url:"/create"},"delete":{isEnable:!1,url:"/delete"},edit:{isEnable:!1,url:"/edit"}},t.askingRemoveID=void 0,u.Check(t.operateStatus,function(){function e(e){a.AlertError(e.data.message)}n(function(e){t.menu=e}),o.Query(r.info,function(e){e.err||(t.projects=angular.isArray(e.result)?e.result:[e.result])}),t.DoRemove=function(n,u,i){n.preventDefault();var c=a.GetAbsoluteIndex(t.currentPage,i);o.Query(r["delete"],{id:u},function(e){t.projects.splice(c,1)},e)},t.AskForRemove=function(e,n){e.preventDefault(),t.askingRemoveID=n},t.CancelRemove=function(e,n){e.preventDefault(),t.askingRemoveID=void 0},t.$watch("currentPage",function(e){return e?void a.PutPageIndex(void 0,t.currentPage):void(t.currentPage=a.GetPageIndex())})})}]);