'use strict';
/*
 * navbar breadcrumb
 */
angular.module('app').directive('breadcrumb', function() {
    return {
        restrict: 'A',
        scope: false,
        controllerAs: 'self',
        controller: ["$scope", "$state", "$stateParams", function($scope, $state, $stateParams) {
            var self = this,
                watchs = {};
            $scope.$watch(function() {
                return $state.$current
            }, function(current) {
                self.list = [];
                (function each(parent, current) {
                    if (parent) {
                        if (parent.abstract) {
                            if (parent.data && parent.data.redirect && parent.data.redirect !== current.name) {
                                watchs[parent.name] && watchs[parent.name]();
                                watchs[parent.name] = $scope.$watch(function() {
                                    return parent.data.title
                                }, function(value, redirect) {
                                    if (value && (redirect = $state.get(parent.data.redirect) || {}).data) {
                                        redirect.data.title = value
                                    }
                                });
                                each($state.get(parent.data.redirect), current);
                            }
                        } else {
                            if (parent.data && parent.data.title) {
                                self.list.unshift({
                                    __title: parent.data.title,
                                    title: parent.data.title,
                                    params: JSON.stringify($stateParams),
                                    state: parent.name
                                });
                                watchs[parent.name] && watchs[parent.name]();
                                watchs[parent.name] = $scope.$watch(function() {
                                    return parent.data.title
                                }, function(value) {
                                    angular.forEach(self.list, function(item) {
                                        if (item.state === parent.name) {
                                            item.title = value || item.__title
                                        }
                                    })
                                });
                            }
                            /\./.test(parent.name) && each($state.get(parent.name.replace(/\.\w+$/, '')), parent);
                        }
                    }
                }(current, {}));
            });
        }]
    };
});