angular.module('app').factory('UrlPath', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.API + '/urlpath', {}, {
        //            multi: { method: 'GET', isArray: true },
        //            create: { method: 'POST' },
        //            read: { method: 'GET', url: Config.apiBase + 'building/:id' },
        //            update: { method: 'PUT', url: Config.apiBase + 'building/:id' },
        //            remove: { method: 'DELETE', url: Config.apiBase + 'building/:id'
        info: {
            method: 'POST',
            url: Config.API + '/urlpath/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/urlpath/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/urlpath/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/urlpath/delete'
        }
    })
}]);