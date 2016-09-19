angular.module('app').factory('Energycategory', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.API + '/energycategory', {}, {
        info: {
            method: 'POST',
            url: Config.API + '/energycategory/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/energycategory/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/energycategory/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/energycategory/delete'
        }
    })
}]);