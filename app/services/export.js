angular.module('app').factory('Export', ["$resource", "Config", function($resource, Config) {
    return $resource(Config.apiBase + 'export', {}, {
        DepartmentStatistic: {
            method: 'POST',
            url: Config.API + '/export/departmentstatistic'
        }
    })
}]);