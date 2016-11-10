angular.module('app').factory('Auth', ["$location", "$cookies", "$q", "$api", "API", function ($location, $cookies, $q, $api, API) {
    return {
        Check: function () {

            var params, success, error,
                promiseList = [],
                user = EMAPP.Account._id,
                path = API.ParentLocation($location.path());

            if (angular.isObject(arguments[0])) {
                params = arguments[0];
                success = arguments[1];
                error = arguments[2];
            } else {
                params = [];
                success = arguments[0];
                error = arguments[1];
            }

            promiseList.push($api.auth.check({
                path: $location.$$path,
                u: user
            }).$promise);

            angular.forEach(params, function (item) {
                item && promiseList.push($api.auth.check({
                    path: path + item.url,
                    u: user
                }, function () {
                    item.isEnable = true;
                }).$promise);
            });

            return $q.all(promiseList).then(success || angular.noop, error || angular.noop);

        }
    };
}]);