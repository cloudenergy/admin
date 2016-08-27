angular.module('app').controller('login', ["$api", "$cookies", "$state", "UI", "md5", function($api, $cookies, $state, UI, md5) {

    var self = this,
        remember,
        domain = /cloudenergy\.me/.test(location.hostname) ? '.cloudenergy.me' : location.hostname,
        validate = function(data) {

            data = data && data.result || {};

            angular.forEach(['token', 'user'], function(key) {
                data[key] && $cookies.put(key, data[key], {
                    path: '/',
                    domain: domain,
                    expires: remember && moment().add(1, 'months')._d || undefined
                });
            });

            if (data.token) {
                $state.go('admin.dashboard');
            } else {
                $state.go('login');
                UI.AlertError(data.message, '登录失败');
            }

        };

    self.login = function() {

        var user = this && this.user,
            password = this && this.password,
            msg = [];

        remember = self.remember;

        !user && msg.push('帐号');
        !password && msg.push('密码');

        msg = msg.join('与');
        msg && UI.AlertError('请输入您的' + msg);

        !msg && $api.auth.login({
            user: user,
            passwd: md5.createHash(password).toUpperCase()
        }, validate, function(result) {
            UI.AlertError('服务器错误', '错误: ' + result.data.code);
        });

    };

}]);