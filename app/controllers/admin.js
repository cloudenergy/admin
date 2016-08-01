angular.module('app').controller('admin', ["$scope", "$rootScope", "$cookies", "$q", "$state", "$localStorage", "$api", function($scope, $rootScope, $cookies, $q, $state, $localStorage, $api) {

    var self = this,
        icons = {
            dashboard: 'home',
            character: 'user',
            project: 'archive',
            account: 'briefcase',
            billingservice: 'calculator',
            urlpath: 'compass',
            building: 'building',
            department: 'diamond',
            customer: 'yen',
            eventcategory: 'envelope',
            energycategory: 'database',
            energy: 'fire',
            sensor: 'dashboard',
            collector: 'tasks',
            appidsecret: 'eye',
            finance: 'dollar',
            property: 'dollar'
        },
        menu = [{
            title: '首页',
            state: 'admin.dashboard',
            ignore: true
        }, {
            title: '角色管理',
            state: 'admin.character.info'
        }, {
            title: '项目管理',
            state: 'admin.project.info'
        }, {
            title: 'APPID.SECRET',
            state: 'admin.appidsecret.info'
        }, {
            title: '账户管理',
            state: 'admin.account.info'
        }, {
            title: '计费策略',
            state: 'admin.billingservice.info'
        }, {
            title: '地址管理',
            state: 'admin.urlpath.info'
        }, {
            title: '建筑管理',
            state: 'admin.building.info'
        }, {
            title: '户管理',
            state: 'admin.department.info'
        }, {
            title: '社会属性',
            state: 'admin.customer.index'
        }, {
            title: '采集器管理',
            state: 'admin.collector.info'
        }, {
            title: '能耗配置',
            state: 'admin.energycategory.info'
        }, {
            title: '能耗分类',
            state: 'admin.energy.index'
        }, {
            title: '传感器管理',
            state: 'admin.sensor.info'
        }, {
            title: '事件配置',
            state: 'admin.eventcategory.info'
        }, {
            title: '平台财务',
            state: 'admin.finance.index'
        }, {
            title: '物业财务',
            state: 'admin.property.index'
        }],
        promiseList = [];

    self.layoutLoaded = {};

    self.app = {
        name: document.title,
        year: (new Date()).getFullYear(),
        layout: {
            isSmallSidebar: false,
            isChatOpen: false,
            isFixedHeader: true,
            isFixedFooter: false,
            isBoxed: false,
            isStaticSidebar: false,
            isRightSidebar: false,
            isOffscreenOpen: false,
            isConversationOpen: false,
            isQuickLaunch: false,
            sidebarTheme: '',
            headerTheme: ''
        },
        isMessageOpen: false,
        isConfigOpen: false
    };

    $scope.user = {
        avatar: 'images/avatar.jpg',
        name: $cookies.get('user')
    };

    $scope.wwwLink = location.origin.replace('preadmin.', 'pre.').replace('admin.', 'www.');

    if ($localStorage.layout) {
        self.app.layout = $localStorage.layout;
    } else {
        $localStorage.layout = self.app.layout;
    }

    $scope.$watch('self.app.layout', function() {
        $localStorage.layout = self.app.layout;
    });

    $scope.$on('$includeContentRequested', function(event, src) {
        if (/^templates\/common/.test(src)) {
            self.layoutLoaded[src] = $q.defer();
            promiseList.push(self.layoutLoaded[src].promise);
        }
    });

    $scope.$on('$includeContentLoaded', function(event, src) {
        /^templates\/common/.test(src) && self.layoutLoaded[src] && self.layoutLoaded[src].resolve();
    });

    $q.all(promiseList.concat([
        $api.account.info({
            id: $cookies.get('user')
        }, function(data) {

            EMAPP.Account = data.result || {};
            EMAPP.Rule = {};

            (function each(rule, level, keys) {
                angular.forEach(rule, function(item, key) {
                    if (key !== 'leaf') {
                        if (level === 0) {
                            each(item, level + 1, [key]);
                        } else {
                            if (item.leaf) {
                                EMAPP.Rule[keys.concat([key]).join('.')] = true;
                            } else {
                                each(item, level + 1, keys.concat([key]));
                            }
                        }
                    }
                });
            }(EMAPP.Account.character.rule['/'], 0));

            angular.forEach(menu, function(item) {
                if (item.ignore || EMAPP.Rule[item.state]) {
                    item.prefix = /^(\w+\.\w+)?/.exec(item.state)[0] || '';
                    item.icon = icons[item.state.split('.')[1]] || 'circle';
                    this.push(item);
                }
            }, self.menu = []);

        }).$promise,
        $api.project.info(function(data) {
            EMAPP.Project = angular.isArray(data.result) ? data.result : data.result && [data.result] || [];
        }).$promise
    ])).then(function() {

        if (!EMAPP.Project.length) return;

        var KEY_PROJECT = EMAPP.Account._id + '_root_project_selected',
            selected = $localStorage[KEY_PROJECT];

        angular.forEach(EMAPP.Project, function(item) {
            EMAPP.Project[item._id] = item;
            if (selected === item._id) {
                EMAPP.Project.selected = item;
            }
        });

        EMAPP.Project.selected = EMAPP.Project.selected || EMAPP.Project[0] || {};
        $rootScope.Project = EMAPP.Project;

        $rootScope.$watch('Project.selected', function(item) {
            $localStorage[KEY_PROJECT] = item._id;
        });

        self.layoutLoaded = true;

    });

}]);