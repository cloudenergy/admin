/**
 * Created by Joey on 14-6-27.
 */
angular.module('app').controller('ProjectSelect', ["$scope", "$modalInstance", "Projects", "ProjectIDs", "Config", function($scope, $modalInstance, Projects, ProjectIDs, Config) {
    $scope.Ok = function() {
        var SelectProjects;
        if ($scope.viewOfProjects[0].isEnable) {
            //
            SelectProjects = $scope.viewOfProjects[0]._id;
        } else {
            SelectProjects = [];
            _.each($scope.viewOfProjects, function(project) {
                if (project.isEnable) {
                    SelectProjects.push(project);
                }
            });
        }
        $modalInstance.close(SelectProjects);
    };
    $scope.Cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.SwitchProject = function(e, project) {
        e.preventDefault();


        if (project._id == '*') {
            _.each($scope.viewOfProjects, function(p) {
                p.isEnable = false;
            });
            project.isEnable = !project.isEnable;
        } else {
            $scope.viewOfProjects[0].isEnable = false;
            project.isEnable = !project.isEnable;
        }
    };

    $scope.onSearchProject = function(e) {
        e.preventDefault();

        $scope.UpdateViewOfProject($scope.projectSearchKey);
    };

    $scope.UpdateViewOfProject = function(key) {
        //
        $scope.viewOfProjects = [{
            _id: '*',
            title: '所有权限'
        }];
        if (!key) {
            $scope.viewOfProjects = _.union($scope.viewOfProjects, Projects);
        } else {
            _.each(Projects, function(project) {
                if (project.title.match(key)) {
                    $scope.viewOfProjects.push(project);
                }
            });
        }
        console.log($scope.viewOfProjects);

        //Set Select Building
        if (ProjectIDs && ProjectIDs.length) {
            _.each($scope.viewOfProjects, function(project) {
                project.isEnable = _.contains(ProjectIDs, project._id);
            });
        }
    };
    $scope.UpdateViewOfProject();
}]);