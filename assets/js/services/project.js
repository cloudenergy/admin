angular.module('app').factory('Project', ["$resource", "Config", function ($resource, Config) {
    return $resource(Config.API + '/project', {}, {
        //            multi: { method: 'GET', isArray: true },
        //            create: { method: 'POST' },
        //            read: { method: 'GET', url: Config.apiBase + 'building/:id' },
        //            update: { method: 'PUT', url: Config.apiBase + 'building/:id' },
        //            remove: { method: 'DELETE', url: Config.apiBase + 'building/:id'
        info: {
            method: 'POST',
            url: Config.API + '/project/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/project/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/project/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/project/delete'
        }
    });
}]);