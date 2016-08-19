angular.module('app').directive('datetimepicker', ["$timeout", "$ocLazyLoad", function($timeout, $ocLazyLoad) {

    var pluginLoad = $ocLazyLoad.load([{
        insertBefore: '#load_styles_before',
        files: ['https://static.cloudenergy.me/libs/eonasdan-bootstrap-datetimepicker-4.17.37/build/css/bootstrap-datetimepicker.min.css']
    }, {
        files: ['https://static.cloudenergy.me/libs/eonasdan-bootstrap-datetimepicker-4.17.37/build/js/bootstrap-datetimepicker.min.js']
    }]);

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ctrl) {
            pluginLoad.then(function() {

                var opt = {
                        maxDateTo: undefined, //最大至
                        minDateTo: undefined, //最小至
                        maxRangeTo: undefined, //最大范围至
                        minRangeTo: undefined, //最小范围至
                        rangeDay: undefined //限制范围（天）
                    },
                    options = {
                        locale: 'zh-CN',
                        format: 'YYYY-MM-DD',
                        maxDate: new Date(),
                        widgetPositioning: {
                            horizontal: 'right'
                        }
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

                scope.$watch(attrs.datetimepicker, function(val) {

                    if (!attrs.datetimepicker || angular.isDefined(val)) {

                        angular.isObject(val) && angular.extend(options, val);

                        angular.forEach(opt, function(val, key) {
                            opt[key] = options[key];
                            delete options[key];
                        });

                        element.datetimepicker(options);

                        !options.inline && $timeout(function() {

                            var elementData = element.data('DateTimePicker'),
                                linkage = function(nowDate) {
                                    if (!opt.changed) {
                                        opt.maxDateTo = opt.maxDateTo && $(opt.maxDateTo).data('DateTimePicker');
                                        opt.minDateTo = opt.minDateTo && $(opt.minDateTo).data('DateTimePicker');
                                        opt.maxRangeTo = opt.maxRangeTo && $(opt.maxRangeTo).data('DateTimePicker');
                                        opt.minRangeTo = opt.minRangeTo && $(opt.minRangeTo).data('DateTimePicker');
                                        opt.changed = true;
                                    }
                                    if (opt.maxDateTo) {
                                        opt.maxDateTo.minDate(nowDate);
                                        opt.maxDateTo.date() && elementData.maxDate(opt.maxDateTo.date());
                                    }
                                    if (opt.minDateTo) {
                                        opt.minDateTo.maxDate(nowDate);
                                        opt.minDateTo.date() && elementData.minDate(opt.minDateTo.date());
                                    }
                                    if (opt.maxRangeTo && opt.rangeDay) {
                                        opt.maxRangeTo.date(moment(Math.max(elementData.date(), Math.min(moment(nowDate).add(opt.rangeDay, 'days'), opt.maxRangeTo.date(), moment()))));
                                    }
                                    if (opt.minRangeTo && opt.rangeDay) {
                                        opt.minRangeTo.date(moment(Math.min(elementData.date(), Math.max(moment(nowDate).subtract(opt.rangeDay, 'days'), opt.minRangeTo.date()))));
                                    }
                                };

                            element.off('dp.change').on('dp.change', function(event) {
                                ctrl && ctrl.$setViewValue(event.target.value);
                                linkage(event.date);
                            }).off('dp.show').on('dp.show', function(event) {
                                (element.is('input') ? element.parent() : element).addClass('focus');
                                linkage(elementData.date());
                            }).off('dp.hide').on('dp.hide', function() {
                                (element.is('input') ? element.parent() : element).removeClass('focus');
                            });

                        });

                    }
                });
            });
        }
    };

}]);