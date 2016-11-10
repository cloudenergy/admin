angular.module('app').factory('Collector', ["$resource", "Config", function ($resource, Config) {
    return $resource(Config.apiBase + 'collector', {}, {
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
    });
}]);