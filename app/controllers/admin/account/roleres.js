EMAPP.register.controller("accountroleres",["$scope","$stateParams","$q","$modal","$cookies","$location","SettingMenu","Account","API","Auth","UI","Project","Building",function(e,r,t,o,s,i,n,c,u,d,l,f,U){var a;d.Check(function(){n(function(r){e.menu=r}),e.askingRemoveID=null;var d=s.user,l=r.id;void 0!=d&&null!=d&&t.all([u.QueryPromise(c.info,{id:d}).$promise,u.QueryPromise(c.info,{id:l}).$promise]).then(function(r){if(r[0].err||r[1].err);else{if(e.adminUser=r[0].result,e.editUser=r[1].result,!e.editUser)return;e.editUser.resource||(e.editUser.resource={project:[],sensor:[],building:[],customer:[]}),a=e.editUser.resource.project||[],u.Query(f.info,function(r){if(r.err);else{var t=angular.isArray(r.result)?r.result:[r.result];e.roleResOfProject=[];var o=function(e,r){var t=[];return _.each(e,function(e){var o=_.find(r,function(r){return r._id==e});o&&t.push(o)}),t};e.editUser.resource&&e.editUser.resource.project&&(e.viewOfEditUserProject=o(e.editUser.resource.project,t)),e.roleResOfProject=t}})}}),e.SaveRoleRes=function(){var r=_.difference(e.editUser.resource.project,_.intersection(a,e.editUser.resource.project)),t=_.difference(a,_.intersection(e.editUser.resource.project,a));console.log(r,t),e.editUser.resource.project.length?(_.map(e.editUser.resource,function(r,t){_.isEmpty(r)&&(e.editUser.resource[t]="*")}),e.editUser.resource.empty=!1):e.editUser.resource={empty:!0};var o={id:e.editUser._id,resource:e.editUser.resource};console.log(o),u.Query(c.update,o,function(e){e.err||i.path("/admin/account/info")})},e.AddProject=function(){var r=o.open({templateUrl:"projectSelect.html",controller:"ProjectSelect",size:"md",resolve:{Projects:function(){return e.roleResOfProject},ProjectIDs:function(){return e.editUser.resource&&e.editUser.resource.project||[]}}});r.result.then(function(r){_.isArray(r)?(e.viewOfEditUserProject&&e.viewOfEditUserProject.length?e.viewOfEditUserProject=_.union(e.viewOfEditUserProject,r):e.viewOfEditUserProject=r,e.editUser.resource.project=[],_.each(e.viewOfEditUserProject,function(r){e.editUser.resource.project.push(r._id)})):("*"==r._id&&(e.viewOfEditUserProject=[]),e.editUser.resource.project=e.adminUser.resource.project,e.viewOfEditUserProject=e.roleResOfProject)},function(){})},e.AddBuildings=function(r,t){r.preventDefault();var s=o.open({templateUrl:"buildingSelect.html",controller:"BuildingSelect",size:"md",resolve:{ProjectID:function(){return t},BuildingIDs:function(){return e.editUser.resource&&e.editUser.resource.building||[]}}});s.result.then(function(r){if("*"==r.select){var o=[];_.each(e.editUser.resource.building,function(e){-1==e.indexOf(t)&&o.push(e)}),e.editUser.resource.building=o}else e.editUser.resource.building=_.difference(e.editUser.resource.building,r.unselect),e.editUser.resource.building=_.union(e.editUser.resource.building,r.select);console.log(e.editUser.resource.building)},function(){})},e.AddSensors=function(r,t){r.preventDefault();var s=o.open({templateUrl:"sensorSelect.html",controller:"SensorSelect",size:"lg",resolve:{ProjectID:function(){return t},SensorIDs:function(){return e.editUser.resource&&e.editUser.resource.sensor||[]}}});s.result.then(function(r){if("*"==r.select){var o=[];_.each(e.editUser.resource.sensor,function(e){-1==e.indexOf(t)&&o.push(e)}),e.editUser.resource.sensor=o}else e.editUser.resource.sensor=_.difference(e.editUser.resource.sensor,r.unselect),e.editUser.resource.sensor=_.union(e.editUser.resource.sensor,r.select);console.log(e.editUser.resource.sensor)},function(){})},e.DoRemove=function(r,t,o){r.preventDefault(),e.editUser.resource.project=_.without(e.editUser.resource.project,t),e.viewOfEditUserProject.splice(o,1),e.editUser.resource.project=_.without(e.editUser.resource.project,t),e.askingRemoveID=null},e.AskForRemove=function(r,t){r.preventDefault(),e.askingRemoveID=t},e.CancelRemove=function(r,t){r.preventDefault(),e.askingRemoveID=void 0}})}]);