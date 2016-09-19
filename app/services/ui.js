angular.module('app').factory('UI', ["$rootScope", function($rootScope) {
    $rootScope.pageIndexCache = {};
    $rootScope.pageItemCache = {};
    return {
        AlertSuccess: function(message, title) {
            swal(title || '成功', message || '操作成功', 'success');
        },
        AlertError: function(message, title) {
            swal(title || '失败', message || '操作失败', 'error');
        },
        AlertWarning: function(message, title) {
            swal(title || '警告', message || '操作异常', 'warning');
        },
        //分页索引缓存
        PutPageIndex: function(key, index) {
            key = key || '.common';
            $rootScope.pageIndexCache[key] = index;
        },
        GetPageIndex: function(key) {
            key = key || '.common';
            return $rootScope.pageIndexCache[key] || 1;
        },
        //计算绝对索引位置
        GetAbsoluteIndex: function(page, index) {
            return $rootScope.pageSize * (page - 1) + index;
        },
        //分页项缓存
        PutPageItem: function(key, item) {
            key = key || '.common';
            $rootScope.pageItemCache[key] = item;
        },
        GetPageItem: function(key) {
            key = key || '.common';
            return $rootScope.pageItemCache[key] || null;
        }
    };
}]);