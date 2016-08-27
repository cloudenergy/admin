angular.module('app').factory('Character', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.API + '/character', {}, {
        info: {
            method: 'POST',
            url: Config.API + '/character/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/character/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/character/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/character/delete'
        }
    })
}]);