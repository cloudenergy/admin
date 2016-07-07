angular.module('app').controller('admin', ["$scope", "$cookies", "$q", "$state", "$localStorage", "SettingMenu", function($scope, $cookies, $q, $state, $localStorage, SettingMenu) {

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
            driver: 'wrench',
            appidsecret: 'eye',
            device: 'plug',
            finance: 'dollar',
            property: 'dollar'
        },
        promiseAccount = $q.defer(),
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

    if ($localStorage.layout) {
        self.app.layout = $localStorage.layout;
    } else {
        $localStorage.layout = self.app.layout;
    }

    $scope.$watch('self.app.layout', function() {
        $localStorage.layout = self.app.layout;
    }, true);

    $scope.$on('$includeContentRequested', function(event, src) {
        if (/^templates\/common/.test(src)) {
            self.layoutLoaded[src] = $q.defer();
            promiseList.push(self.layoutLoaded[src].promise);
        }
    });

    $scope.$on('$includeContentLoaded', function(event, src) {
        /^templates\/common/.test(src) && self.layoutLoaded[src] && self.layoutLoaded[src].resolve();
    });

    $q.all(promiseList.concat([promiseAccount.promise])).then(function() {
        self.layoutLoaded = true
    });

    $scope.user = {
        avatar: 'images/avatar.jpg',
        name: $cookies.get('user')
    };

    SettingMenu(function(menu) {
        promiseAccount.resolve();
        angular.forEach(self.menu = menu, function(item) {
            item.prefix = /^(\w+\.\w+)?/.exec(item.state)[0] || '';
            item.icon = icons[item.state.split('.')[1]] || 'circle';
        });
        self.menu.active = function(state) {
            return /(\w+\.\w+)?/.exec(state)[0] === /(\w+\.\w+)?/.exec($state.$current.name)[0]
        };
    });

}]);