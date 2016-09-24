angular.module('app').factory('BillingAccount', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.API + '/billingaccount', {}, {
        //            multi: { method: 'GET', isArray: true },
        //            create: { method: 'POST' },
        //            read: { method: 'GET', url: Config.apiBase + 'building/:id' },
        //            update: { method: 'PUT', url: Config.apiBase + 'building/:id' },
        //            remove: { method: 'DELETE', url: Config.apiBase + 'building/:id'
        info: {
            method: 'POST',
            url: Config.API + '/billingaccount/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/billingaccount/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/billingaccount/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/billingaccount/delete'
        }
    })
}]);