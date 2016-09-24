angular.module('app').factory('SensorAttrib', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.apiBase + 'sensorattrib', {}, {
        info: {
            method: 'POST',
            url: Config.API + '/sensorattrib/info'
        },
        //add: { method: 'POST', url: Config.API+'/sensorattrib/add'},
        update: {
            method: 'POST',
            url: Config.API + '/sensorattrib/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/sensorattrib/delete'
        }
    })
}]);