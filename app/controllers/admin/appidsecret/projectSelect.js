/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('ProjectSelect', ["$scope", "$modalInstance", "Projects", "ProjectIDs", "Config", function($scope, $modalInstance, Projects, ProjectIDs, Config) {
    $scope.Ok = function() {
        var SelectProjects = [];
        _.each($scope.viewOfProjects, function(project) {
            if (project.isEnable) {
                SelectProjects.push(project);
            }
        });
        $modalInstance.close(SelectProjects);
    };
    $scope.Cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.SwitchProject = function(e, project) {
        e.preventDefault();

        if (project.isEnable) {
            project.isEnable = false;
        } else {
            project.isEnable = true;
        }
    };

    $scope.onSearchProject = function(e) {
        e.preventDefault();

        $scope.UpdateViewOfProject($scope.projectSearchKey);
    };

    $scope.UpdateViewOfProject = function(key) {
        //
        $scope.viewOfProjects = [];
        if (!key) {
            $scope.viewOfProjects = _.union($scope.viewOfProjects, Projects);
        } else {
            _.each(Projects, function(project) {
                if (project.title.match(key)) {
                    $scope.viewOfProjects.push(project);
                }
            });
        }

        //Set Select Building
        _.each($scope.viewOfProjects, function(project) {
            project.isEnable = _.contains(ProjectIDs, project._id);
        });
    };
    $scope.UpdateViewOfProject();
}]);