EMAPP.register.controller("ChannelSelect",["$scope","$rootScope","$uibModalInstance","API","Sensor","ProjectID","SelectedSensors",function(e,n,i,s,o,r,t){var c;e.currentPage=1,e.project=r,e.Ok=function(){var n=[],s=!0;e.viewOfSensors[0].isEnable?n=[e.viewOfSensors[0]]:(_.each(e.viewOfSensors,function(e){e.isEnable&&(s=!1,n.push(e))}),s&&e.Cancel()),i.close(n)},e.Cancel=function(){i.dismiss("cancel")},e.SwitchSensor=function(n,i){if(n.preventDefault(),"*"==i._id)i.isEnable=!i.isEnable,_.each(e.viewOfSensors,function(e){e.isEnable=i.isEnable}),t=[];else{var s=_.find(t,function(e){return e._id==i._id});s?t=_.without(t,s):t.push(i),e.viewOfSensors[0].isEnable=!1,i.isEnable=!i.isEnable}},e.onSearchSensor=function(n){n.preventDefault(),e.UpdateViewOfSensors(e.sensorSearchKey)},e.OnSelectAll=function(i){i.preventDefault();for(var s=(e.currentPage-1)*n.popPageSize,o=e.currentPage*n.popPageSize,r=s;o>r;r++)e.viewOfSensors[r].isEnable=!0},e.UpdateViewOfSensors=function(n){e.viewOfSensors=[{_id:"*",title:"所有传感器",isEnable:!!t.indexOf("*")}],n?_.each(c,function(i){i.title.match(n)?e.viewOfSensors.push(i):i.channel&&i.channel.match(n)&&e.viewOfSensors.push(i)}):e.viewOfSensors=_.union(e.viewOfSensors,c),_.each(e.viewOfSensors,function(e){e.isEnable=_.find(t,function(n){return _.isObject(n)?n._id==e._id:n==r+"."+e._id})})},s.Query(o.channelinfo,{project:r},function(n){n.err||(c=n.result,e.UpdateViewOfSensors())}.bind(this))}]);