angular.module('app').factory('Department', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.API + '/department', {}, {
        info: {
            method: 'POST',
            url: Config.API + '/department/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/department/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/department/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/department/delete'
        }
    })
}]);