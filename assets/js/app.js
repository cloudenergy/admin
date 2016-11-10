window.EMAPP = angular.module('app', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngStorage',
    'ngMd5',
    'ui.router',
    'ui.utils',
    'oc.lazyLoad'
]).constant('Config', {
    pageSize: 15,
    popPageSize: 8,
    API: localStorage.testapi ? '/testapi' : '/api'
}).run(["$rootScope", "$cookies", "$state", "$stateParams", "Config", function ($rootScope, $cookies, $state, $stateParams, Config) {
    document.title = '智慧云能源管理平台';
    $rootScope.$cookies = $cookies;
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.pageSize = Config.pageSize;
    $rootScope.popPageSize = Config.popPageSize;
    angular.forEach(['user', 'token'], function (key) {
        $cookies.__defineGetter__(key, function () {
            return this.get(key);
        });
    });
}]);
angular.element(document).ready(function () {
    angular.bootstrap(document, ['app']);
});