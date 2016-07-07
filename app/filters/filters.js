angular.module('app').filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            if (angular.isArray(input)) {
                return input.slice(+start)
            } else if (angular.isArray(input.detail)) {
                return input.detail.slice(+start)
            }
        }
        return []
    }
});
angular.module('app').filter('tradeStatus', function() {
    var loops = [{
            key: 'CHECKING',
            title: '等待审核',
            class: 'primary'
        }, {
            key: 'CHECKFAILED',
            title: '审核失败',
            class: 'warning'
        }, {
            key: 'PROCESSING',
            title: '正在处理',
            class: 'info'
        }, {
            key: 'FAILED',
            title: '处理失败',
            class: 'danger'
        }, {
            key: 'SUCCESS',
            title: '完成',
            class: 'success'
        }],
        status = {};

    angular.forEach(loops, function(item) {
        this[item.key] = {
            title: item.title,
            class: item.class
        };
    }, status);

    return function(input, key) {
        return key ? status[input][key] : status[input];
    }
});