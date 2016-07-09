angular.module('app').directive('distpicker', ["$ocLazyLoad", "$timeout", function($ocLazyLoad, $timeout) {

    var pluginLoad = $ocLazyLoad.load([{
        serie: true,
        files: [
            'https://static.cloudenergy.me/libs/distpicker-1.0.4/dist/distpicker.data.min.js',
            'https://static.cloudenergy.me/libs/distpicker-1.0.4/dist/distpicker.min.js'
        ]
    }]);

    return {
        // priority: 10,
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            pluginLoad.then(function() {

                var options = {},
                    trigger = function() {
                        element.children('select').eq(0).trigger('change.distpicker.province');
                        element.children('select').eq(1).trigger('change.distpicker.city');
                        element.children('select').eq(2).trigger('change.distpicker.district');
                    };

                angular.forEach(element.data(), function(val, key) {
                    if (!/^\$/.test(key)) {
                        if (/^\{.*\}$/.test(val) || /^\[.*\]$/.test(val)) {
                            eval('this[key]=' + val);
                        } else {
                            this[key] = val;
                        }
                    }
                }, options);

                scope.$watch(attrs.distpicker, function(val) {
                    if (!attrs.distpicker || angular.isDefined(val)) {
                        angular.isObject(val) && angular.extend(options, val);
                        $timeout(function() {
                            element.distpicker(options);
                            trigger();
                        });
                    }
                });

                element.bind('change.distpicker', trigger);

            });
        }
    };

}]).directive('distpickerProvince', function() {
    return {
        restrict: 'A',
        require: '^ngModel',
        link: function(scope, element, attrs, ctrl) {
            element.bind('change.distpicker.province', function() {
                ctrl.$setViewValue(this.value);
            });
        }
    };
}).directive('distpickerCity', function() {
    return {
        restrict: 'A',
        require: '^ngModel',
        link: function(scope, element, attrs, ctrl) {
            element.bind('change.distpicker.city', function() {
                ctrl.$setViewValue(this.value);
            });
        }
    };
}).directive('distpickerDistrict', function() {
    return {
        restrict: 'A',
        require: '^ngModel',
        link: function(scope, element, attrs, ctrl) {
            element.bind('change.distpicker.district', function() {
                ctrl.$setViewValue(this.value);
            });
        }
    };
});