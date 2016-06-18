EMAPP.register.controller("BillingServicemanage",["$scope","$stateParams","$q","$modal","$cookies","$location","SettingMenu","Account","md5","API","Auth","UI","BillingService","Energycategory","Config",function(e,r,i,t,n,o,l,u,a,c,d,m,v,f,p){d.Check(function(){function n(e,r,i){return{from:e,to:r,price:i}}function l(r){r.SelectMonth=1,r.SelectDay=1,r.HourFrom=0,r.HourTo=23,r.price=0,r.ladfrom=0,r.ladto=0,r.ladprice=0;var i="";if(_.each(r.applyto,function(r){var t=_.find(e.EnergyCategories,function(e){return e._id==r});i+=t.title+","}),i=i.substr(0,i.length-1),r.applytoStr=i,r.timequantumprice?r.billingtype={timequantum:!0}:r.billingtype={fixprice:!0},r.timequantumprice){r.timequantum=[];var t=0,n=r.timequantumprice[t];_.each(r.timequantumprice,function(e,i){if(n!=e){var o={hourFrom:t,hourTo:i,price:n};r.timequantum.push(o),t=i,n=e}});var o={hourFrom:t,hourTo:24,price:n};r.timequantum.push(o)}if(r.ladderprice){r.ladder=[];var l=0;_.map(r.ladderprice,function(e,i){var t={from:l,to:i,price:e};l=i,r.ladder.push(t)})}console.log("Build Service: ",r)}e.askingRemoveID=void 0,e.BillingServiceID=r.id,e.months=[1,2,3,4,5,6,7,8,9,10,11,12],e.days=[];for(var u=1;31>=u;u++)e.days.push(u);e.week=[{index:1,title:"一"},{index:2,title:"二"},{index:3,title:"三"},{index:4,title:"四"},{index:5,title:"五"},{index:6,title:"六"},{index:7,title:"日"}],e.hours=[];for(var u=0;24>=u;u++)e.hours.push(u);i.all([c.QueryPromise(f.info,{}).$promise,c.QueryPromise(v.info,{id:e.BillingServiceID}).$promise]).then(function(r){if(!r[1].err&&!r[0].err){e.EnergyCategories=r[0].result,e.ServiceEnergycategories=[],_.each(r[1].result.energycategory,function(r){var i=_.find(e.EnergyCategories,function(e){return e._id==r});e.ServiceEnergycategories.push(i)}),e.billingService=r[1].result,_.each(e.billingService.rules,function(e,r){l(e)}),console.log(e.billingService),e.billingService.rules?e.MaxLevel=e.billingService.rules.length-1:e.MaxLevel=0;var i="";_.each(e.billingService.rules,function(e,r){var t=function(e){var r="";if(e.week){var i="",t=["一","二","三","四","五","六","日"];_.each(e.week,function(e,r){e&&(i.length&&(i+=","),i+=t[r])}),i.length&&(r+="星期"+i)}if(e.timequantumprice){var n=[],o=0,l=e.timequantumprice[o];_.each(e.timequantumprice,function(e,r){if(l!=e){var i={hourFrom:o,hourTo:r,price:l};n.push(i),o=r,l=e}});var u={hourFrom:o,hourTo:24,price:l};n.push(u);var a="";_.each(n,function(e){a.length&&(a+="; "),a+=e.hourFrom+":00 ~ "+e.hourTo+":00 : ￥"+e.price}),a.length&&(r+=a)}else e.fixprice&&(r+="单价 ￥"+e.fixprice);return r};i+=t(e)}),console.log(i)}}),e.SaveStrategy=function(){var r={id:e.BillingServiceID,rules:[]};_.each(e.billingService.rules,function(e){var i={};i.week=e.week,i.day=e.day,i.applyto=e.applyto,e.timequantum&&e.timequantum.length?(i.timequantumprice=new Array(24),_.each(e.timequantum,function(e){for(var r=e.hourFrom;r<e.hourTo;r++)i.timequantumprice[r]=parseFloat(e.price)})):e.ladder&&!_.isEmpty(e.ladder)?(i.ladderprice={},_.each(e.ladder,function(e){i.ladderprice[e.to]=e.price})):i.fixprice=parseFloat(e.fixprice||0),r.rules.push(i)}),console.log(r),c.Query(v.update,r,function(e){console.log(e),o.path("/admin/billingservice/info"),m.AlertSuccess("保存成功")},function(e){m.AlertError(e.data.message)})},e.AddSubStrategy=function(){var r=t.open({templateUrl:"energySelect.html",controller:"EnergySelect",size:"md",resolve:{ServiceEnergycategories:function(){return e.ServiceEnergycategories}}});r.result.then(function(r){var i={applyto:r};l(i),e.billingService.rules||(e.billingService.rules=[]),e.billingService.rules.push(i)},function(){})},e.Day=new Date,e.dateOptions={formatYear:"yy",startingDay:1},e.SelectRule=void 0,e.disabled=function(e,r){return"year"===r},e.open=function(r,i){r.preventDefault(),r.stopPropagation(),e.SelectRule=i,i.opened=!0,_.each(e.Rules,function(e){e.id!=i.id&&(e.opened=!1)})},e.AddSelectDate=function(e,r){e.preventDefault();var i=r.SelectMonth;i=10>i?"0"+i.toString():i.toString();var t=r.SelectDay;t=10>t?"0"+t.toString():t.toString();var n=i+t;r.day||(r.day=[]),r.day=_.union(r.day,n)},e.RemoveSelectDate=function(e,r,i){e.preventDefault(),r.day=_.without(r.day,i)},e.SelectWeek=function(e,r,i){e.preventDefault(),i.week&&i.week.length||(i.week=[0,0,0,0,0,0,0]),i.week[r]?i.week[r]=0:i.week[r]=r+1},e.AddTimeQuantum=function(e,r){var i=_.range(r.HourFrom,r.HourTo,1);for(var t in r.timequantum){var n=r.timequantum[t],o=_.range(n.hourFrom,n.hourTo,1),l=_.intersection(i,o);if(l.length)return void alert("添加时间段和现有时间段重叠，请检查")}r.timequantum||(r.timequantum=new Array),r.timequantum.push({hourFrom:Number(r.HourFrom),hourTo:Number(r.HourTo),price:Number(r.price)})},e.RemoveTimeQuantum=function(e,r,i){e.preventDefault();var t=_.indexOf(r.timequantum,i);r.timequantum.splice(t,1)},e.AddLadder=function(e,r){if(!r.ladfrom&&!r.ladto)return void alert("请填写阶梯范围");if(r.ladfrom>=r.ladto)return void alert("填写的阶梯范围有误，请检查");if(r.ladder){var i=_.find(r.ladder,function(e){return r.ladfrom>e.from&&r.ladfrom<e.to||r.ladto>e.from&&r.ladto<e.to});if(i)return void alert("添加阶梯价格和现有时间段重叠，请检查")}else r.ladder=[];r.ladder.push(n(r.ladfrom,r.ladto,r.ladprice))},e.RemoveLadder=function(e,r,i){e.preventDefault();var t=_.indexOf(r.ladderprice,i);r.ladderprice.splice(t,1)},e.DoRemove=function(r,i){r.preventDefault(),e.billingService.rules.splice(i,1),e.askingRemoveID=null},e.AskForRemove=function(r,i){r.preventDefault(),e.askingRemoveID=i},e.CancelRemove=function(r,i){r.preventDefault(),e.askingRemoveID=void 0},e.onLevelUp=function(r,i){r.preventDefault();var t=e.billingService.rules[i-1];e.billingService.rules[i-1]=e.billingService.rules[i],e.billingService.rules[i]=t},e.onLevelDown=function(r,i){r.preventDefault();var t=e.billingService.rules[i+1];e.billingService.rules[i+1]=e.billingService.rules[i],e.billingService.rules[i]=t}})}]);