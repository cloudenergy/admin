angular.module("app").controller("departmentedit",["$scope","$location","$stateParams","$uibModal","$api","SettingMenu","Department","Auth","API","Sensor","UI","md5",function(e,t,n,r,o,c,a,u,s,l,m,p){u.Check(function(){e.submit=function(n){if(e.department.password!=e.repassword)return void swal("错误","两次输入的密码不一致","warning");var r=e.department.project;e.department.resource={project:[r],sensor:[]},_.each(e.SelectSensors,function(t){e.department.resource.sensor.push(r+"."+t._id)}),e.department.message=Object.keys(e.warning).filter(function(t){return e.warning[t]?t:""}).join(","),e.department.onduty=e.onDutyHour+":"+e.onDutyMinute,e.department.offduty=e.offDutyHour+":"+e.offDutyMinute,e.department.password&&(e.department.password=p.createHash(e.department.password).toUpperCase()),s.Query(a.update,e.department,function(e){e.code?m.AlertError(e.message):(m.AlertSuccess("更新成功"),t.path("/admin/department/info"))})},e.OnSelectAccount=function(t){t.preventDefault();var n=r.open({templateUrl:"accountSelect.html",controller:"AccountSelect",size:"lg",resolve:{SelectedAccounts:function(){return e.SelectAccounts||e.department.account}}});n.result.then(function(t){console.log(t),e.SelectAccounts=t,e.departmentAccount=t._id},function(){})},e.OnSelectSensor=function(t){t.preventDefault();var n=r.open({templateUrl:"channelSelect.html",controller:"ChannelSelect",size:"lg",resolve:{ProjectID:function(){return e.department.project},SelectedSensors:function(){return e.SelectSensors||[]}}});n.result.then(function(t){console.log(t),e.SelectSensors=t},function(){})},o.department.info({id:n.id},function(t){if(e.department=t.result||{},e.departmentAccount=t.result.account._id||t.result.account,e.SelectSensors=e.department.resource&&e.department.resource.sensor||[],e.account=t.result.account,e.department.account=e.account._id,e.warning={},"object"==typeof e.account){e.department.mobile=e.account.mobile,e.department.email=e.account.email;var n=e.account.message?String.prototype.split.call(e.account.message||"",","):[];angular.forEach(n,function(t,n){e.warning[t]=!0})}var r=moment(e.department.onduty,"H:mm");e.onDutyHour=r.format("H"),e.onDutyMinute=r.format("mm");var o=moment(e.department.offduty,"H:mm");if(e.offDutyHour=o.format("H"),e.offDutyMinute=o.format("mm"),e.department.resource&&e.department.resource.sensor){var c=[];_.each(e.department.resource.sensor,function(e){c.push(e.replace(/.+\./g,""))}),s.Query(l.channelinfo,{ids:c},function(t){t.err||(e.SelectSensors=t.result)})}}),e.OnSelectCharacter=function(t,n){t.preventDefault(),e.department.character=n}})}]);