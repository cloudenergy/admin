angular.module("app").controller("SensorEdit",["$scope","$stateParams","$location","SettingMenu","Sensor","Collector","Energy","Customer","Building","API","Auth","UI",function(e,n,i,s,o,t,r,l,u,c,a,d){a.Check(function(){function t(e,n,i){if(n){var s=[];return _.each(n,function(n){n.childrens?n.ischild=!1:n.ischild=!0,n.parent=e,n.level=i,n.nodes=t(n,n.childrens,i+1),s.push(n)}),s.sort(function(e,n){return e.title>n.title?1:-1}),s}}s(function(n){e.menu=n});var l,a=n.page;e.submit=function(n){var s=angular.copy(e.sensor);s.project=e.sensor.building.project._id,s.building=e.sensor.building._id,l?(s.energy=c.RootEnergycategory(l.id),s.energyPath=l.id):(s.energy="",s.energyPath="");var t=s.building,r=function(){console.log(s),c.Query(o.update,s,function(e){e.err||(a?i.path("/admin/sensor/info").search({page:a,building:t}):i.path("/admin/sensor/info").search({building:t}))})},u=[],d=function(e){e&&e.nodes&&_.each(e.nodes,function(e){e.isSelect&&u.push(e.id),d(e)})};d(e.viewOfCustomer&&e.viewOfCustomer[0]||null),s.socity=u,e.sid!=s.sid?c.Query(o.info,{sids:[s.sid]},function(e){return console.log(e),e.result&&e.result.length>0?void alert("传感器标识已经存在"):void r()},function(e){console.log(e)}):r()},c.Query(o.channelinfo,{id:n.id},function(n){n.err||(e.sensor=n.result[0],console.log(e.sensor),e.sid=e.sensor.sid,e.building=e.sensor.building,c.Query(u.info,{id:e.sensor.building.id},function(n){n.err||c.Query(r.info,{project:e.building.project},function(n){if(n.err);else{var i=n.result;if(e.sensor.energyPath){var s,o=e.sensor.energyPath.split("|"),r=i.energy;_.each(o,function(e){r&&(s?s+="|"+e:s=e,r=r[s],r&&(r&&!r.childrens?(r.isSelect=!0,l=r):r=r.childrens))})}if(i){var u=t(null,i.energy,1);e.viewOfEnergy=[{nodes:u,title:"能耗分类",level:0}]}else e.viewOfEnergy=[{nodes:[],title:"能耗分类",level:0}]}})}))}),e.onChoice=function(e){e.isSelect=!e.isSelect;var n=function(e,i){e&&e.nodes&&e.nodes.length&&(_.each(e.nodes,function(e){n(e,i),e.isSelect=i}),e.isSelect=i)};n(e,e.isSelect)},e.onEnergyChoice=function(e){e.nodes||(console.log(e),l&&(l.isSelect=!1),l=e,l.isSelect=!0)},e.OnCollapsePayStatus=function(){e.sensor.paystatus&&"NONE"!=e.sensor.paystatus?e.sensor.paystatus="NONE":e.sensor.paystatus="BYSELF"},e.OnSelectPayMode=function(n,i){n.preventDefault(),e.sensor.paystatus=i}})}]);