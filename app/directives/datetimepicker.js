angular.module('app').directive('datetimepicker', ["$timeout", "$ocLazyLoad", function($timeout, $ocLazyLoad) {

    var pluginLoad = $ocLazyLoad.load([{
        insertBefore: '#load_styles_before',
        files: ['http://static.cloudenergy.me/libs/eonasdan-bootstrap-datetimepicker-4.17.37/build/css/bootstrap-datetimepicker.min.css']
    }, {
        files: ['http://static.cloudenergy.me/libs/eonasdan-bootstrap-datetimepicker-4.17.37/build/js/bootstrap-datetimepicker.min.js']
    }]);

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ctrl) {
            pluginLoad.then(function() {

                var linkLeft,
                    linkRight,
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

                        linkLeft = options.linkLeft && $(options.linkLeft);
                        linkRight = options.linkRight && $(options.linkRight);

                        delete options.linkLeft;
                        delete options.linkRight;

                        element.datetimepicker(options);

                        !options.inline && $timeout(function() {

                            var linkLeftData = linkLeft && linkLeft.length && linkLeft.data('DateTimePicker'),
                                linkRightData = linkRight && linkRight.length && linkRight.data('DateTimePicker'),
                                elementData = element.data('DateTimePicker'),
                                rangeDate = function(now, rangeDay) {
                                    if (linkLeftData) {
                                        linkLeftData.maxDate(now);
                                        linkLeftData.date() && elementData.minDate(linkLeftData.date());
                                        rangeDay && linkLeftData.date(moment(Math.max(moment(now).subtract(rangeDay, 'days'), linkLeftData.date())));
                                    }
                                    if (linkRightData) {
                                        linkRightData.minDate(now);
                                        linkRightData.date() && elementData.maxDate(linkRightData.date());
                                        rangeDay && linkRightData.date(moment(Math.min(moment(now).add(rangeDay, 'days'), linkRightData.date(), moment())));
                                    }
                                };

                            element.off('dp.change').on('dp.change', function(event) {
                                ctrl && ctrl.$setViewValue(event.target.value);
                                rangeDate(event.date, attrs.rangeDay && scope.$eval(attrs.rangeDay));
                            }).off('dp.show').on('dp.show', function(event) {
                                (element.is('input') ? element.parent() : element).addClass('focus');
                                rangeDate(elementData.date(), attrs.rangeDay && scope.$eval(attrs.rangeDay));
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