angular.module("app").controller("SensorSelect",["$scope","$rootScope","$modalInstance","API","Sensor","ProjectID","Config","EnergycategoryID",function(e,n,o,r,a,i,s,c){var t;e.currentPage=1,e.Ok=function(){var n=r.RootEnergycategory(c),i=!0;_.each(e.viewOfSensors,function(e){if(e.originEnable!=e.isEnable)if(e.isEnable&&e.energyPath!=c){i=!1;var s={_id:e._id,energy:n,energyPath:c};console.log("Add: ",s),r.Query(a.update,s,function(e){e.err||o.close({})})}else{var s={_id:e._id,energy:"",energyPath:""};console.log("Clear: ",s),r.Query(a.update,s,function(e){e.err||o.close({})})}}),i&&o.close({})},e.Cancel=function(){o.dismiss("cancel")},e.SwitchSensor=function(e,n){e.preventDefault(),n.isEnable?n.isEnable=!1:n.isEnable=!0},e.onSearchSensor=function(n){n.preventDefault(),e.UpdateViewOfSensors(e.sensorSearchKey)},e.OnSelectAll=function(o){o.preventDefault(),console.log(e.currentPage,n.popPageSize);for(var r=(e.currentPage-1)*n.popPageSize,a=e.currentPage*n.popPageSize,i=r;a>i;i++)e.viewOfSensors[i].isEnable=!0},e.UpdateViewOfSensors=function(n){e.viewOfSensors=[],n?_.each(t,function(o){o.title.match(n)?e.viewOfSensors.push(o):o.channel&&o.channel.match(n)&&e.viewOfSensors.push(o)}):e.viewOfSensors=t,_.each(e.viewOfSensors,function(e){e.originEnable=e.energyPath==c,e.isEnable=e.originEnable})},r.Query(a.channelinfo,{project:i},function(n){console.log(n),n.err||(t=n.result,e.UpdateViewOfSensors())})}]);