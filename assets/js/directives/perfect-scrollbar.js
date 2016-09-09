angular.module('app').directive('perfectScrollbar', ["$ocLazyLoad", "$timeout", function($ocLazyLoad, $timeout) {

    var pluginLoad = $ocLazyLoad.load([{
        insertBefore: '#load_styles_before',
        files: ['https://static.cloudenergy.me/libs/perfect-scrollbar-0.6.11/css/perfect-scrollbar.min.css']
    }, {
        files: ['https://static.cloudenergy.me/libs/perfect-scrollbar-0.6.11/js/perfect-scrollbar.jquery.min.js']
    }]);

    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            pluginLoad.then(function() {
                scope.$watch(attrs.perfectScrollbar, function(options) {
                    options = angular.isObject(options) && angular.extend({}, options) || {};
                    $timeout(function() {
                        element.perfectScrollbar(options);
                        element.data('perfectScrollbar') && element.perfectScrollbar('update');
                        element.data('perfectScrollbar', options);
                    });
                });
                scope.$watch(attrs.perfectScrollbarEvent, function(events) {
                    angular.forEach(events, function(fn, key) {
                        element.off(key);
                        angular.isFunction(fn) && element.on(key, fn);
                    });
                });
            });
        }
    };

}]);