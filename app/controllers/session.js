angular.module('app').controller('session', ["$api", "$cookies", "$state", "UI", "md5", function($api, $cookies, $state, UI, md5) {

    var self = this,
        domain = /cloudenergy\.me/.test(location.hostname) ? '.cloudenergy.me' : location.hostname,
        validate = function(data) {

            //赋值到User对象中
            data = data && data.result || {};

            //写入cookie
            angular.forEach(['token', 'user'], function(key) {
                data[key] && $cookies.put(key, data[key], {
                    path: '/',
                    domain: domain,
                    expires: new Date(new Date().setMonth(new Date().getMonth() + 1))
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
            passwd = this && this.passwd,
            msg = [];

        !user && msg.push('帐号');
        !passwd && msg.push('密码');

        msg = msg.join('与');
        msg && UI.AlertError('请输入您的' + msg);

        !msg && $api.auth.login({
            user: user,
            passwd: md5.createHash(passwd).toUpperCase()
        }, validate, function(result) {
            UI.AlertError('服务器错误', '错误: ' + result.data.code);
        });

    };

}]);