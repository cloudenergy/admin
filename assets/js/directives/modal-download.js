angular.module('app').directive('modalDownload', ["$templateCache", "$uibModal", function ($templateCache, $uibModal) {
    $templateCache.put('template-modal-download.html', [
        '<div class="modal-header">',
        '<button type="button" class="close" ng-click="self.cancel()"><span>&times;</span></button>',
        '<h4 class="modal-title" ng-bind="self.downloadTitle"></h4>',
        '</div>',
        '<div class="modal-body text-primary text-center">',
        '<a class="text-primary h4 no-margin" target="_blank" ng-click="self.cancel()" ng-href="{{self.downloadLink}}" download="{{self.downloadName}}"><i class="glyphicon glyphicon-download-alt"></i> 点击下载</a>',
        '</div>'
    ].join(''));
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(attrs.modalDownload, function (val) {
                val && $uibModal.open({
                    // size: 'sm',
                    windowClass: 'no-border',
                    templateUrl: 'template-modal-download.html',
                    controllerAs: 'self',
                    controller: ["$timeout", "$uibModalInstance", function ($timeout, $uibModalInstance) {
                        this.downloadTitle = scope.$eval(attrs.modalDownloadName) || '下载链接';
                        this.downloadName = (scope.$eval(attrs.modalDownloadName) || val.replace(/\.\w+$/, '')) + val.replace(/^\w+/, '');
                        this.downloadLink = '/download/' + val;
                        this.cancel = function () {
                            $timeout($uibModalInstance.dismiss, 100);
                        };
                    }]
                });
            });
        }
    };
}]);