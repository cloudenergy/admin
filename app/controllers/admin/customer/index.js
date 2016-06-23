EMAPP.register.controller("CustomerIndex",["$scope","$q","$api","$uibModal","Auth","UI",function(e,t,n,i,o,r){var c=EMAPP.Account._id+"_customer_index_projectid";o.Check(function(){function o(e,t,n){var i=[];return t&&(angular.forEach(t,function(t){t.originid=t.id,t.origintitle=t.title,t.id=t.id,t.title=t.title,t.acreage=t.acreage||0,t.level=n,t.nodes=o(t,t.child,n+1),t.parent=e,i.push(t)}),i.sort(function(e,t){return e.index>t.index?1:-1})),i}function l(){n.customer.info({project:e.projects.selected},function(t){t.result?e.viewOfCustomer=[{level:0,type:"NODE",title:"社会属性",nodes:o(null,t.result,1)}]:e.viewOfCustomer=[{level:0,type:"NODE",title:"社会属性",nodes:[]}]},function(e){r.AlertError(e.data.message)})}n.project.info(function(t){t.selected=localStorage.getItem(c),e.projects=angular.isArray(t.result)?t.result:t.result&&[t.result]||[],e.projects.select=function(){e.projects.selected&&(localStorage.setItem(c,e.projects.selected),l())},angular.forEach(e.projects,function(n){n._id===t.selected&&(e.projects.selected=n._id)}),e.projects.selected=e.projects.selected||(e.projects[0]||{})._id,e.projects.select()}),e.newNode=function(e){e.nodes.push({enable:!0,editing:!0,title:"",origintitle:"",acreage:0,level:e.level+1,type:"NODE",parent:e,nodes:[]})},e.saveNode=function(t){return t.title?(delete t.editing,t.origintitle=t.originid?t.origintitle:t.title,void n.customer.update({node:{id:t.id||void 0,title:t.title,type:t.id?t.type:"NODE",parent:t.parent.id},method:t.id?"UPDATE":"ADD",project:e.projects.selected},function(e){r.AlertSuccess(t.id?"更新成功":"添加成功"),t.id||(t.id=t.originid=e.result.id,t.origintitle=t.title)})):(r.AlertWarning("请输入名称"),!1)},e.editNode=function(e){e.origintitle=e.title,e.editing=!0},e.cancelEdit=function(e){e.id?e.title=e.origintitle:angular.forEach(e.parent.nodes,function(t){t.$$hashKey!==e.$$hashKey&&this.push(t)},e.parent.nodes=[]),delete e.editing},e.deleteNode=function(t,i){n.customer.update({node:{id:t.id},method:"REMOVE",project:e.projects.selected},function(e){r.AlertSuccess("删除成功"),i.remove()})},e.sensor=function(o){i.open({templateUrl:"sensorSelect.html",controller:"SensorSelect",resolve:{ProjectID:function(){return e.projects.selected},SelectKEY:function(){return function e(t,n){return angular.forEach(t,function(t){"DEV"===t.type?n[t.key]=1:e(t.nodes,n)}),n}(o.nodes,{})}}}).result.then(function(i){var r=[],c={};!function l(t){angular.forEach(t,function(t){"DEV"===t.type?0===i[t.key]&&r.push(n.customer.update({node:{id:t.id},method:"REMOVE",project:e.projects.selected},function(){c[t.id]=!0}).$promise):l(t.nodes)})}(o.nodes),angular.forEach(i,function(t,i){t&&angular.isString(t)&&r.push(n.customer.update({node:{type:"DEV",title:t,key:i,parent:o.id},method:"ADD",project:e.projects.selected},function(e){o.nodes.push({originid:e.result.id,origintitle:e.result.title,id:e.result.id,title:e.result.title,acreage:0,level:o.level+1,type:"DEV",key:e.result.key,parent:o,nodes:[]})}).$promise)}),t.all(r).then(function(){!function e(t){angular.forEach(t.nodes,function(t){!c[t.id]&&this.push(t),t.nodes.length&&e(t)},t.nodes=[])}(o)})})}})}]);