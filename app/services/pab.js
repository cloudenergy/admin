EMAPP.factory('Pab', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.API + '/pab', {}, {
        info: {
            method: 'POST',
            url: Config.API + '/pab/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/pab/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/pab/edit'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/pab/delete'
        }
    })
}]);