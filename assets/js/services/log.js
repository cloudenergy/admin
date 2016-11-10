angular.module('app').factory('Log', ["$resource", "Config", function ($resource, Config) {
    return $resource(Config.API + '/log', {}, {
        charge: {
            method: 'POST',
            url: Config.API + '/log/charge'
        },
        account: {
            method: 'POST',
            url: Config.API + '/log/account'
        }
    });
}]);