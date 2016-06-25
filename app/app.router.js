angular.module("app").config(["$locationProvider","$stateProvider","$urlRouterProvider",function(e,t,a){e.html5Mode(!0),a.otherwise("/admin/dashboard"),t.state("home",{url:"/",controller:["$state","$cookies",function(e,t){t.token?e.go("login"):e.go("admin.dashboard")}]}).state("login",{url:"/admin/login",templateUrl:"templates/login.html?rev=686c58d34b",controller:"session",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["vendor/sweetalert/dist/sweetalert.css"]},{serie:!0,files:["vendor/angular-md5/angular-md5.min.js?rev=cf3572fb49","vendor/angular-resource/angular-resource.min.js?rev=0023c4aefd","vendor/sweetalert/dist/sweetalert.min.js?rev=0068f44b0a","app/services/user.js?rev=7c4a70b151","app/services/ui.js?rev=27f1e40289","app/controllers/session.js?rev=72fc087c7a"]}])}]},data:{appClasses:"bg-white usersession"}}).state("logout",{url:"/admin/logout",controller:["$cookies","$state","$api",function(e,t,a){a.auth.logout({cookie:e.getAll(),redirect:"/"},function(){angular.forEach(["token","user"],function(t){e.remove(t,{path:"/",domain:""}),e.remove(t,{path:"/",domain:".cloudenergy.me"}),e.remove(t,{path:"/",domain:"admin.cloudenergy.me"}),e.remove(t,{path:"/",domain:".admin.cloudenergy.me"})}),t.go("login")})}]}).state("admin",{"abstract":!0,templateUrl:"templates/common/layout.html?rev=817dbd1404",url:"/admin",controller:"admin",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["vendor/chosen/chosen.css","vendor/sweetalert/dist/sweetalert.css","vendor/angular-ui-select/dist/select.min.css?rev=02023d7a76"]},{serie:!0,files:["vendor/moment/min/moment.min.js?rev=677846fe11","vendor/moment/locale/zh-cn.js"]},{files:["vendor/angular-md5/angular-md5.min.js?rev=cf3572fb49","vendor/chosen/chosen.jquery.js","vendor/sweetalert/dist/sweetalert.min.js?rev=0068f44b0a","vendor/angular-ui-select/dist/select.min.js?rev=9e2d3dfcd7","app/directives/chosen.js?rev=49e88eb334","app/directives/perfect-scrollbar.js?rev=b83482d6c4","app/filters/filters.js?rev=818a275ce9","app/services/ui.js?rev=27f1e40289","app/services/user.js?rev=7c4a70b151","app/services/api.js?rev=a51a0c9d28","app/services/authentication.js?rev=fd22270cf8","app/services/account.js?rev=0860d6447d","app/services/setting-menu.js?rev=e466d4f413","app/controllers/admin.js?rev=13eb2c5921"]}])}]}}).state("admin.dashboard",{url:"/dashboard",templateUrl:"templates/dash.html?rev=b36a3f6344",data:{title:"技术支持: 0571-85374789"}}).state("admin.character",{template:"<div ui-view></div>","abstract":!0,url:"/character",data:{redirect:"admin.character.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load("app/services/character.js?rev=75a8817883")}]}}).state("admin.character.info",{url:"/info",data:{title:"角色管理"},controller:"characterInfo",templateUrl:"templates/admin/character/info.html?rev=bd75833058",resolve:{deps:["$ocLazyLoad",function(e){return e.load("app/controllers/admin/character/info.js?rev=37498bd0df")}]}}).state("admin.character.manage",{url:"/manage/:id",data:{title:"角色编辑"},controller:"characterManage",templateUrl:"templates/admin/character/manage.html?rev=e32729cf6b",resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.css?rev=38dfd21969"]},{files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.js?rev=f06a7b88d7","app/controllers/admin/character/manage.js?rev=6d689e2559","app/services/urlpath.js?rev=743c888d55","app/services/project.js?rev=09fa316e9b","app/services/building.js?rev=9df06e6819","app/services/customer.js?rev=77f662bd55","app/services/collector.js?rev=08ae10cf80","app/services/sensor.js?rev=c072ceb580"]}])}]}}).state("admin.project",{template:"<div ui-view></div>","abstract":!0,url:"/project",data:{redirect:"admin.project.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load("app/services/project.js?rev=09fa316e9b")}]}}).state("admin.project.info",{url:"/info",data:{title:"项目管理"},controller:"projectInfo",templateUrl:"templates/admin/project/info.html?rev=7e2e129b33",resolve:{deps:["$ocLazyLoad",function(e){return e.load("app/controllers/admin/project/info.js?rev=d16fa58353")}]}}).state("admin.project.create",{url:"/create",templateUrl:"templates/admin/project/create.html?rev=b0100464da",data:{title:"创建项目"},controller:"projectCreate",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/energycategory.js?rev=0da30293f9","app/controllers/admin/project/create.js?rev=0933aa39d6"])}]}}).state("admin.project.edit",{url:"/edit/:id",templateUrl:"templates/admin/project/edit.html?rev=1d0414f8bd",data:{title:"编辑项目"},controller:"projectEdit",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/project/edit.js?rev=774630b6c6"])}]}}).state("admin.appidsecret",{template:"<div ui-view></div>","abstract":!0,url:"/appidsecret",data:{redirect:"admin.appidsecret.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load("app/services/appidsecret.js?rev=f0bd0aabf5")}]}}).state("admin.appidsecret.info",{url:"/info",templateUrl:"templates/admin/appidsecret/info.html?rev=21a274c0dc",data:{title:"管理AppID"},controller:"appidsecretInfo",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/appidsecret/info.js?rev=df66d48f83"])}]}}).state("admin.appidsecret.create",{url:"/create",templateUrl:"templates/admin/appidsecret/create.html?rev=c26a64c272",data:{title:"创建AppID"},controller:"appidsecretcreate",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/character.js?rev=75a8817883","app/services/billingaccount.js?rev=26c9fd0b19","app/controllers/admin/appidsecret/create.js?rev=ac1b4920d0"])}]}}).state("admin.appidsecret.edit",{url:"/edit/:id",templateUrl:"templates/admin/appidsecret/edit.html?rev=b6efb2c5e2",data:{title:"编辑AppID"},controller:"appidsecretedit",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["vendor/angular-md5/angular-md5.min.js?rev=cf3572fb49","app/services/character.js?rev=75a8817883","app/controllers/admin/appidsecret/edit.js?rev=fa7fef75ff"])}]}}).state("admin.appidsecret.roleres",{url:"/roleres/:id",templateUrl:"templates/admin/appidsecret/roleres.html?rev=f67769af22",data:{title:"AppID权限"},controller:"appidsecretroleres",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["vendor/angular-md5/angular-md5.min.js?rev=cf3572fb49","app/services/character.js?rev=75a8817883","app/services/project.js?rev=09fa316e9b","app/services/building.js?rev=9df06e6819","app/services/sensor.js?rev=c072ceb580","app/services/billingservice.js?rev=6c67a9dfbf","app/services/energycategory.js?rev=0da30293f9","app/controllers/admin/appidsecret/buildingSelect.js?rev=a06d30e096","app/controllers/admin/appidsecret/projectSelect.js?rev=4ba4a853c6","app/controllers/admin/appidsecret/sensorSelect.js?rev=9c120fd3b9","app/controllers/admin/appidsecret/roleres.js?rev=847d4a2aa6"])}]}}).state("admin.account",{template:"<div ui-view></div>","abstract":!0,url:"/account",data:{redirect:"admin.account.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/account.js?rev=0860d6447d","app/services/billingaccount.js?rev=26c9fd0b19","vendor/angular-md5/angular-md5.min.js?rev=cf3572fb49","app/services/character.js?rev=75a8817883"])}]}}).state("admin.account.info",{url:"/info",controller:"accountInfo",templateUrl:"templates/admin/account/info.html?rev=4e1af174ca",data:{title:"账户管理"},resolve:{deps:["$ocLazyLoad",function(e){return e.load("app/controllers/admin/account/info.js?rev=25b9ad2be5")}]}}).state("admin.account.create",{url:"/create",controller:"accountCreate",templateUrl:"templates/admin/account/create.html?rev=59ea41a92a",data:{title:"新建账户"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/account/create.js?rev=0068189ae4"])}]}}).state("admin.account.edit",{url:"/edit/:id",controller:"accountEdit",templateUrl:"templates/admin/account/edit.html?rev=03d93e8c9e",data:{title:"编辑账户"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/account/edit.js?rev=378d82aef3"])}]}}).state("admin.account.roleres",{url:"/roleres/:id",controller:"accountroleres",templateUrl:"templates/admin/account/roleres.html?rev=3f63df09d4",data:{title:"账户权限"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/billingservice.js?rev=6c67a9dfbf","app/services/energycategory.js?rev=0da30293f9","app/services/project.js?rev=09fa316e9b","app/services/building.js?rev=9df06e6819","app/services/sensor.js?rev=c072ceb580","app/controllers/admin/account/buildingSelect.js?rev=1e936df90f","app/controllers/admin/account/projectSelect.js?rev=a99f1d0d52","app/controllers/admin/account/sensorSelect.js?rev=02ee382975","app/controllers/admin/account/roleres.js?rev=03a05cd330"])}]}}).state("admin.account.amount",{url:"/amount/:account/:redirect/:project",controller:"accountamount",templateUrl:"templates/admin/account/amount.html?rev=9a9a786462",data:{title:"账户金额"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/log.js?rev=687525b82e","app/services/payment.js?rev=3d2a00d515","app/controllers/admin/account/amount.js?rev=a279f7f87d"])}],channels:["$api","$q","$stateParams",function(e,t,a){var r=t.defer();return e.payment.channelinfo({type:"manual",project:a.project,flow:"EARNING"},function(e){return r.resolve(e)}),r.promise}]}}).state("admin.billingservice",{template:"<div ui-view></div>","abstract":!0,url:"/billingservice",data:{redirect:"admin.billingservice.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/project.js?rev=09fa316e9b","app/services/pab.js?rev=fd6d74fab8","app/services/device.js?rev=bc2a1dc916","app/services/billingservice.js?rev=6c67a9dfbf","app/services/energycategory.js?rev=0da30293f9"])}]}}).state("admin.billingservice.info",{url:"/info",templateUrl:"templates/admin/billingservice/info.html?rev=0c1166ab61",data:{title:"计费策略"},controller:"BillingServiceInfo",resolve:{deps:["$ocLazyLoad",function(e){return e.load("app/controllers/admin/billingservice/info.js?rev=f926530663")}]}}).state("admin.billingservice.manage",{url:"/manage/:id",templateUrl:"templates/admin/billingservice/manage.html?rev=ed212aa795",data:{title:"管理策略"},controller:"BillingServicemanage",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/billingservice/energySelect.js?rev=671dcf0e9e","app/controllers/admin/billingservice/manage.js?rev=5a94ec1fe9","vendor/angular-md5/angular-md5.min.js?rev=cf3572fb49"])}]}}).state("admin.billingservice.add",{url:"/add/:project",templateUrl:"templates/admin/billingservice/add.html?rev=0ae629d065",data:{title:"添加策略"},controller:"BillingServiceadd",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/billingaccount.js?rev=26c9fd0b19","app/controllers/admin/billingservice/energySelect.js?rev=671dcf0e9e","app/controllers/admin/billingservice/add.js?rev=4adb25637b","vendor/angular-md5/angular-md5.min.js?rev=cf3572fb49"])}]}}).state("admin.urlpath",{template:"<div ui-view></div>","abstract":!0,url:"/urlpath",data:{redirect:"admin.urlpath.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/urlpath.js?rev=743c888d55"])}]}}).state("admin.urlpath.info",{url:"/info",controller:"urlpathInfo",templateUrl:"templates/admin/urlpath/index.html?rev=531adafb03",data:{title:"地址管理"},resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.css?rev=38dfd21969"]},{files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.js?rev=f06a7b88d7","app/controllers/admin/urlpath/index.js?rev=84f3634664"]}])}]}}).state("admin.building",{template:"<div ui-view></div>","abstract":!0,url:"/building",data:{redirect:"admin.building.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/project.js?rev=09fa316e9b","app/services/building.js?rev=9df06e6819"])}]}}).state("admin.building.info",{url:"/info",templateUrl:"templates/admin/building/info.html?rev=df2d798837",data:{title:"建筑管理"},controller:"BuildingInfo",resolve:{deps:["$ocLazyLoad",function(e){return e.load("app/controllers/admin/building/info.js?rev=a4748fbaa3")}]}}).state("admin.building.edit",{url:"/edit/:id",templateUrl:"templates/admin/building/edit.html?rev=00084d2aea",data:{title:"建筑编辑"},controller:"Buildingedit",resolve:{deps:["$ocLazyLoad",function(e){return e.load("app/controllers/admin/building/edit.js?rev=56827c8433")}]}}).state("admin.building.create",{url:"/create/:project",templateUrl:"templates/admin/building/create.html?rev=fded9b386a",data:{title:"建筑编辑"},controller:"Buildingcreate",resolve:{deps:["$ocLazyLoad",function(e){return e.load("app/controllers/admin/building/create.js?rev=2a2ced5601")}]}}).state("admin.department",{templateUrl:"templates/admin/department/base.html?rev=b72ea2a3b5","abstract":!0,url:"/department",data:{redirect:"admin.department.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/project.js?rev=09fa316e9b","app/services/billingaccount.js?rev=26c9fd0b19","app/services/export.js?rev=f5d9163836","app/services/department.js?rev=8941d51caf"])}]}}).state("admin.department.info",{url:"/info",templateUrl:"templates/admin/department/info.html?rev=122c52f9f1",data:{title:"户管理"},controller:"departmentInfo",resolve:{deps:["$ocLazyLoad",function(e){return e.load([{name:"ngUpload",files:["vendor/ngUpload/ng-upload.min.js?rev=485bf9e38a"]}]).then(function(){return e.load(["app/services/sensor.js?rev=c072ceb580","app/controllers/admin/department/info.js?rev=665c83ef90"])})}]}}).state("admin.department.create",{url:"/create/:project",templateUrl:"templates/admin/department/create.html?rev=d185e4ec4f",data:{title:"添加户"},controller:"departmentcreate",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/sensor.js?rev=c072ceb580","app/controllers/admin/common/accountSelect.js?rev=784a7f2636","app/controllers/admin/common/channelSelect.js?rev=297c7ad0ec","app/controllers/admin/department/create.js?rev=18db41f088"])}]}}).state("admin.department.edit",{url:"/edit/:id",templateUrl:"templates/admin/department/edit.html?rev=e08cc6d206",data:{title:"编辑商户"},controller:"departmentedit",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/sensor.js?rev=c072ceb580","app/controllers/admin/common/accountSelect.js?rev=784a7f2636","app/controllers/admin/common/channelSelect.js?rev=297c7ad0ec","app/controllers/admin/department/edit.js?rev=6b1cf28159"])}]}}).state("admin.customer",{template:"<div ui-view></div>","abstract":!0,url:"/customer",data:{redirect:"admin.customer.index"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/project.js?rev=09fa316e9b","app/services/energy.js?rev=bdf6e9b523","app/services/customer.js?rev=77f662bd55","app/services/sensor.js?rev=c072ceb580"])}]}}).state("admin.customer.index",{url:"/index",templateUrl:"templates/admin/customer/index.html?rev=1feb9a40d3",data:{title:"社会属性"},controller:"CustomerIndex",resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.css?rev=38dfd21969"]},{files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.js?rev=f06a7b88d7","app/controllers/admin/customer/sensorSelect.js?rev=0256d157b8","app/controllers/admin/customer/index.js?rev=eafcad1440"]}])}]}}).state("admin.driver",{template:"<div ui-view></div>","abstract":!0,url:"/driver",data:{redirect:"admin.driver.index"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/energy.js?rev=bdf6e9b523","app/services/project.js?rev=09fa316e9b","app/services/customer.js?rev=77f662bd55","app/services/driver.js?rev=28792de55e","app/services/sensor.js?rev=c072ceb580"])}]}}).state("admin.driver.index",{url:"/index",templateUrl:"templates/admin/driver/index.html?rev=1a4049ec01",data:{title:"驱动设置"},controller:"DriverIndex",resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.css?rev=38dfd21969"]},{files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.js?rev=f06a7b88d7","vendor/angular-utf8-base64/angular-utf8-base64.min.js?rev=76dd170bc4","app/services/sensorAttrib.js?rev=0c5a510b91","app/controllers/admin/driver/sensorSelect.js?rev=4074516668","app/controllers/admin/driver/index.js?rev=5ea9715392"]}])}]}}).state("admin.collector",{template:"<div ui-view></div>","abstract":!0,url:"/collector",data:{redirect:"admin.collector.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/project.js?rev=09fa316e9b","app/services/collector.js?rev=08ae10cf80"])}]}}).state("admin.collector.info",{url:"/info",templateUrl:"templates/admin/collector/info.html?rev=c675b6521b",controller:"CollectorIndex",data:{title:"采集器管理"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/collector/info.js?rev=3ece8a55cc"])}]}}).state("admin.collector.create",{url:"/create/:project",templateUrl:"templates/admin/collector/simple.html?rev=7441f69e5c",controller:"CollectorCreate",data:{title:"添加采集器"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/collector/create.js?rev=05586726f9"])}]}}).state("admin.collector.edit",{url:"/edit/:id",templateUrl:"templates/admin/collector/simple.html?rev=7441f69e5c",controller:"CollectorEdit",data:{title:"采集器编辑"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/collector/edit.js?rev=3a43b72bb0"])}]}}).state("admin.energy",{template:"<div ui-view></div>","abstract":!0,url:"/energy",data:{redirect:"admin.energy.index"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/project.js?rev=09fa316e9b","app/services/energycategory.js?rev=0da30293f9","app/services/energy.js?rev=bdf6e9b523","app/services/sensor.js?rev=c072ceb580"])}]}}).state("admin.energy.index",{url:"/index",templateUrl:"templates/admin/energy/index.html?rev=4ae5cfd588",data:{title:"能耗分类"},controller:"EnergyIndex",resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.css?rev=38dfd21969"]},{files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.js?rev=f06a7b88d7","vendor/angular-utf8-base64/angular-utf8-base64.min.js?rev=76dd170bc4","app/controllers/admin/energy/sensorSelect.js?rev=e1d6f4ab27","app/controllers/admin/energy/index.js?rev=bce381b56f"]}])}]}}).state("admin.device",{template:"<div ui-view></div>","abstract":!0,url:"/device",data:{redirect:"admin.device.index"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/project.js?rev=09fa316e9b","app/services/energycategory.js?rev=0da30293f9","app/services/energy.js?rev=bdf6e9b523","app/services/sensor.js?rev=c072ceb580","app/services/device.js?rev=bc2a1dc916"])}]}}).state("admin.device.index",{url:"/index",templateUrl:"templates/admin/device/index.html?rev=7639776b80",data:{title:"设备类型"},controller:"DeviceIndex",resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.css?rev=38dfd21969"]},{files:["vendor/angular-ui-tree/dist/angular-ui-tree.min.js?rev=f06a7b88d7","vendor/angular-utf8-base64/angular-utf8-base64.min.js?rev=76dd170bc4","app/controllers/admin/device/index.js?rev=44650009c4","app/controllers/admin/device/sensorSelect.js?rev=f196f3d6e7","app/controllers/admin/energy/index.js?rev=bce381b56f"]}])}]}}).state("admin.energycategory",{template:"<div ui-view></div>","abstract":!0,url:"/energycategory",data:{redirect:"admin.energycategory.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/project.js?rev=09fa316e9b","app/services/energycategory.js?rev=0da30293f9","app/services/energycategory.js?rev=0da30293f9","app/services/sensor.js?rev=c072ceb580"])}]}}).state("admin.energycategory.info",{url:"/info",templateUrl:"templates/admin/energycategory/info.html?rev=37627829e8",data:{title:"能耗配置"},controller:"energycategoryinfo",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["vendor/angular-utf8-base64/angular-utf8-base64.min.js?rev=76dd170bc4","app/controllers/admin/energycategory/info.js?rev=c718761085"])}]}}).state("admin.energycategory.add",{url:"/add",templateUrl:"templates/admin/energycategory/add.html?rev=88149c82b9",data:{title:"添加配置"},controller:"energycategoryadd",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["vendor/angular-utf8-base64/angular-utf8-base64.min.js?rev=76dd170bc4","app/controllers/admin/energycategory/add.js?rev=d1dacdcd35"])}]}}).state("admin.energycategory.update",{url:"/update/:id",templateUrl:"templates/admin/energycategory/update.html?rev=489e6fb8c4",data:{title:"编辑配置"},controller:"energycategoryupdate",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["vendor/angular-utf8-base64/angular-utf8-base64.min.js?rev=76dd170bc4","app/controllers/admin/energycategory/update.js?rev=8e8b22dfdb"])}]}}).state("admin.sensor",{template:"<div ui-view></div>","abstract":!0,url:"/sensor",data:{redirect:"admin.sensor.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/building.js?rev=9df06e6819","app/services/sensor.js?rev=c072ceb580"])}]}}).state("admin.sensor.info",{url:"/info",templateUrl:"templates/admin/sensor/info.html?rev=4353dab11a",data:{title:"传感器管理"},controller:"SensorIndex",resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["vendor/angular-xeditable/dist/css/xeditable.css"]},{name:"ngUpload",files:["vendor/ngUpload/ng-upload.min.js?rev=485bf9e38a"]},{name:"xeditable",files:["vendor/angular-xeditable/dist/js/xeditable.min.js?rev=f2ed4800de","app/services/driver.js?rev=28792de55e","app/services/control.js?rev=b56dc1781d","app/services/sensorAttrib.js?rev=0c5a510b91","app/controllers/admin/sensor/sensorSync.js?rev=42bf4a13b8","app/controllers/admin/sensor/sensorAttribute.js?rev=c334ededc5","app/controllers/admin/sensor/info.js?rev=634b28e032","app/directives/jstree.js?rev=9ccb1a98b5"]}])}]}}).state("admin.sensor.create",{url:"/create/:building",templateUrl:"templates/admin/sensor/create.html?rev=ec603f2ff6",data:{title:"添加传感器"},controller:"SensorCreate",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/collector.js?rev=08ae10cf80","app/services/energy.js?rev=bdf6e9b523","app/services/customer.js?rev=77f662bd55","app/controllers/admin/sensor/create.js?rev=a8436d1589"])}]}}).state("admin.sensor.edit",{url:"/edit/:id",templateUrl:"templates/admin/sensor/edit.html?rev=8c9ea778fd",data:{title:"编辑传感器"},controller:"SensorEdit",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/collector.js?rev=08ae10cf80","app/services/energy.js?rev=bdf6e9b523","app/services/customer.js?rev=77f662bd55","app/controllers/admin/sensor/edit.js?rev=2659b49834"])}]}}).state("admin.eventcategory",{template:"<div ui-view></div>","abstract":!0,url:"/eventcategory",data:{redirect:"admin.eventcategory.info"},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/services/project.js?rev=09fa316e9b","app/services/eventcategory.js?rev=14a24cd0a3"])}]}}).state("admin.eventcategory.info",{url:"/info",templateUrl:"templates/admin/eventcategory/info.html?rev=d2fbaf2c9c",data:{title:"事件配置"},controller:"eventcategoryIndex",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/eventcategory/info.js?rev=9b75c76a85"])}]}}).state("admin.eventcategory.add",{url:"/add",templateUrl:"templates/admin/eventcategory/add.html?rev=bda3521d53",data:{title:"事件添加"},controller:"eventcategoryAdd",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/eventcategory/add.js?rev=e3bfbca3cb"])}]}}).state("admin.eventcategory.update",{url:"/update/:id",templateUrl:"templates/admin/eventcategory/update.html?rev=919ea89b84",data:{title:"事件编辑"},controller:"eventcategoryUpdate",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/eventcategory/update.js?rev=bbcfe1f955"])}]}}).state("admin.finance",{"abstract":!0,url:"/finance",template:"<div ui-view></div>",data:{redirect:"admin.finance.index"},resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["vendor/angular-ui-grid/ui-grid.min.css?rev=cc57a78adc"]},{files:["vendor/angular-ui-grid/ui-grid.min.js?rev=1cd5c6e002","app/directives/datetimepicker.js?rev=fea771c7fe","app/directives/auto-height.js?rev=829c91de2b"]}])}]}}).state("admin.finance.index",{url:"/index",templateUrl:"templates/admin/finance/index.html?rev=1770a47dfb",data:{title:"平台财务"},controller:"Finance",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/finance/index.js?rev=302d8b49c7"])}]}}).state("admin.finance.record",{template:"<div ui-view></div>","abstract":!0,url:"/record"}).state("admin.finance.record.in",{url:"/in",templateUrl:"templates/admin/finance/record-in.html?rev=aa9ff2b37a",data:{title:"收入"},controller:"Finance.record.in",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/finance/record-in.js?rev=25b36c5294"])}]}}).state("admin.finance.record.in.project",{url:"/:projectid",data:{title:"项目"},views:{"@admin.finance.record":{templateUrl:"templates/admin/finance/record-in.html?rev=aa9ff2b37a",controller:"Finance.record.in",controllerAs:"self"}}}).state("admin.finance.record.out",{url:"/out",templateUrl:"templates/admin/finance/record-out.html?rev=70bf969c2d",data:{title:"支出"},controller:"Finance.record.out",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/finance/record-out.js?rev=a21e827b0f"])}]}}).state("admin.finance.record.out.project",{url:"/:projectid",data:{title:"项目"},views:{"@admin.finance.record":{templateUrl:"templates/admin/finance/record-out.html?rev=70bf969c2d",controller:"Finance.record.out",controllerAs:"self"}}}).state("admin.finance.record.out.project.detail",{url:"/:orderno",data:{title:"申请信息"},views:{"@admin.finance.record":{templateUrl:"templates/admin/finance/record-detail.html?rev=50ebfacb3e",controller:"Finance.record.out.detail",controllerAs:"self"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/finance/record-detail.js?rev=67a345ffaa"])}]}}).state("admin.finance.card",{url:"/card",templateUrl:"templates/admin/finance/card.html?rev=2b2d672cc4",data:{title:"银行卡管理"},controller:"Finance.card",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/finance/card.js?rev=ca267d9e0d"])}]}}).state("admin.finance.card.detail",{url:"/:id",data:{title:"申请详情"},views:{"@admin.finance":{templateUrl:"templates/admin/finance/card-detail.html?rev=1d94458d19",controller:"Finance.card.detail",controllerAs:"self"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/finance/card-detail.js?rev=4ef9f41845"])}]}}).state("admin.finance.project",{url:"/project",templateUrl:"templates/admin/finance/project/list.html?rev=a3474e12f2",data:{title:"项目列表"},controller:"Finance.project.list",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/finance/project/list.js?rev=aa60ccefe8"])}]}}).state("admin.finance.project.info",{url:"/:projectid",data:{title:"项目首页"},views:{"@admin.finance":{templateUrl:"templates/admin/finance/project/index.html?rev=9c5bdf0cb4",controller:"Finance.project.index",controllerAs:"self"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/directives/distpicker.js?rev=b0e89ed489","app/controllers/admin/finance/project/index.js?rev=063c5a162f"])}]}}).state("admin.finance.project.info.record",{url:"/record/:tab",data:{title:"收支明细"},views:{"@admin.finance":{templateUrl:"templates/admin/finance/project/record.html?rev=9dfb680402",controller:"Finance.project.record",controllerAs:"self"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/finance/project/record.js?rev=12b4d60213"])}]}}).state("admin.finance.project.info.withdraw",{url:"/withdraw",data:{title:"转账"},views:{"@admin.finance":{templateUrl:"templates/admin/finance/project/withdraw.html?rev=6627f300bc",controller:"Finance.project.withdraw",controllerAs:"self"}},resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/finance/project/withdraw.js?rev=455c57f980"])}]}}).state("admin.property",{"abstract":!0,url:"/property",template:"<div ui-view></div>",data:{redirect:"admin.property.index"},resolve:{deps:["$ocLazyLoad",function(e){return e.load([{insertBefore:"#load_styles_before",files:["//at.alicdn.com/t/font_1465708483_208262.css"]},{files:["app/directives/datetimepicker.js?rev=fea771c7fe","app/directives/auto-height.js?rev=829c91de2b","app/directives/modal-download.js?rev=08ba327b73","app/controllers/admin/property/withdraw-detail.js?rev=ca3f6ea635","app/controllers/admin/property/record-success.js?rev=d802792775"]}])}]}}).state("admin.property.index",{url:"/:projectid",templateUrl:"templates/admin/property/index.html?rev=d08625c88b",data:{title:"物业财务"},controller:"Property.index",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/directives/distpicker.js?rev=b0e89ed489","app/controllers/admin/property/index.js?rev=ffa9975f3c"])}]}}).state("admin.property.withdraw",{url:"/withdraw/:projectid",templateUrl:"templates/admin/property/withdraw.html?rev=8802b5ab93",data:{title:"申请提现"},controller:"Property.withdraw",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/property/withdraw.js?rev=2b2273f60a"])}]}}).state("admin.property.record",{url:"/record/:tab/:projectid/:category",templateUrl:"templates/admin/property/record.html?rev=f26c1b8110",data:{title:"收支明细"},controller:"Property.record",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/property/record.js?rev=790260ca31"])}]}}).state("admin.property.statement",{url:"/statement/:tab/:projectid",templateUrl:"templates/admin/property/statement.html?rev=0082745a51",data:{title:"对账单"},controller:"Property.statement",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/property/statement.js?rev=eafbd4468e"])}]}}).state("admin.property.consume",{url:"/consume/:projectid",templateUrl:"templates/admin/property/consume.html?rev=cba3687c7a",data:{title:"消耗明细"},controller:"Property.consume",controllerAs:"self",resolve:{deps:["$ocLazyLoad",function(e){return e.load(["app/controllers/admin/property/consume.js?rev=a2a8075f30"])}]}})}]).run(["$rootScope","$state","$cookies",function(e,t,a){e.$on("$stateChangeStart",function(e,r){a.token?a.token&&"login"===r.name&&(e.preventDefault&&e.preventDefault(),t.go("admin.dashboard")):"login"!==r.name&&"logout"!==r.name&&(e.preventDefault&&e.preventDefault(),t.go("login"))})}]);