angular.module('app').factory('Collector', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.apiBase + 'collector', {}, {
        //            multi: { method: 'GET', isArray: true },
        //            create: { method: 'POST' },
        //            read: { method: 'GET', url: Config.apiBase + 'device/:id' },
        //            update: { method: 'PUT', url: Config.apiBase + 'device/:id' },
        //            remove: { method: 'DELETE', url: Config.apiBase + 'device/:id' }
        info: {
            method: 'POST',
            url: Config.API + '/collector/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/collector/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/collector/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/collector/delete'
        }
    })
}]);