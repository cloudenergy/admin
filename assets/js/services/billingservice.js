angular.module('app').factory('BillingService', ["$resource", "Config", function ($resource, Config) {
    return $resource(Config.API + '/billingservice', {}, {
        info: {
            method: 'POST',
            url: Config.API + '/billingservice/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/billingservice/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/billingservice/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/billingservice/delete'
        }
    });
}]);