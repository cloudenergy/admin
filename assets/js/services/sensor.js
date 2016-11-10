angular.module('app').factory('Sensor', ["$resource", "Config", function ($resource, Config) {
    return $resource(Config.apiBase + 'sensor', {}, {
        //            multi: { method: 'GET', isArray: true },
        //            create: { method: 'POST' },
        //            read: { method: 'GET', url: Config.apiBase + 'sensor/:id' },
        //            update: { method: 'PUT', url: Config.apiBase + 'sensor/:id' },
        //            remove: { method: 'DELETE', url: Config.apiBase + 'sensor/:id' }
        info: {
            method: 'POST',
            url: Config.API + '/sensor/info'
        },
        channelinfo: {
            method: 'POST',
            url: Config.API + '/sensorchannel/info'
        },
        syncdata: {
            method: 'POST',
            url: Config.API + '/sensorchannel/syncdata'
        },
        add: {
            method: 'POST',
            url: Config.API + '/sensorchannel/add'
        },
        update: {
            method: 'POST',
            url: Config.API + '/sensorchannel/update'
        },
        delete: {
            method: 'POST',
            url: Config.API + '/sensorchannel/delete'
        }
    });
}]);