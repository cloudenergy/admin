angular.module('app').factory('Payment', ["$resource", "Config", function ($resource, Config) {
    return $resource(Config.API + '/payment', {}, {
        payment: {
            method: 'POST',
            url: Config.API + '/payment/payment'
        },
        charge: {
            method: 'POST',
            url: Config.API + '/payment/charge'
        },
        reversal: {
            method: 'POST',
            url: Config.API + '/payment/reversal'
        }
    });
}]);