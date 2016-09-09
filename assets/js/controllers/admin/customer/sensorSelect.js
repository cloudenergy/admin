angular.module('app').controller('SensorSelect', ["$scope", "$rootScope", "$uibModalInstance", "$api", "ProjectID", "SelectKEY", function($scope, $rootScope, $uibModalInstance, $api, ProjectID, SelectKEY) {

    var Sensors,
        searchCache,

        GetSensor = function() {
            $api.sensor.info({
                project: ProjectID,
                keyreg: $scope.sensorSearchKey,
                pageindex: $scope.currentPage,
                pagesize: $rootScope.popPageSize
            }, function(data) {
                angular.forEach(Sensors = data.result.detail || [], function(item) {
                    Sensors[item.id] = item.id
                });
                $scope.pagingCount = data.result.paging.count;
                $scope.UpdateViewOfSensors();
            });
        };

    $scope.currentPage = 1;

    $scope.Submit = function() {
        $uibModalInstance.close(SelectKEY);
    };

    $scope.Cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.switchSensor = function(item, allTrue) {
        if (item.isEnable = (allTrue || !item.isEnable)) {
            if (SelectKEY[item.id] === 0) {
                SelectKEY[item.id] = 1
            } else if (angular.isUndefined(SelectKEY[item.id])) {
                SelectKEY[item.id] = item.title
            }
        } else {
            if (SelectKEY[item.id] === 1) {
                SelectKEY[item.id] = 0
            } else {
                delete SelectKEY[item.id]
            }
        }
    };

    $scope.searchSensor = function(isSubmit) {
        (isSubmit || !angular.equals(searchCache, $scope.sensorSearchKey)) && GetSensor();
        searchCache = $scope.sensorSearchKey;
    };

    $scope.selectAll = function() {
        angular.forEach($scope.viewOfSensors, function(item) {
            $scope.switchSensor(item, true)
        });
    };

    $scope.UpdateViewOfSensors = function(key) {
        $scope.viewOfSensors = [];
        angular.forEach(Sensors, function(item) {
            item.isEnable = !!SelectKEY[item.id];
            if (angular.isUndefined(key) || item.id.match(key) || item.title.match(key)) {
                $scope.viewOfSensors.push(item);
            }
        });
    };

    $scope.$watch('currentPage', GetSensor);

}]);