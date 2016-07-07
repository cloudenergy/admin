angular.module('app').factory('Control', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.apiBase + 'control', {}, {
        Send: {
            method: 'POST',
            url: Config.API + '/control/send'
        },
        SensorCommand: {
            method: 'POST',
            url: Config.API + '/control/sensorcommand'
        }
    })
}]);