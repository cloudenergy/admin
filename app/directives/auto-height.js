angular.module('app').directive('autoHeight', function() {
    return {
        restrict: 'A',
        scope: {
            height: '=*autoHeight'
        },
        link: function(scope, element, attrs, ctrl) {
            function resize() {
                element.height($(window).innerHeight() - element.offset().top - (scope.height ? parseInt(scope.height) : 15));
            }
            scope.$watch(function() {
                return scope.height
            }, resize);
            $(window).bind('resize', resize);
            scope.$on('$destroy', function() {
                $(window).unbind('resize', resize);
            });
        }
    }
});