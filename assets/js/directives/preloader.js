'use strict';
/*
 * preloader - loading indicator directive
 */
(function (count, timeout) {
    angular.module('app').config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push(["$q", function ($q) {
            function response(result) {
                count--;
                return result.status === 200 ? result : $q.reject(result);
            }
            return {
                request: function (request) {
                    count++;
                    return request;
                },
                requestError: function (request) {
                    return $q.reject(request);
                },
                response: response,
                responseError: response
            };
        }]);
    }]).directive('preloader', ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope) {
                scope.$watch(function () {
                    return count;
                }, function (val) {
                    timeout && $timeout.cancel(timeout);
                    if (val === 0) {
                        timeout = $timeout(function () {
                            scope.preloader = val;
                        }, 10);
                    } else {
                        scope.preloader = val;
                    }
                });
            }
        };
    }]);
}(0));