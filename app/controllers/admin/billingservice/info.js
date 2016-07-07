angular.module('app').controller('BillingServiceInfo', ["$scope", "$q", "$stateParams", "Energycategory", "$location", "SettingMenu", "Project", "Account", "API", "Auth", "$cookies", "UI", "Pab", "BillingService", "Config", function($scope, $q, $stateParams, Energycategory, $location, SettingMenu, Project, Account, API, Auth, $cookies, UI, Pab, BillingService, Config) {

    $scope.operateStatus = {
        add: {
            isEnable: false,
            url: '/add'
        },
        delete: {
            isEnable: false,
            url: '/delete'
        },
        update: {
            isEnable: false,
            url: '/update'
        }
    };

    $scope.askingRemoveID = undefined;
    $scope.PadShow = [];
    $scope.settingUserInfo = undefined;
    $scope.askingRemoveID = undefined;

    Auth.Check($scope.operateStatus, function() {
        SettingMenu(function(menu) {
            $scope.menu = menu;
        });

        $scope.onSearchAccount = function(e) {
            e.preventDefault();
            console.log($scope.accountKey);
            //Get User's All Projects
            //        API.Query(Account.info, {idreg: $scope.accountKey, titlereg: $scope.accountKey }, function(result){
            API.Query(Account.info, {
                user: $scope.accountKey
            }, function(result) {
                if (result.err) {
                    return;
                }

                var userInfo = result.result;
                $scope.settingUserInfo = userInfo;
                var projects = userInfo['resource'] && userInfo['resource']['project'] || [];

                //
                $q.all([
                    API.QueryPromise(Project.info, projects == '*' ? {} : {
                        ids: projects
                    }).$promise,
                    API.QueryPromise(Pab.info, {
                        account: $scope.accountKey
                    }).$promise
                ]).then(function(result) {

                    var projects = {};
                    _.each(angular.isArray(result[0].result) ? result[0].result : [result[0].result], function(project) {
                        projects[project._id] = {
                            project: project,
                            status: 'UNBIND'
                        }
                    });

                    _.each(result[1].result, function(padItem) {
                        var padShowItem = projects[padItem.project];
                        if (padShowItem) {
                            padShowItem.status = padItem.status;
                        }
                    });

                    _.each(projects, function(project) {
                        $scope.PadShow.push(project);
                    });
                });
            });
        };

        $q.all([
            API.QueryPromise(Energycategory.info, {}).$promise,
            API.QueryPromise(Project.info, {}).$promise
        ]).then(function(result) {
            //Energycategory
            $scope.energycategory = result[0].result;

            //Projects
            $scope.projects = angular.isArray(result[1].result) ? result[1].result : [result[1].result];
            var projectID = UI.GetPageItem('billingservice.projectid', projectID);
            if (projectID) {
                $scope.projects.title = projectID;
            } else if ($scope.projects.length > 0) {
                $scope.projects.title = $scope.projects[0]._id;
            }
            //                if($stateParams.project) {
            //                    $scope.projects.title = $stateParams.project;
            //                }
            //                else if($scope.projects.length > 0){
            //                    $scope.projects.title = $scope.projects[0]._id;
            //                }
        });

        function GetEnergycategory(projectID) {
            API.Query(BillingService.info, {
                project: projectID
            }, function(result) {
                // console.log(result);
                if (result.err) {
                    //
                } else {
                    $scope.billingservices = result.result;
                    _.each($scope.billingservices, function(bs) {
                        bs.ecstring = '';
                        _.each(bs.energycategory, function(ecID) {
                            var energycategory = _.find($scope.energycategory, function(ec) {
                                return ec._id == ecID;
                            });
                            if (energycategory) {
                                bs.ecstring += energycategory.title + '，';
                            }
                        });
                        bs.ecstring = bs.ecstring.substr(0, bs.ecstring.length - 1);
                    });

                    console.log($scope.billingservices);
                }
            });
        }

        $scope.$watch('projects.title', function(projectID) {
            if (projectID) {
                UI.PutPageItem('billingservice.projectid', projectID);
                GetEnergycategory(projectID);
            }
        });

        $scope.DoRemove = function(e, id, index) {
            e.preventDefault();

            var removeIndex = UI.GetAbsoluteIndex($scope.currentPage, index);
            API.Query(BillingService.delete, {
                id: id
            }, function(result) {
                $scope.billingservices.splice(removeIndex, 1);
            }, responseError)
        };
        $scope.AskForRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = id;
        };
        $scope.CancelRemove = function(e, id) {
            e.preventDefault();
            $scope.askingRemoveID = undefined;
        };

        function responseError(result) {
            UI.AlertError(result.data.message)
        }

    });
}]);