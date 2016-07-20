angular.module('app').config(["$locationProvider", "$stateProvider", "$urlRouterProvider", function($locationProvider, $stateProvider, $urlRouterProvider) {
    // html5 mode
    $locationProvider.html5Mode(true);
    // For unmatched routes
    $urlRouterProvider.otherwise('/admin/dashboard');
    // Application routes
    $stateProvider.state('home', {
        url: '/',
        controller: ["$state", "$cookies", function($state, $cookies) {
            if (!$cookies.token) {
                $state.go('admin.dashboard');
            } else {
                $state.go('login');
            }
        }]
    }).state('login', {
        url: '/admin/login',
        templateUrl: 'templates/login.html?rev=2480a6b353',
        controller: 'session',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://static.cloudenergy.me/libs/sweetalert-1.1.3/dist/sweetalert.css'
                    ]
                }, {
                    serie: true,
                    files: [
                        'https://static.cloudenergy.me/libs/angular-md5-0.1.10/angular-md5.min.js',
                        'https://static.cloudenergy.me/libs/sweetalert-1.1.3/dist/sweetalert.min.js',
                        'app/services/user.min.js?rev=70c6db7442',
                        'app/services/ui.min.js?rev=177c56b661',
                        'app/controllers/session.min.js?rev=28a3d11f28'
                    ]
                }]);
            }]
        },
        data: {
            appClasses: 'bg-white usersession'
        }
    }).state('logout', {
        url: '/admin/logout',
        controller: ["$cookies", "$state", "$api", function($cookies, $state, $api) {
            $api.auth.logout({
                cookie: $cookies.getAll(),
                redirect: '/'
            }, function() {
                angular.forEach(['token', 'user'], function(key) {
                    $cookies.remove(key, {
                        path: '/',
                        domain: ''
                    });
                    $cookies.remove(key, {
                        path: '/',
                        domain: '.cloudenergy.me'
                    });
                    $cookies.remove(key, {
                        path: '/',
                        domain: 'admin.cloudenergy.me'
                    });
                    $cookies.remove(key, {
                        path: '/',
                        domain: '.admin.cloudenergy.me'
                    });
                });
                $state.go('login');
            });
        }]
    }).state('admin', {
        abstract: true,
        templateUrl: 'templates/common/layout.html?rev=e9bcb94c91',
        url: '/admin',
        controller: 'admin',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://static.cloudenergy.me/libs/sweetalert-1.1.3/dist/sweetalert.css',
                        'https://static.cloudenergy.me/libs/angular-ui-select-0.18.0/dist/select.min.css'
                    ]
                }, {
                    serie: true,
                    files: [
                        'https://static.cloudenergy.me/libs/moment-2.14.1/min/moment.min.js',
                        'https://static.cloudenergy.me/libs/moment-2.14.1/locale/zh-cn.js'
                    ]
                }, {
                    // cache: false,
                    // serie: true,
                    files: [
                        'https://static.cloudenergy.me/libs/angular-md5-0.1.10/angular-md5.min.js',
                        'https://static.cloudenergy.me/libs/sweetalert-1.1.3/dist/sweetalert.min.js',
                        'https://static.cloudenergy.me/libs/angular-ui-select-0.18.0/dist/select.min.js',
                        'app/directives/perfect-scrollbar.min.js?rev=d1e4bdddc5',
                        'app/filters/filters.min.js?rev=269f8d3097',
                        'app/services/ui.min.js?rev=177c56b661',
                        'app/services/user.min.js?rev=70c6db7442',
                        'app/services/api.min.js?rev=0abc6298e1',
                        'app/services/authentication.min.js?rev=0f36778387',
                        'app/services/account.min.js?rev=41e7b7bd99',
                        'app/controllers/admin.min.js?rev=805eb0236f'
                    ]
                }]);
            }]
        }
    }).state('admin.dashboard', {
        url: '/dashboard',
        templateUrl: 'templates/dash.html?rev=05cc799ea4',
        data: {
            title: '技术支持: 0571-85374789'
        }
    }).state('admin.character', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/character',
        data: {
            redirect: 'admin.character.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/services/character.min.js?rev=903e2446e0');
            }]
        }
    }).state('admin.character.info', {
        url: '/info',
        data: {
            title: '角色管理'
        },
        controller: 'characterInfo',
        templateUrl: 'templates/admin/character/info.html?rev=bd75833058',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/character/info.min.js?rev=9c58c5d47e');
            }]
        }
    }).state('admin.character.manage', {
        url: '/manage/:id',
        data: {
            title: '角色编辑'
        },
        controller: 'characterManage',
        templateUrl: 'templates/admin/character/manage.html?rev=e32729cf6b',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://static.cloudenergy.me/libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.css'
                    ]
                }, {
                    files: [
                        'https://static.cloudenergy.me/libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.js',
                        'app/controllers/admin/character/manage.min.js?rev=fb2be5ad0b',
                        'app/services/urlpath.min.js?rev=2dd7ea139b',
                        'app/services/project.min.js?rev=0a6c0a1013',
                        'app/services/building.min.js?rev=591e1b39a8',
                        'app/services/customer.min.js?rev=aad33b141e',
                        'app/services/collector.min.js?rev=946b23467a',
                        'app/services/sensor.min.js?rev=8d65776b26'
                    ]
                }]);
            }]
        }
    }).state('admin.project', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/project',
        data: {
            redirect: 'admin.project.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/services/project.min.js?rev=0a6c0a1013');
            }]
        }
    }).state('admin.project.info', {
        url: '/info',
        // controller : 'projectInfo',
        data: {
            title: '项目管理'
        },
        controller: 'projectInfo', // This view will use AppCtrl loaded below in the resolve
        templateUrl: 'templates/admin/project/info.html?rev=a5f4dd4548',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/project/info.min.js?rev=2e35b5c694');
            }]
        }
    }).state('admin.project.create', {
        url: '/create',
        templateUrl: 'templates/admin/project/create.html?rev=81556b33f7',
        data: {
            title: '创建项目'
        },
        controller: 'projectCreate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/energycategory.min.js?rev=6508426e02',
                    'app/controllers/admin/project/create.min.js?rev=c2356af47c'
                ]);
            }]
        }
    }).state('admin.project.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/project/edit.html?rev=514876ae16',
        data: {
            title: '编辑项目'
        },
        controller: 'projectEdit',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/project/edit.min.js?rev=9b6aef291a'
                ]);
            }]
        }
    }).state('admin.appidsecret', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/appidsecret',
        data: {
            redirect: 'admin.appidsecret.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/services/appidsecret.min.js?rev=e7cad27e0f');
            }]
        }
    }).state('admin.appidsecret.info', {
        url: '/info',
        templateUrl: 'templates/admin/appidsecret/info.html?rev=21a274c0dc',
        data: {
            title: '管理AppID'
        },
        controller: 'appidsecretInfo',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/appidsecret/info.min.js?rev=4c4a362e8f'
                ]);
            }]
        }
    }).state('admin.appidsecret.create', {
        url: '/create',
        templateUrl: 'templates/admin/appidsecret/create.html?rev=c26a64c272',
        data: {
            title: '创建AppID'
        },
        controller: 'appidsecretcreate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/character.min.js?rev=903e2446e0',
                    'app/services/billingaccount.min.js?rev=acccca264b',
                    'app/controllers/admin/appidsecret/create.min.js?rev=0465a367f0'
                ]);
            }]
        }
    }).state('admin.appidsecret.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/appidsecret/edit.html?rev=b6efb2c5e2',
        data: {
            title: '编辑AppID'
        },
        controller: 'appidsecretedit',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/character.min.js?rev=903e2446e0',
                    'app/controllers/admin/appidsecret/edit.min.js?rev=0282fff2db'
                ]);
            }]
        }
    }).state('admin.appidsecret.roleres', {
        url: '/roleres/:id',
        templateUrl: 'templates/admin/appidsecret/roleres.html?rev=f67769af22',
        data: {
            title: 'AppID权限'
        },
        controller: 'appidsecretroleres',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/character.min.js?rev=903e2446e0',
                    'app/services/project.min.js?rev=0a6c0a1013',
                    'app/services/building.min.js?rev=591e1b39a8',
                    'app/services/sensor.min.js?rev=8d65776b26',
                    'app/services/billingservice.min.js?rev=966c517551',
                    'app/services/energycategory.min.js?rev=6508426e02',
                    'app/controllers/admin/appidsecret/buildingSelect.min.js?rev=975627a5d4',
                    'app/controllers/admin/appidsecret/projectSelect.min.js?rev=66a287809d',
                    'app/controllers/admin/appidsecret/sensorSelect.min.js?rev=779c92dd36',
                    'app/controllers/admin/appidsecret/roleres.min.js?rev=4738dfd7ef'
                ]);
            }]
        }
    }).state('admin.account', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/account',
        data: {
            redirect: 'admin.account.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/account.min.js?rev=41e7b7bd99',
                    'app/services/billingaccount.min.js?rev=acccca264b',
                    'app/services/character.min.js?rev=903e2446e0'
                ]);
            }]
        }
    }).state('admin.account.info', {
        url: '/info',
        controller: 'accountInfo',
        templateUrl: 'templates/admin/account/info.html?rev=4e1af174ca',
        data: {
            title: '账户管理'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/account/info.min.js?rev=62e53f9570');
            }]
        }
    }).state('admin.account.create', {
        url: '/create',
        controller: 'accountCreate',
        templateUrl: 'templates/admin/account/create.html?rev=e3a9c7439e',
        data: {
            title: '新建账户'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/account/create.min.js?rev=a8a8364245'
                ]);
            }]
        }
    }).state('admin.account.edit', {
        url: '/edit/:id',
        controller: 'accountEdit',
        templateUrl: 'templates/admin/account/edit.html?rev=e0daf95025',
        data: {
            title: '编辑账户'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/account/edit.min.js?rev=1c8f14688f'
                ]);
            }]
        }
    }).state('admin.account.roleres', {
        url: '/roleres/:id',
        controller: 'accountroleres',
        templateUrl: 'templates/admin/account/roleres.html?rev=3f63df09d4',
        data: {
            title: '账户权限'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/billingservice.min.js?rev=966c517551',
                    'app/services/energycategory.min.js?rev=6508426e02',
                    'app/services/project.min.js?rev=0a6c0a1013',
                    'app/services/building.min.js?rev=591e1b39a8',
                    'app/services/sensor.min.js?rev=8d65776b26',
                    'app/controllers/admin/account/buildingSelect.min.js?rev=b7819c49a3',
                    'app/controllers/admin/account/projectSelect.min.js?rev=41a5ff788c',
                    'app/controllers/admin/account/sensorSelect.min.js?rev=72bae5138e',
                    'app/controllers/admin/account/roleres.min.js?rev=e334c54090'
                ]);
            }]
        }
    }).state('admin.account.amount', {
        url: '/amount/:account/:redirect/:project',
        controller: 'accountamount',
        templateUrl: 'templates/admin/account/amount.html?rev=9a9a786462',
        data: {
            title: '账户金额'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/log.min.js?rev=e5b9a0ee6e',
                    'app/services/payment.min.js?rev=194dc4eeca',
                    'app/controllers/admin/account/amount.min.js?rev=d384f41afe'
                ]);
            }],
            channels: ["$api", "$q", "$stateParams", function($api, $q, $stateParams) {
                var defer = $q.defer();
                $api.payment.channelinfo({
                    type: 'manual',
                    project: $stateParams.project,
                    flow: 'EARNING'
                }, function(res) {
                    return defer.resolve(res);
                });
                return defer.promise;
            }]
        }
    }).state('admin.billingservice', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/billingservice',
        data: {
            redirect: 'admin.billingservice.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/project.min.js?rev=0a6c0a1013',
                    'app/services/pab.min.js?rev=bb51301194',
                    'app/services/billingservice.min.js?rev=966c517551',
                    'app/services/energycategory.min.js?rev=6508426e02'
                ]);
            }]
        }
    }).state('admin.billingservice.info', {
        url: '/info',
        templateUrl: 'templates/admin/billingservice/info.html?rev=542e491ccd',
        data: {
            title: '计费策略'
        },
        controller: 'BillingServiceInfo',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/billingservice/info.min.js?rev=6b40d807bc');
            }]
        }
    }).state('admin.billingservice.manage', {
        url: '/manage/:id',
        templateUrl: 'templates/admin/billingservice/manage.html?rev=ed212aa795',
        data: {
            title: '管理策略'
        },
        controller: 'BillingServicemanage',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/billingservice/energySelect.min.js?rev=bbd07ed93a',
                    'app/controllers/admin/billingservice/manage.min.js?rev=995114b2f3'
                ]);
            }]
        }
    }).state('admin.billingservice.add', {
        url: '/add/:project',
        templateUrl: 'templates/admin/billingservice/add.html?rev=0ae629d065',
        data: {
            title: '添加策略'
        },
        controller: 'BillingServiceadd',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/billingaccount.min.js?rev=acccca264b',
                    'app/controllers/admin/billingservice/energySelect.min.js?rev=bbd07ed93a',
                    'app/controllers/admin/billingservice/add.min.js?rev=e7fb213aad'
                ]);
            }]
        }
    }).state('admin.urlpath', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/urlpath',
        data: {
            redirect: 'admin.urlpath.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/urlpath.min.js?rev=2dd7ea139b'
                ]);
            }]
        }
    }).state('admin.urlpath.info', {
        url: '/info',
        controller: 'urlpathInfo',
        templateUrl: 'templates/admin/urlpath/index.html?rev=531adafb03',
        data: {
            title: '地址管理'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://static.cloudenergy.me/libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.css'
                    ]
                }, {
                    files: [
                        'https://static.cloudenergy.me/libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.js',
                        'app/controllers/admin/urlpath/index.min.js?rev=952955d871'
                    ]
                }]);
            }]
        }
    }).state('admin.building', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/building',
        data: {
            redirect: 'admin.building.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/project.min.js?rev=0a6c0a1013',
                    'app/services/building.min.js?rev=591e1b39a8'
                ]);
            }]
        }
    }).state('admin.building.info', {
        url: '/info',
        templateUrl: 'templates/admin/building/info.html?rev=39808e892c',
        data: {
            title: '建筑管理'
        },
        controller: 'BuildingInfo',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/building/info.min.js?rev=cb4ba35bce');
            }]
        }
    }).state('admin.building.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/building/edit.html?rev=00084d2aea',
        data: {
            title: '建筑编辑'
        },
        controller: 'Buildingedit',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/building/edit.min.js?rev=4803cffda2');
            }]
        }
    }).state('admin.building.create', {
        url: '/create/:project',
        templateUrl: 'templates/admin/building/create.html?rev=86416c1c51',
        data: {
            title: '建筑编辑'
        },
        controller: 'Buildingcreate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/building/create.min.js?rev=2f4e21237d');
            }]
        }
    }).state('admin.department', {
        templateUrl: 'templates/admin/department/base.html?rev=b72ea2a3b5',
        abstract: true,
        url: '/department',
        data: {
            redirect: 'admin.department.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/project.min.js?rev=0a6c0a1013',
                    'app/services/billingaccount.min.js?rev=acccca264b',
                    'app/services/department.min.js?rev=9fc5f2812b'
                ]);
            }]
        }
    }).state('admin.department.info', {
        url: '/info',
        templateUrl: 'templates/admin/department/info.html?rev=c9a2411be1',
        data: {
            title: '户管理'
        },
        controller: 'departmentInfo',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'ngUpload',
                    files: [
                        'https://static.cloudenergy.me/libs/ngUpload-0.5.18/ng-upload.min.js'
                    ]
                }]).then(function() {
                    return $ocLazyLoad.load([
                        'app/services/sensor.min.js?rev=8d65776b26',
                        'app/controllers/admin/department/info.min.js?rev=bbddba5492'
                    ]);
                });
            }]
        }
    }).state('admin.department.create', {
        url: '/create/:project',
        templateUrl: 'templates/admin/department/create.html?rev=e90b2856ea',
        data: {
            title: '添加户'
        },
        controller: 'departmentcreate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/sensor.min.js?rev=8d65776b26',
                    'app/controllers/admin/common/accountSelect.min.js?rev=f790145200',
                    'app/controllers/admin/common/channelSelect.min.js?rev=b7ed65b0f2',
                    'app/controllers/admin/department/create.min.js?rev=6bb1e7d257'
                ]);
            }]
        }
    }).state('admin.department.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/department/edit.html?rev=fbc40c3b20',
        data: {
            title: '编辑商户'
        },
        controller: 'departmentedit',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/sensor.min.js?rev=8d65776b26',
                    'app/controllers/admin/common/accountSelect.min.js?rev=f790145200',
                    'app/controllers/admin/common/channelSelect.min.js?rev=b7ed65b0f2',
                    'app/controllers/admin/department/edit.min.js?rev=ec3c5ba1ad'
                ]);
            }]
        }
    }).state('admin.customer', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/customer',
        data: {
            redirect: 'admin.customer.index'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/project.min.js?rev=0a6c0a1013',
                    'app/services/energy.min.js?rev=ef3fe92cff',
                    'app/services/customer.min.js?rev=aad33b141e',
                    'app/services/sensor.min.js?rev=8d65776b26'
                ]);
            }]
        }
    }).state('admin.customer.index', {
        url: '/index',
        templateUrl: 'templates/admin/customer/index.html?rev=6c5a29f0af',
        data: {
            title: '社会属性'
        },
        controller: 'CustomerIndex',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://static.cloudenergy.me/libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.css'
                    ]
                }, {
                    files: [
                        'https://static.cloudenergy.me/libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.js',
                        // 'https://static.cloudenergy.me/libs/angular-utf8-base64-0.0.5/angular-utf8-base64.min.js',
                        'app/controllers/admin/customer/sensorSelect.min.js?rev=f908df2a98',
                        'app/controllers/admin/customer/index.min.js?rev=eaaa52e008'
                    ]
                }]);
            }]
        }
    }).state('admin.collector', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/collector',
        data: {
            redirect: 'admin.collector.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/project.min.js?rev=0a6c0a1013',
                    'app/services/collector.min.js?rev=946b23467a'
                ]);
            }]
        }
    }).state('admin.collector.info', {
        url: '/info',
        templateUrl: 'templates/admin/collector/info.html?rev=fce7044c43',
        controller: 'CollectorIndex',
        data: {
            title: '采集器管理'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/collector/info.min.js?rev=acb0baec18'
                ]);
            }]
        }
    }).state('admin.collector.create', {
        url: '/create/:project',
        templateUrl: 'templates/admin/collector/simple.html?rev=7441f69e5c',
        controller: 'CollectorCreate',
        data: {
            title: '添加采集器'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/collector/create.min.js?rev=aedc976625'
                ]);
            }]
        }
    }).state('admin.collector.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/collector/simple.html?rev=7441f69e5c',
        controller: 'CollectorEdit',
        data: {
            title: '采集器编辑'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/collector/edit.min.js?rev=cf7004a5d7'
                ]);
            }]
        }
    }).state('admin.energy', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/energy',
        data: {
            redirect: 'admin.energy.index'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/project.min.js?rev=0a6c0a1013',
                    'app/services/energycategory.min.js?rev=6508426e02',
                    'app/services/energy.min.js?rev=ef3fe92cff',
                    'app/services/sensor.min.js?rev=8d65776b26'
                ]);
            }]
        }
    }).state('admin.energy.index', {
        url: '/index',
        templateUrl: 'templates/admin/energy/index.html?rev=b3984dac5f',
        data: {
            title: '能耗分类'
        },
        controller: 'EnergyIndex',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://static.cloudenergy.me/libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.css'
                    ]
                }, {
                    files: [
                        'https://static.cloudenergy.me/libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.js',
                        'https://static.cloudenergy.me/libs/angular-utf8-base64-0.0.5/angular-utf8-base64.min.js',
                        'app/controllers/admin/energy/sensorSelect.min.js?rev=10cae57a00',
                        'app/controllers/admin/energy/index.min.js?rev=70e216a9b2'
                    ]
                }]);
            }]
        }
    }).state('admin.energycategory', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/energycategory',
        data: {
            redirect: 'admin.energycategory.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/project.min.js?rev=0a6c0a1013',
                    'app/services/energycategory.min.js?rev=6508426e02',
                    'app/services/energycategory.min.js?rev=6508426e02',
                    'app/services/sensor.min.js?rev=8d65776b26'
                ]);
            }]
        }
    }).state('admin.energycategory.info', {
        url: '/info',
        templateUrl: 'templates/admin/energycategory/info.html?rev=37627829e8',
        data: {
            title: '能耗配置'
        },
        controller: 'energycategoryinfo',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'https://static.cloudenergy.me/libs/angular-utf8-base64-0.0.5/angular-utf8-base64.min.js',
                    'app/controllers/admin/energycategory/info.min.js?rev=0662f70d14'
                ]);
            }]
        }
    }).state('admin.energycategory.add', {
        url: '/add',
        templateUrl: 'templates/admin/energycategory/add.html?rev=88149c82b9',
        data: {
            title: '添加配置'
        },
        controller: 'energycategoryadd',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'https://static.cloudenergy.me/libs/angular-utf8-base64-0.0.5/angular-utf8-base64.min.js',
                    'app/controllers/admin/energycategory/add.min.js?rev=9d2bf43aaa'
                ]);
            }]
        }
    }).state('admin.energycategory.update', {
        url: '/update/:id',
        templateUrl: 'templates/admin/energycategory/update.html?rev=489e6fb8c4',
        data: {
            title: '编辑配置'
        },
        controller: 'energycategoryupdate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'https://static.cloudenergy.me/libs/angular-utf8-base64-0.0.5/angular-utf8-base64.min.js',
                    'app/controllers/admin/energycategory/update.min.js?rev=9a109bdfd8'
                ]);
            }]
        }
    }).state('admin.sensor', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/sensor',
        data: {
            redirect: 'admin.sensor.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/building.min.js?rev=591e1b39a8',
                    'app/services/sensor.min.js?rev=8d65776b26'
                ]);
            }]
        }
    }).state('admin.sensor.info', {
        url: '/info',
        templateUrl: 'templates/admin/sensor/info.html?rev=aef5640c48',
        data: {
            title: '传感器管理'
        },
        controller: 'SensorIndex',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://static.cloudenergy.me/libs/angular-xeditable-0.2.0/dist/css/xeditable.min.css'
                    ]
                }, {
                    name: 'ngUpload',
                    files: [
                        'https://static.cloudenergy.me/libs/ngUpload-0.5.18/ng-upload.min.js'
                    ]
                }, {
                    name: 'xeditable',
                    files: [
                        'https://static.cloudenergy.me/libs/angular-xeditable-0.2.0/dist/js/xeditable.min.js',
                        'app/services/driver.min.js?rev=10fba7c5a6',
                        'app/services/control.min.js?rev=9fbeff12b2',
                        'app/services/sensorAttrib.min.js?rev=fff9d59294',
                        'app/controllers/admin/sensor/sensorSync.min.js?rev=1625994458',
                        'app/controllers/admin/sensor/sensorAttribute.min.js?rev=b33bf70857',
                        'app/controllers/admin/sensor/info.min.js?rev=6651b7f13f',
                        'app/directives/jstree.min.js?rev=2a332f4b56'
                    ]
                }]);
            }]
        }
    }).state('admin.sensor.create', {
        url: '/create/:building',
        templateUrl: 'templates/admin/sensor/create.html?rev=ec603f2ff6',
        data: {
            title: '添加传感器'
        },
        controller: 'SensorCreate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/collector.min.js?rev=946b23467a',
                    'app/services/energy.min.js?rev=ef3fe92cff',
                    'app/services/customer.min.js?rev=aad33b141e',
                    'app/controllers/admin/sensor/create.min.js?rev=eb39ef6593'
                ]);
            }]
        }
    }).state('admin.sensor.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/sensor/edit.html?rev=8c9ea778fd',
        data: {
            title: '编辑传感器'
        },
        controller: 'SensorEdit',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/collector.min.js?rev=946b23467a',
                    'app/services/energy.min.js?rev=ef3fe92cff',
                    'app/services/customer.min.js?rev=aad33b141e',
                    'app/controllers/admin/sensor/edit.min.js?rev=496850af02'
                ]);
            }]
        }
    }).state('admin.eventcategory', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/eventcategory',
        data: {
            redirect: 'admin.eventcategory.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/project.min.js?rev=0a6c0a1013',
                    'app/services/eventcategory.min.js?rev=06fa8c256f'
                ]);
            }]
        }
    }).state('admin.eventcategory.info', {
        url: '/info',
        templateUrl: 'templates/admin/eventcategory/info.html?rev=a4f8524c22',
        data: {
            title: '事件配置'
        },
        controller: 'eventcategoryIndex',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/eventcategory/info.min.js?rev=fe9291f4c3'
                ]);
            }]
        }
    }).state('admin.eventcategory.add', {
        url: '/add',
        templateUrl: 'templates/admin/eventcategory/add.html?rev=bda3521d53',
        data: {
            title: '事件添加'
        },
        controller: 'eventcategoryAdd',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/eventcategory/add.min.js?rev=29741f3d05'
                ]);
            }]
        }
    }).state('admin.eventcategory.update', {
        url: '/update/:id',
        templateUrl: 'templates/admin/eventcategory/update.html?rev=919ea89b84',
        data: {
            title: '事件编辑'
        },
        controller: 'eventcategoryUpdate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/eventcategory/update.min.js?rev=568d4230d7'
                ]);
            }]
        }
    }).state('admin.finance', {
        abstract: true,
        url: '/finance',
        template: '<div ui-view></div>',
        data: {
            redirect: 'admin.finance.index'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        'https://static.cloudenergy.me/libs/angular-ui-grid-3.2.1/ui-grid.min.css'
                    ]
                }, {
                    files: [
                        'https://static.cloudenergy.me/libs/angular-ui-grid-3.2.1/ui-grid.min.js',
                        'app/directives/datetimepicker.min.js?rev=3c390403e5',
                        'app/directives/auto-height.min.js?rev=b13007069a'
                    ]
                }]);
            }]
        }
    }).state('admin.finance.index', {
        url: '/index',
        templateUrl: 'templates/admin/finance/index.html?rev=1770a47dfb',
        data: {
            title: '平台财务'
        },
        controller: 'Finance',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/index.min.js?rev=eafe311a5c'
                ]);
            }]
        }
    }).state('admin.finance.record', {
        template: '<div ui-view></div>',
        abstract: true,
        url: '/record'
    }).state('admin.finance.record.in', {
        url: '/in',
        templateUrl: 'templates/admin/finance/record-in.html?rev=aa9ff2b37a',
        data: {
            title: '收入'
        },
        controller: 'Finance.record.in',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/record-in.min.js?rev=34035d5f21'
                ]);
            }]
        }
    }).state('admin.finance.record.in.project', {
        url: '/:projectid',
        data: {
            title: '项目'
        },
        views: {
            '@admin.finance.record': {
                templateUrl: 'templates/admin/finance/record-in.html?rev=aa9ff2b37a',
                controller: 'Finance.record.in',
                controllerAs: 'self'
            }
        }
    }).state('admin.finance.record.out', {
        url: '/out',
        templateUrl: 'templates/admin/finance/record-out.html?rev=f77db4e53c',
        data: {
            title: '支出'
        },
        controller: 'Finance.record.out',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/record-out.min.js?rev=5dc4b5fa92'
                ]);
            }]
        }
    }).state('admin.finance.record.out.project', {
        url: '/:projectid',
        data: {
            title: '项目'
        },
        views: {
            '@admin.finance.record': {
                templateUrl: 'templates/admin/finance/record-out.html?rev=f77db4e53c',
                controller: 'Finance.record.out',
                controllerAs: 'self'
            }
        }
    }).state('admin.finance.record.out.project.detail', {
        url: '/:orderno',
        data: {
            title: '申请信息'
        },
        views: {
            '@admin.finance.record': {
                templateUrl: 'templates/admin/finance/record-detail.html?rev=50ebfacb3e',
                controller: 'Finance.record.out.detail',
                controllerAs: 'self'
            }
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/record-detail.min.js?rev=cdade4567d'
                ]);
            }]
        }
    }).state('admin.finance.card', {
        url: '/card',
        templateUrl: 'templates/admin/finance/card.html?rev=2b2d672cc4',
        data: {
            title: '银行卡管理'
        },
        controller: 'Finance.card',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/card.min.js?rev=e086c4842f'
                ]);
            }]
        }
    }).state('admin.finance.card.detail', {
        url: '/:id',
        data: {
            title: '申请详情'
        },
        views: {
            '@admin.finance': {
                templateUrl: 'templates/admin/finance/card-detail.html?rev=1d94458d19',
                controller: 'Finance.card.detail',
                controllerAs: 'self'
            }
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/card-detail.min.js?rev=d3f08bf3f0'
                ]);
            }]
        }
    }).state('admin.finance.project', {
        url: '/project',
        templateUrl: 'templates/admin/finance/project/list.html?rev=a3474e12f2',
        data: {
            title: '项目列表'
        },
        controller: 'Finance.project.list',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/project/list.min.js?rev=15f32688b9'
                ]);
            }]
        }
    }).state('admin.finance.project.info', {
        url: '/:projectid',
        data: {
            title: '项目首页'
        },
        views: {
            '@admin.finance': {
                templateUrl: 'templates/admin/finance/project/index.html?rev=9c5bdf0cb4',
                controller: 'Finance.project.index',
                controllerAs: 'self'
            }
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/directives/distpicker.min.js?rev=47a8e0bc0d',
                    'app/controllers/admin/finance/project/index.min.js?rev=5d48668150'
                ]);
            }]
        }
    }).state('admin.finance.project.info.record', {
        url: '/record/:tab',
        data: {
            title: '收支明细'
        },
        views: {
            '@admin.finance': {
                templateUrl: 'templates/admin/finance/project/record.html?rev=0183ae1ae5',
                controller: 'Finance.project.record',
                controllerAs: 'self'
            }
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/project/record.min.js?rev=f52fca6dac'
                ]);
            }]
        }
    }).state('admin.finance.project.info.withdraw', {
        url: '/withdraw',
        data: {
            title: '转账'
        },
        views: {
            '@admin.finance': {
                templateUrl: 'templates/admin/finance/project/withdraw.html?rev=6627f300bc',
                controller: 'Finance.project.withdraw',
                controllerAs: 'self'
            }
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/project/withdraw.min.js?rev=7b01748977'
                ]);
            }]
        }
    }).state('admin.property', {
        abstract: true,
        url: '/property',
        template: '<div ui-view></div>',
        data: {
            redirect: 'admin.property.index'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        '//at.alicdn.com/t/font_1465708483_208262.css'
                    ]
                }, {
                    // serie: true,
                    files: [
                        'app/directives/datetimepicker.min.js?rev=3c390403e5',
                        'app/directives/auto-height.min.js?rev=b13007069a',
                        'app/directives/modal-download.min.js?rev=c526f60567',
                        'app/controllers/admin/property/withdraw-detail.min.js?rev=6010a29633',
                        'app/controllers/admin/property/record-success.min.js?rev=9373f44877'
                    ]
                }]);
            }]
        }
    }).state('admin.property.index', {
        url: '/:projectid',
        templateUrl: 'templates/admin/property/index.html?rev=4e00fd9cdb',
        data: {
            title: '物业财务'
        },
        controller: 'Property.index',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/directives/distpicker.min.js?rev=47a8e0bc0d',
                    'app/controllers/admin/property/index.min.js?rev=44a0fa449d'
                ]);
            }]
        }
    }).state('admin.property.withdraw', {
        url: '/withdraw/:projectid',
        templateUrl: 'templates/admin/property/withdraw.html?rev=8802b5ab93',
        data: {
            title: '申请提现'
        },
        controller: 'Property.withdraw',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/property/withdraw.min.js?rev=e26582e10f'
                ]);
            }]
        }
    }).state('admin.property.record', {
        url: '/record/:tab/:projectid/:category',
        templateUrl: 'templates/admin/property/record.html?rev=5127dfd3a3',
        data: {
            title: '收支明细'
        },
        controller: 'Property.record',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/property/record.min.js?rev=967ba1b9bb'
                ]);
            }]
        }
    }).state('admin.property.statement', {
        url: '/statement/:tab/:projectid',
        templateUrl: 'templates/admin/property/statement.html?rev=46b410b8b7',
        data: {
            title: '对账单'
        },
        controller: 'Property.statement',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/property/statement.min.js?rev=fd5ced5899'
                ]);
            }]
        }
    }).state('admin.property.consume', {
        url: '/consume/:projectid',
        templateUrl: 'templates/admin/property/consume.html?rev=753a1aa599',
        data: {
            title: '消耗明细'
        },
        controller: 'Property.consume',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/property/consume.min.js?rev=191e892810'
                ]);
            }]
        }
    });
}]).run(["$rootScope", "$state", "$cookies", function($rootScope, $state, $cookies) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (!$cookies.token) {
            if (toState.name !== 'login' && toState.name !== 'logout') {
                event.preventDefault && event.preventDefault();
                $state.go('login');
            }
        } else if ($cookies.token && toState.name === 'login') {
            event.preventDefault && event.preventDefault();
            $state.go('admin.dashboard');
        }
    });
}]);