angular.module('app').config(["$locationProvider", "$stateProvider", "$urlRouterProvider", function($locationProvider, $stateProvider, $urlRouterProvider) {
    // html5 mode
    $locationProvider.html5Mode(true);
    // For unmatched routes
    $urlRouterProvider.otherwise('/admin/dashboard');
    // Application routes
    var static = 'https://static.cloudenergy.me/';
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
        templateUrl: 'templates/login.html?rev=0f3c3941f7',
        controller: 'login',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/user.min.js?rev=70c6db7442',
                    'app/services/ui.min.js?rev=177c56b661',
                    'app/controllers/login.min.js?rev=20443151e0'
                ]);
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
        templateUrl: 'templates/common/layout.html?rev=730882f633',
        url: '/admin',
        controller: 'admin',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        static + 'libs/angular-ui-select-0.18.0/dist/select.min.css'
                    ]
                }, {
                    // cache: false,
                    // serie: true,
                    files: [
                        static + 'libs/angular-bootstrap-0.14.3/ui-bootstrap-tpls.min.js',
                        static + 'libs/angular-ui-select-0.18.0/dist/select.min.js',
                        static + 'libs/underscore-1.8.3/underscore-min.js',
                        'app/directives/perfect-scrollbar.min.js?rev=d1e4bdddc5',
                        'app/filters/filters.min.js?rev=f56ec829fd',
                        'app/services/ui.min.js?rev=177c56b661',
                        'app/services/user.min.js?rev=70c6db7442',
                        'app/services/api.min.js?rev=5da589a419',
                        'app/services/authentication.min.js?rev=0f36778387',
                        'app/services/account.min.js?rev=0a9c0f02bd',
                        'app/controllers/admin.min.js?rev=9ece3493be'
                    ]
                }]);
            }]
        }
    }).state('admin.dashboard', {
        url: '/dashboard',
        templateUrl: 'templates/dash.html?rev=05cc799ea4',
        data: {
            projectHide: true,
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
                return $ocLazyLoad.load('app/services/character.min.js?rev=c077c2e7a0');
            }]
        }
    }).state('admin.character.info', {
        url: '/info',
        data: {
            projectHide: true,
            title: '角色管理'
        },
        controller: 'characterInfo',
        templateUrl: 'templates/admin/character/info.html?rev=2b07cb85bc',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/character/info.min.js?rev=9dc314cd5e');
            }]
        }
    }).state('admin.character.manage', {
        url: '/manage/:id',
        data: {
            projectHide: true,
            title: '角色编辑'
        },
        controller: 'characterManage',
        templateUrl: 'templates/admin/character/manage.html?rev=e2c7235375',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        static + 'libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.css'
                    ]
                }, {
                    files: [
                        static + 'libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.js',
                        'app/controllers/admin/character/manage.min.js?rev=b94eed79a2',
                        'app/services/urlpath.min.js?rev=a173d68137',
                        'app/services/project.min.js?rev=253595453a',
                        'app/services/building.min.js?rev=ee8f76352d',
                        'app/services/customer.min.js?rev=2feac33e8f',
                        'app/services/collector.min.js?rev=3f98049549',
                        'app/services/sensor.min.js?rev=7102ffba10'
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
                return $ocLazyLoad.load('app/services/project.min.js?rev=253595453a');
            }]
        }
    }).state('admin.project.info', {
        url: '/info',
        data: {
            projectHide: true,
            title: '项目管理'
        },
        controller: 'projectInfo', // This view will use AppCtrl loaded below in the resolve
        templateUrl: 'templates/admin/project/info.html?rev=cf0afcd3ec',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/project/info.min.js?rev=df4b003896');
            }]
        }
    }).state('admin.project.create', {
        url: '/create',
        templateUrl: 'templates/admin/project/create.html?rev=81556b33f7',
        data: {
            projectHide: true,
            title: '创建项目'
        },
        controller: 'projectCreate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/energycategory.min.js?rev=0c6109038d',
                    'app/controllers/admin/project/create.min.js?rev=c2356af47c'
                ]);
            }]
        }
    }).state('admin.project.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/project/edit.html?rev=514876ae16',
        data: {
            projectHide: true,
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
                    'app/services/account.min.js?rev=0a9c0f02bd',
                    'app/services/billingaccount.min.js?rev=fc550857eb',
                    'app/services/character.min.js?rev=c077c2e7a0'
                ]);
            }]
        }
    }).state('admin.account.info', {
        url: '/info',
        controller: 'accountInfo',
        templateUrl: 'templates/admin/account/info.html?rev=89538ef664',
        data: {
            projectHide: true,
            title: '账户管理'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/account/info.min.js?rev=c09eccc737');
            }]
        }
    }).state('admin.account.create', {
        url: '/create',
        controller: 'accountCreate',
        templateUrl: 'templates/admin/account/create.html?rev=2f0926a077',
        data: {
            projectHide: true,
            title: '新建账户'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/account/create.min.js?rev=232ef37349'
                ]);
            }]
        }
    }).state('admin.account.edit', {
        url: '/edit/:id',
        controller: 'accountEdit',
        templateUrl: 'templates/admin/account/edit.html?rev=ab058fc974',
        data: {
            projectHide: true,
            title: '编辑账户'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/account/edit.min.js?rev=175b69566f'
                ]);
            }]
        }
    }).state('admin.account.roleres', {
        url: '/roleres/:id',
        controller: 'accountroleres',
        templateUrl: 'templates/admin/account/roleres.html?rev=5025cfdad7',
        data: {
            projectHide: true,
            title: '账户权限'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/billingservice.min.js?rev=ae6baae3b2',
                    'app/services/energycategory.min.js?rev=0c6109038d',
                    'app/services/project.min.js?rev=253595453a',
                    'app/services/building.min.js?rev=ee8f76352d',
                    'app/services/sensor.min.js?rev=7102ffba10',
                    'app/controllers/admin/account/buildingSelect.min.js?rev=e934c39445',
                    'app/controllers/admin/account/projectSelect.min.js?rev=d24e4207ed',
                    'app/controllers/admin/account/sensorSelect.min.js?rev=4214a41180',
                    'app/controllers/admin/account/roleres.min.js?rev=9a3d7ab0b6'
                ]);
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
                    'app/services/project.min.js?rev=253595453a',
                    'app/services/pab.min.js?rev=6b516ff5ef',
                    'app/services/billingservice.min.js?rev=ae6baae3b2',
                    'app/services/energycategory.min.js?rev=0c6109038d'
                ]);
            }]
        }
    }).state('admin.billingservice.info', {
        url: '/info',
        templateUrl: 'templates/admin/billingservice/info.html?rev=548b00ee79',
        data: {
            title: '计费策略'
        },
        controller: 'BillingServiceInfo',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/billingservice/info.min.js?rev=aa1f8ab077');
            }]
        }
    }).state('admin.billingservice.manage', {
        url: '/manage/:id',
        templateUrl: 'templates/admin/billingservice/manage.html?rev=9ce291753b',
        data: {
            projectDisabled: true,
            title: '编辑策略'
        },
        controller: 'BillingServicemanage',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/billingservice/energySelect.min.js?rev=1941552c26',
                    'app/controllers/admin/billingservice/manage.min.js?rev=482be85bf2'
                ]);
            }]
        }
    }).state('admin.billingservice.add', {
        url: '/add',
        templateUrl: 'templates/admin/billingservice/add.html?rev=f6c58c61dc',
        data: {
            projectDisabled: true,
            title: '添加策略'
        },
        controller: 'BillingServiceadd',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/billingaccount.min.js?rev=fc550857eb',
                    'app/controllers/admin/billingservice/energySelect.min.js?rev=1941552c26',
                    'app/controllers/admin/billingservice/add.min.js?rev=6dcb4ee9b0'
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
                    'app/services/urlpath.min.js?rev=a173d68137'
                ]);
            }]
        }
    }).state('admin.urlpath.info', {
        url: '/info',
        controller: 'urlpathInfo',
        templateUrl: 'templates/admin/urlpath/index.html?rev=9b5dee6afa',
        data: {
            projectHide: true,
            title: '地址管理'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        static + 'libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.css'
                    ]
                }, {
                    files: [
                        static + 'libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.js',
                        'app/controllers/admin/urlpath/index.min.js?rev=36751153a6'
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
                    'app/services/project.min.js?rev=253595453a',
                    'app/services/building.min.js?rev=ee8f76352d'
                ]);
            }]
        }
    }).state('admin.building.info', {
        url: '/info',
        templateUrl: 'templates/admin/building/info.html?rev=7ef203dab6',
        data: {
            title: '建筑管理'
        },
        controller: 'BuildingInfo',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/building/info.min.js?rev=c16426e660');
            }]
        }
    }).state('admin.building.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/building/edit.html?rev=c9e922d3a4',
        data: {
            projectDisabled: true,
            title: '编辑'
        },
        controller: 'Buildingedit',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/building/edit.min.js?rev=42fcd105e9');
            }]
        }
    }).state('admin.building.create', {
        url: '/create',
        templateUrl: 'templates/admin/building/create.html?rev=edd56160dc',
        data: {
            projectDisabled: true,
            title: '添加'
        },
        controller: 'Buildingcreate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load('app/controllers/admin/building/create.min.js?rev=cb0ade72ba');
            }]
        }
    }).state('admin.department', {
        templateUrl: 'templates/admin/department/base.html?rev=35daa3fa2d',
        abstract: true,
        url: '/department',
        data: {
            redirect: 'admin.department.info'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/project.min.js?rev=253595453a',
                    'app/services/billingaccount.min.js?rev=fc550857eb',
                    'app/services/department.min.js?rev=85b5a81356'
                ]);
            }]
        }
    }).state('admin.department.info', {
        url: '/info',
        templateUrl: 'templates/admin/department/info.html?rev=8ca2806ad7',
        data: {
            title: '户管理'
        },
        controller: 'departmentInfo',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'ngUpload',
                    files: [
                        static + 'libs/ngUpload-0.5.18/ng-upload.min.js'
                    ]
                }]).then(function() {
                    return $ocLazyLoad.load([
                        'app/services/sensor.min.js?rev=7102ffba10',
                        'app/controllers/admin/department/info.min.js?rev=fa7df9a3bb'
                    ]);
                });
            }]
        }
    }).state('admin.department.create', {
        url: '/create',
        templateUrl: 'templates/admin/department/create.html?rev=db71fbdd4e',
        data: {
            projectDisabled: true,
            title: '添加户'
        },
        controller: 'departmentcreate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/sensor.min.js?rev=7102ffba10',
                    'app/controllers/admin/common/accountSelect.min.js?rev=50867bfdeb',
                    'app/controllers/admin/common/channelSelect.min.js?rev=4eaca3e3e8',
                    'app/controllers/admin/department/create.min.js?rev=aad1d3cae1'
                ]);
            }]
        }
    }).state('admin.department.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/department/edit.html?rev=c345122a21',
        data: {
            projectDisabled: true,
            title: '编辑商户'
        },
        controller: 'departmentedit',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/sensor.min.js?rev=7102ffba10',
                    'app/controllers/admin/common/accountSelect.min.js?rev=50867bfdeb',
                    'app/controllers/admin/common/channelSelect.min.js?rev=4eaca3e3e8',
                    'app/controllers/admin/department/edit.min.js?rev=ec3c5ba1ad'
                ]);
            }]
        }
    }).state('admin.department.amount', {
        url: '/amount/:account',
        controller: 'accountamount',
        templateUrl: 'templates/admin/department/amount.html?rev=9f2a0fbf8e',
        data: {
            projectDisabled: true,
            title: '充值'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/log.min.js?rev=e5b9a0ee6e',
                    'app/services/payment.min.js?rev=194dc4eeca',
                    'app/controllers/admin/department/amount.min.js?rev=7312c7e3f7'
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
                    'app/services/project.min.js?rev=253595453a',
                    'app/services/energy.min.js?rev=c613470cac',
                    'app/services/customer.min.js?rev=2feac33e8f',
                    'app/services/sensor.min.js?rev=7102ffba10'
                ]);
            }]
        }
    }).state('admin.customer.index', {
        url: '/index',
        templateUrl: 'templates/admin/customer/index.html?rev=bc24500d84',
        data: {
            title: '社会属性'
        },
        controller: 'CustomerIndex',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        static + 'libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.css'
                    ]
                }, {
                    files: [
                        static + 'libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.js',
                        // static+'libs/angular-utf8-base64-0.0.5/angular-utf8-base64.min.js',
                        'app/controllers/admin/customer/sensorSelect.min.js?rev=f908df2a98',
                        'app/controllers/admin/customer/index.min.js?rev=f2b2eaea1b'
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
                    'app/services/project.min.js?rev=253595453a',
                    'app/services/collector.min.js?rev=3f98049549'
                ]);
            }]
        }
    }).state('admin.collector.info', {
        url: '/info',
        templateUrl: 'templates/admin/collector/info.html?rev=369ee9746f',
        controller: 'CollectorIndex',
        data: {
            title: '采集器管理'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/collector/info.min.js?rev=2348cfb6b3'
                ]);
            }]
        }
    }).state('admin.collector.create', {
        url: '/create',
        templateUrl: 'templates/admin/collector/simple.html?rev=fade6f9787',
        controller: 'CollectorCreate',
        data: {
            projectDisabled: true,
            title: '添加采集器'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/collector/create.min.js?rev=30511496a2'
                ]);
            }]
        }
    }).state('admin.collector.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/collector/simple.html?rev=fade6f9787',
        controller: 'CollectorEdit',
        data: {
            projectDisabled: true,
            title: '采集器编辑'
        },
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/collector/edit.min.js?rev=c61e9aaf8d'
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
                    'app/services/project.min.js?rev=253595453a',
                    'app/services/energycategory.min.js?rev=0c6109038d',
                    'app/services/energy.min.js?rev=c613470cac',
                    'app/services/sensor.min.js?rev=7102ffba10'
                ]);
            }]
        }
    }).state('admin.energy.index', {
        url: '/index',
        templateUrl: 'templates/admin/energy/index.html?rev=21ef96c8a2',
        data: {
            title: '能耗分类'
        },
        controller: 'EnergyIndex',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        static + 'libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.css'
                    ]
                }, {
                    files: [
                        static + 'libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.js',
                        static + 'libs/angular-utf8-base64-0.0.5/angular-utf8-base64.min.js',
                        'app/controllers/admin/energy/sensorSelect.min.js?rev=6d465f266c',
                        'app/controllers/admin/energy/index.min.js?rev=4313f76e6d'
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
                    'app/services/project.min.js?rev=253595453a',
                    'app/services/energycategory.min.js?rev=0c6109038d',
                    'app/services/energycategory.min.js?rev=0c6109038d',
                    'app/services/sensor.min.js?rev=7102ffba10'
                ]);
            }]
        }
    }).state('admin.energycategory.info', {
        url: '/info',
        templateUrl: 'templates/admin/energycategory/info.html?rev=717bcc2be9',
        data: {
            projectHide: true,
            title: '能耗配置'
        },
        controller: 'energycategoryinfo',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    static + 'libs/angular-utf8-base64-0.0.5/angular-utf8-base64.min.js',
                    'app/controllers/admin/energycategory/info.min.js?rev=63682a71f7'
                ]);
            }]
        }
    }).state('admin.energycategory.add', {
        url: '/add',
        templateUrl: 'templates/admin/energycategory/add.html?rev=7a3d3438ff',
        data: {
            projectHide: true,
            title: '添加配置'
        },
        controller: 'energycategoryadd',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    static + 'libs/angular-utf8-base64-0.0.5/angular-utf8-base64.min.js',
                    'app/controllers/admin/energycategory/add.min.js?rev=e67f98093e'
                ]);
            }]
        }
    }).state('admin.energycategory.update', {
        url: '/update/:id',
        templateUrl: 'templates/admin/energycategory/update.html?rev=4347c5d585',
        data: {
            projectHide: true,
            title: '编辑配置'
        },
        controller: 'energycategoryupdate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    static + 'libs/angular-utf8-base64-0.0.5/angular-utf8-base64.min.js',
                    'app/controllers/admin/energycategory/update.min.js?rev=a80b769c54'
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
                return $ocLazyLoad.load([{
                    insertBefore: '#load_styles_before',
                    files: [
                        static + 'libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.css',
                        static + 'libs/angular-xeditable-0.2.0/dist/css/xeditable.min.css'
                    ]
                }, {
                    files: [
                        static + 'libs/angular-ui-tree-2.17.0/dist/angular-ui-tree.min.js',
                        static + 'libs/angular-xeditable-0.2.0/dist/js/xeditable.min.js',
                        static + 'libs/ngUpload-0.5.18/ng-upload.min.js',
                        'app/services/building.min.js?rev=ee8f76352d',
                        'app/services/sensor.min.js?rev=7102ffba10'
                    ]
                }]);
            }]
        }
    }).state('admin.sensor.info', {
        url: '/info',
        templateUrl: 'templates/admin/sensor/info.html?rev=bc72f55ece',
        data: {
            title: '传感器管理'
        },
        controller: 'SensorIndex',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/driver.min.js?rev=c8c64edb7b',
                    'app/services/control.min.js?rev=9fbeff12b2',
                    'app/services/sensorAttrib.min.js?rev=9586d9286d',
                    'app/controllers/admin/sensor/sensorSync.min.js?rev=84b05a344b',
                    'app/controllers/admin/sensor/sensorAttribute.min.js?rev=c82cd0abe3',
                    'app/controllers/admin/sensor/info.min.js?rev=1ef9d95299',
                    'app/directives/jstree.min.js?rev=2a332f4b56'
                ]);
            }]
        }
    }).state('admin.sensor.create', {
        url: '/create/:building',
        templateUrl: 'templates/admin/sensor/create.html?rev=1d1fa86cef',
        data: {
            projectDisabled: true,
            title: '添加传感器'
        },
        controller: 'SensorCreate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/collector.min.js?rev=3f98049549',
                    'app/services/energy.min.js?rev=c613470cac',
                    'app/services/customer.min.js?rev=2feac33e8f',
                    'app/controllers/admin/sensor/create.min.js?rev=faf2dde51c'
                ]);
            }]
        }
    }).state('admin.sensor.edit', {
        url: '/edit/:id',
        templateUrl: 'templates/admin/sensor/edit.html?rev=d176d08040',
        data: {
            projectDisabled: true,
            title: '编辑传感器'
        },
        controller: 'SensorEdit',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/services/collector.min.js?rev=3f98049549',
                    'app/services/energy.min.js?rev=c613470cac',
                    'app/services/customer.min.js?rev=2feac33e8f',
                    'app/controllers/admin/sensor/edit.min.js?rev=38ed4bd438'
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
                    'app/services/project.min.js?rev=253595453a',
                    'app/services/eventcategory.min.js?rev=421a0b5075'
                ]);
            }]
        }
    }).state('admin.eventcategory.info', {
        url: '/info',
        templateUrl: 'templates/admin/eventcategory/info.html?rev=d2155b6165',
        data: {
            title: '事件配置'
        },
        controller: 'eventcategoryIndex',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/eventcategory/info.min.js?rev=18a8661b65'
                ]);
            }]
        }
    }).state('admin.eventcategory.add', {
        url: '/add',
        templateUrl: 'templates/admin/eventcategory/add.html?rev=2519e20be6',
        data: {
            projectDisabled: true,
            title: '事件添加'
        },
        controller: 'eventcategoryAdd',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/eventcategory/add.min.js?rev=fe75aaa93d'
                ]);
            }]
        }
    }).state('admin.eventcategory.update', {
        url: '/update/:id',
        templateUrl: 'templates/admin/eventcategory/update.html?rev=74495db792',
        data: {
            projectDisabled: true,
            title: '事件编辑'
        },
        controller: 'eventcategoryUpdate',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/eventcategory/update.min.js?rev=af965c06bb'
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
                        static + 'libs/angular-ui-grid-3.2.1/ui-grid.min.css'
                    ]
                }, {
                    files: [
                        static + 'libs/angular-ui-grid-3.2.1/ui-grid.min.js',
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
            projectHide: true,
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
        templateUrl: 'templates/admin/finance/record-in.html?rev=3bd7fa184c',
        data: {
            projectHide: true,
            title: '收入'
        },
        controller: 'Finance.record.in',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/record-in.min.js?rev=c600714327'
                ]);
            }]
        }
    }).state('admin.finance.record.in.project', {
        url: '/:projectid',
        data: {
            projectHide: true,
            title: '项目'
        },
        views: {
            '@admin.finance.record': {
                templateUrl: 'templates/admin/finance/record-in.html?rev=3bd7fa184c',
                controller: 'Finance.record.in',
                controllerAs: 'self'
            }
        }
    }).state('admin.finance.record.out', {
        url: '/out',
        templateUrl: 'templates/admin/finance/record-out.html?rev=e94d940be3',
        data: {
            projectHide: true,
            title: '支出'
        },
        controller: 'Finance.record.out',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/record-out.min.js?rev=0c3bd4d3e6'
                ]);
            }]
        }
    }).state('admin.finance.record.out.project', {
        url: '/:projectid',
        data: {
            projectHide: true,
            title: '项目'
        },
        views: {
            '@admin.finance.record': {
                templateUrl: 'templates/admin/finance/record-out.html?rev=e94d940be3',
                controller: 'Finance.record.out',
                controllerAs: 'self'
            }
        }
    }).state('admin.finance.record.out.project.detail', {
        url: '/:orderno',
        data: {
            projectHide: true,
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
                    'app/controllers/admin/finance/record-detail.min.js?rev=bfc84e6e46'
                ]);
            }]
        }
    }).state('admin.finance.card', {
        url: '/card',
        templateUrl: 'templates/admin/finance/card.html?rev=2b2d672cc4',
        data: {
            projectHide: true,
            title: '银行卡管理'
        },
        controller: 'Finance.card',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/card.min.js?rev=581b98ad88'
                ]);
            }]
        }
    }).state('admin.finance.card.detail', {
        url: '/:id',
        data: {
            projectHide: true,
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
            projectHide: true,
            title: '项目列表'
        },
        controller: 'Finance.project.list',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/finance/project/list.min.js?rev=956c697fde'
                ]);
            }]
        }
    }).state('admin.finance.project.info', {
        url: '/:projectid',
        data: {
            projectHide: true,
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
                    'app/controllers/admin/finance/project/index.min.js?rev=3389b1b63d'
                ]);
            }]
        }
    }).state('admin.finance.project.info.record', {
        url: '/record/:tab',
        data: {
            projectHide: true,
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
                    'app/controllers/admin/finance/project/record.min.js?rev=c7177dca1b'
                ]);
            }]
        }
    }).state('admin.finance.project.info.withdraw', {
        url: '/withdraw',
        data: {
            projectHide: true,
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
                    'app/controllers/admin/finance/project/withdraw.min.js?rev=2ddf0eef3b'
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
                        '//at.alicdn.com/t/font_1470990232_7195055.css'
                    ]
                }, {
                    files: [
                        'app/directives/datetimepicker.min.js?rev=3c390403e5',
                        'app/directives/auto-height.min.js?rev=b13007069a',
                        'app/directives/modal-download.min.js?rev=c526f60567',
                        'app/controllers/admin/property/withdraw-detail.min.js?rev=93c73b0683',
                        'app/controllers/admin/property/record-success.min.js?rev=4cd9fac828'
                    ]
                }]);
            }]
        }
    }).state('admin.property.index', {
        url: '/index',
        templateUrl: 'templates/admin/property/index.html?rev=495f2878b9',
        data: {
            title: '物业财务'
        },
        controller: 'Property.index',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/directives/distpicker.min.js?rev=47a8e0bc0d',
                    'app/controllers/admin/property/index.min.js?rev=b6d4684953'
                ]);
            }]
        }
    }).state('admin.property.withdraw', {
        url: '/withdraw',
        templateUrl: 'templates/admin/property/withdraw.html?rev=b047d33fb9',
        data: {
            title: '申请提现'
        },
        controller: 'Property.withdraw',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/property/withdraw.min.js?rev=ad45147f47'
                ]);
            }]
        }
    }).state('admin.property.record', {
        url: '/record/:tab/{category}|{startDate}|{endDate}|{dateRange}',
        templateUrl: 'templates/admin/property/record.html?rev=29bc90d45b',
        data: {
            title: '收支明细'
        },
        controller: 'Property.record',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/property/record.min.js?rev=78ec18a2ad'
                ]);
            }]
        }
    }).state('admin.property.statement', {
        url: '/statement/:tab',
        templateUrl: 'templates/admin/property/statement.html?rev=23aa150c42',
        data: {
            title: '对账单'
        },
        controller: 'Property.statement',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/property/statement.min.js?rev=f3cc4797c3'
                ]);
            }]
        }
    }).state('admin.property.consume', {
        url: '/consume',
        templateUrl: 'templates/admin/property/consume.html?rev=16a15b0e73',
        data: {
            title: '消耗明细'
        },
        controller: 'Property.consume',
        controllerAs: 'self',
        resolve: {
            deps: ["$ocLazyLoad", function($ocLazyLoad) {
                return $ocLazyLoad.load([
                    'app/controllers/admin/property/consume.min.js?rev=7b8a1fbd3c'
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