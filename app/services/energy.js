angular.module('app').factory('Energy', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.apiBase + 'energy', {}, {
        //            multi: { method: 'GET', isArray: true },
        //            create: { method: 'POST' },
        //            read: { method: 'GET', url: Config.apiBase + 'energy/:id' },
        //            update: { method: 'PUT', url: Config.apiBase + 'energy/:id' },
        //            remove: { method: 'DELETE', url: Config.apiBase + 'energy/:id' }
        info: {
            method: 'POST',
            url: Config.API + '/energy/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/energy/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/energy/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/energy/delete'
        }
    })
}]);