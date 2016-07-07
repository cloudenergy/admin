window.EMAPP = angular.module('app', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
    'ui.utils',
    'oc.lazyLoad',
    'ngStorage'
]).constant('Config', {
    pageSize: 20,
    popPageSize: 8,
    API: localStorage.testapi ? '/testapi' : '/api'
}).run(["$rootScope", "$cookies", "$state", "$stateParams", "Config", function($rootScope, $cookies, $state, $stateParams, Config) {
    document.title = '云能源管理平台';
    $rootScope.$cookies = $cookies;
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.pageSize = Config.pageSize;
    $rootScope.popPageSize = Config.popPageSize;
    angular.forEach(['user', 'token'], function(key) {
        $cookies.__defineGetter__(key, function() {
            return this.get(key);
        });
    });
}]);
angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});