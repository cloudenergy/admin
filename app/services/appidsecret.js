angular.module('app').factory('AppIDSecret', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.API + '/appidsecret', {}, {
        info: {
            method: 'POST',
            url: Config.API + '/appidsecret/info'
        },
        add: {
            method: 'POST',
            url: Config.API + '/appidsecret/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/appidsecret/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/appidsecret/delete'
        },
        apply: {
            method: 'POST',
            url: Config.API + '/appidsecret/apply'
        }
    })
}]);