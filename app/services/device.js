angular.module('app').factory('Device', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.apiBase + 'device', {}, {
        type: {
            method: 'POST',
            url: Config.API + '/device/type'
        }
    })
}]);