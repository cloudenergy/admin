angular.module("app").controller("characterManage",["$scope","$stateParams","$location","SettingMenu","UrlPath","$cookies","Account","$q","Project","Building","Customer","Collector","Sensor","Auth","API","UI","Character",function(e,n,o,r,t,c,a,i,l,u,s,d,f,h,v,g,p){var A={},m=n.id;h.Check(function(){function n(){var n=i.defer(),o=function(e){var n=function(e,o){_.map(e,function(e,r){e.leaf?A[o+"/"+r]=!0:n(e,"/"==r?"":o+"/"+r)})};n(e,"")};return m?v.Query(p.info,{id:m},function(r){r.err?n.reject(r.err):(e.character=r.result,o(r.result.rule),n.resolve())}):n.resolve(),n.promise}e.OnSave=function(n){function r(e,n){"/"!=e._id&&(n+=e._id),e.select&&t.push(n),void 0!=e.nodes&&e.nodes.length>0&&_.each(e.nodes,function(e){r(e,n+"/")})}n.preventDefault();var t=new Array;r(e.urlpath[0],""),console.log(t);var c={};_.each(t,function(e){var n=e.split("/"),o=c;_.each(n,function(e,r){""==e&&(e="/");var t=!1;r==n.length-1&&(t=!0),o[e]||(o[e]={}),o[e].leaf=t,o=o[e]})}),console.log(c),e.character.rule=c;var a=function(){o.path("/admin/character/info")};m?v.Query(p.update,e.character,function(e){return e.code?void g.AlertError(e.message):void a()}):v.Query(p.add,e.character,function(e){return console.log(e),e.code?void g.AlertError(e.message):void a()})},n().then(function(){v.Query(t.info,{},function(n){if(n.err);else{var o={_id:"/",nodes:new Array};_.each(n.result,function(e){var n=e._id.split("/"),r=o;_.each(n,function(o,t){if(""!=o){var c=n.length==t+1,a=_.find(r.nodes,function(e){return e._id==o});void 0==a&&(c?(a={_id:o,url:e,desc:e.desc||"",enable:e.enable,select:!1,nodes:new Array},a.select=!!A[e._id]):a={_id:o,desc:e.desc||"",select:!1,nodes:new Array},r.nodes.push(a)),r=a}})}),console.log(o),e.urlpath=[o]}})}),e.enable=function(e){e.select=!e.select},e.toggle=function(e){console.log(e),e.toggle()},e.EnableSubNode=function(e,n){console.log(e);var o=function(e){e&&_.each(e.nodes,function(e){return e.select=n,o(e)})};o(e)}})}]);