angular.module('app').factory('SettingMenu', ["$cookies", "API", "Account", function($cookies, API, Account) {
    return function(callback) {

        API.Query(Account.info, {
            id: $cookies.get('user')
        }, function(result) {

            if (result.err && !result.result) {

            } else {

                EMAPP.Account = result.result;

                var rule = result.result.character.rule['/'],
                    menu = [];

                angular.forEach([{
                    title: '首页',
                    state: 'admin.dashboard',
                    ignore: true
                }, {
                    title: '角色管理',
                    state: 'admin.character.info'
                }, {
                    title: '项目管理',
                    state: 'admin.project.info'
                }, {
                    title: 'APPID.SECRET',
                    state: 'admin.appidsecret.info'
                }, {
                    title: '账户管理',
                    state: 'admin.account.info'
                }, {
                    title: '计费策略',
                    state: 'admin.billingservice.info'
                }, {
                    title: '地址管理',
                    state: 'admin.urlpath.info'
                }, {
                    title: '建筑管理',
                    state: 'admin.building.info'
                }, {
                    title: '户管理',
                    state: 'admin.department.info'
                }, {
                    title: '社会属性',
                    state: 'admin.customer.index'
                }, {
                    title: '采集器管理',
                    state: 'admin.collector.info'
                }, {
                    title: '能耗配置',
                    state: 'admin.energycategory.info'
                }, {
                    title: '能耗分类',
                    state: 'admin.energy.index'
                }, {
                    title: '传感器管理',
                    state: 'admin.sensor.info'
                }, {
                    title: '事件配置',
                    state: 'admin.eventcategory.info'
                }, {
                    title: '平台财务',
                    state: 'admin.finance.index'
                }, {
                    title: '物业财务',
                    state: 'admin.property.index'
                }], function(item) {
                    try {
                        (item.ignore || eval('rule.' + item.state)) && this.push(item)
                    } catch (ex) {}
                }, menu);

                (callback || angular.noop)(menu);

            }
        });
    };
}]);