EMAPP.register.controller("appidsecretroleres",["Config","$scope","$stateParams","$q","$modal","$cookies","$location","SettingMenu","Account","AppIDSecret","md5","API","Auth","UI","BillingService","Energycategory","Project","Building",function(e,r,t,o,s,i,n,c,u,d,l,f,U,p,a,v,j,g){var m;U.Check(function(){r.askingRemoveID=null;var e=i.user,c=t.id;void 0!=e&&null!=e&&o.all([f.QueryPromise(u.info,{id:e}).$promise,f.QueryPromise(d.info,{id:c}).$promise]).then(function(e){if(e[0].err||e[1].err);else{if(r.adminUser=e[0].result,r.editUser=e[1].result,!r.editUser)return;r.editUser.resource||(r.editUser.resource={project:[],sensor:[],building:[],customer:[]}),m=r.editUser.resource.project||[],f.Query(j.info,function(e){if(e.err);else{var t=angular.isArray(e.result)?e.result:[e.result];r.roleResOfProject=[];var o=function(e,r){var t=[];return _.each(e,function(e){var o=_.find(r,function(r){return r._id==e});o&&t.push(o)}),t};r.editUser.resource&&r.editUser.resource.project&&(r.viewOfEditUserProject=o(r.editUser.resource.project,t)),r.roleResOfProject=t}})}}),r.SaveRoleRes=function(){var e=_.difference(r.editUser.resource.project,_.intersection(m,r.editUser.resource.project)),t=_.difference(m,_.intersection(r.editUser.resource.project,m));console.log(e,t),r.editUser.resource.project.length?(_.map(r.editUser.resource,function(e,t){_.isEmpty(e)&&(r.editUser.resource[t]="*")}),r.editUser.resource.empty=!1):r.editUser.resource={empty:!0};var o={id:r.editUser._id,resource:r.editUser.resource};console.log(o),f.Query(d.update,o,function(e){e.err||n.path("/admin/appidsecret/info")})},r.AddProject=function(){var e=s.open({templateUrl:"projectSelect.html",controller:"ProjectSelect",size:"md",resolve:{Projects:function(){return r.roleResOfProject},ProjectIDs:function(){return r.editUser.resource&&r.editUser.resource.project||[]}}});e.result.then(function(e){_.isArray(e)?(r.viewOfEditUserProject&&r.viewOfEditUserProject.length?r.viewOfEditUserProject=_.union(r.viewOfEditUserProject,e):r.viewOfEditUserProject=e,r.editUser.resource.project=[],_.each(r.viewOfEditUserProject,function(e){r.editUser.resource.project.push(e._id)})):("*"==e._id&&(r.viewOfEditUserProject=[]),r.editUser.resource.project=r.adminUser.resource.project,r.viewOfEditUserProject=r.roleResOfProject)},function(){})},r.AddBuildings=function(e,t){e.preventDefault();var o=s.open({templateUrl:"buildingSelect.html",controller:"BuildingSelect",size:"md",resolve:{ProjectID:function(){return t},BuildingIDs:function(){return r.editUser.resource&&r.editUser.resource.building||[]}}});o.result.then(function(e){r.editUser.resource.building||(r.editUser.resource.building=[]),r.editUser.resource.building=_.difference(r.editUser.resource.building,e.unselect),r.editUser.resource.building=_.union(r.editUser.resource.building,e.select),console.log(r.editUser.resource.building)},function(){})},r.AddSensors=function(e,t){e.preventDefault();var o=s.open({templateUrl:"sensorSelect.html",controller:"SensorSelect",size:"lg",resolve:{ProjectID:function(){return t},SensorIDs:function(){return r.editUser.resource&&r.editUser.resource.sensor||[]}}});o.result.then(function(e){r.editUser.resource.sensor||(r.editUser.resource.sensor=[]),r.editUser.resource.sensor=_.difference(r.editUser.resource.sensor,e.unselect),r.editUser.resource.sensor=_.union(r.editUser.resource.sensor,e.select),console.log(r.editUser.resource.sensor)},function(){})},r.DoRemove=function(e,t,o){e.preventDefault(),r.editUser.resource.project=_.without(r.editUser.resource.project,t),r.viewOfEditUserProject.splice(o,1),r.editUser.resource.project=_.without(r.editUser.resource.project,t),r.askingRemoveID=null},r.AskForRemove=function(e,t){e.preventDefault(),r.askingRemoveID=t},r.CancelRemove=function(e,t){e.preventDefault(),r.askingRemoveID=void 0}})}]);