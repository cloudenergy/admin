angular.module('app').factory('Auth', ["$http", function($http) {
    return {
        login: function() {
            return $http.get('index.html');
        }
    };
}]);