angular.module('app').factory('Building', ["$resource", "Config", function ($resource, Config) {
    return $resource(Config.API + '/building', {}, {
        //            multi: { method: 'GET', isArray: true },
        //            create: { method: 'POST' },
        //            read: { method: 'GET', url: Config.apiBase + 'building/:id' },
        //            update: { method: 'PUT', url: Config.apiBase + 'building/:id' },
        //            remove: { method: 'DELETE', url: Config.apiBase + 'building/:id'
        info: {
            method: 'POST',
            url: Config.API + '/building/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/building/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/building/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/building/delete'
        }
    });
}]);