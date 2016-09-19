angular.module('app').factory('Driver', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.API + '/driver', {}, {
        enum: {
            method: 'POST',
            url: Config.API + '/driver/enum'
        }
    })
}]);