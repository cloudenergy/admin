angular.module('app').factory('Account', ["$resource", "Config", function ($resource, Config) {
    return $resource(Config.API + '/account', {}, {
        info: {
            method: 'POST',
            url: Config.API + '/account/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/account/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/account/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/account/delete'
        }
    });
}]);