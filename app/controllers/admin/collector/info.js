angular.module("app").controller("CollectorIndex",["$scope","$rootScope","SettingMenu","Collector","API","Auth","Project","UI",function(e,t,r,n,o,c,u,i){e.operateStatus={create:{isEnable:!1,url:"/create"},"delete":{isEnable:!1,url:"/delete"},edit:{isEnable:!1,url:"/edit"}},e.currentPage=1,e.askingRemoveID=void 0,c.Check(e.operateStatus,function(){function t(t){o.Query(n.info,{project:t},function(t){t.err||(e.items=t.result)})}function c(e){i.AlertError(e.data.message)}r(function(t){e.menu=t}),e.DoRemove=function(t,r,u){t.preventDefault();var a=i.GetAbsoluteIndex(e.currentPage,u);o.Query(n["delete"],{id:r},function(t){e.items.splice(a,1)},c)},e.AskForRemove=function(t,r){t.preventDefault(),e.askingRemoveID=r},e.CancelRemove=function(t,r){t.preventDefault(),e.askingRemoveID=void 0},o.Query(u.info,function(t){if(t.err);else{e.projects=angular.isArray(t.result)?t.result:[t.result];var r=i.GetPageItem("collector");r?(r=_.find(e.projects,function(e){return e._id==r}),e.projectSelected=r._id):e.projects.length>0&&(e.projectSelected=e.projects[0]._id)}}),e.$watch("projectSelected",function(e){e&&(i.PutPageItem("collector",e),t(e))}),e.$watch("currentPage",function(t){return t?void i.PutPageIndex(void 0,e.currentPage):void(e.currentPage=i.GetPageIndex())})})}]);