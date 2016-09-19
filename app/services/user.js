/**
 * Created with JetBrains WebStorm.
 * User: christozhou
 * Date: 14-6-5
 * Time: 下午10:04
 * To change this template use File | Settings | File Templates.
 */
angular.module('app').factory('User', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.apiBase + 'user', {}, {
        multi: {
            method: 'GET',
            isArray: true
        },
        create: {
            method: 'POST'
        },
        read: {
            method: 'GET',
            url: Config.apiBase + 'user/:id'
        },
        update: {
            method: 'PUT',
            url: Config.apiBase + 'user/:id'
        },
        remove: {
            method: 'DELETE',
            url: Config.apiBase + 'user/:id'
        }
    })
}]);