angular.module('app').factory('Eventcategory', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.API + '/eventcategory', {}, {
        info: {
            method: 'POST',
            url: Config.API + '/event/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/eventcategory/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/event/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/eventcategory/delete'
        }
    })
}]);