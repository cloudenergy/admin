angular.module('app').factory('Customer', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.apiBase + 'customer', {}, {
        //            multi: { method: 'GET', isArray: true },
        //            create: { method: 'POST' },
        //            read: { method: 'GET', url: Config.apiBase + 'customer/:id' },
        //            update: { method: 'PUT', url: Config.apiBase + 'customer/:id' },
        //            remove: { method: 'DELETE', url: Config.apiBase + 'customer/:id' }
        info: {
            method: 'POST',
            url: Config.API + '/customer/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/customer/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/customer/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/customer/delete'
        }
    })
}]);