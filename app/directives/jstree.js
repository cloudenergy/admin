angular.module("app").directive("jstree",["$ocLazyLoad",function(e){var t=e.load([{serie:!0,files:["/vendor/jstree/dist/themes/default/style.min.css?rev=4559d12f6e","/vendor/jstree/dist/jstree.min.js?rev=5cca690e8a"]}]);return{restrict:"A",link:function(e,r,s,a){t.then(function(){e.$watch(s.jstree,function(t){r.data("jstree")&&r.data("jstree").destroy(),r.jstree(t||{}),s.jstreeSearch&&r.jstree(!0).search&&e.$watch(s.jstreeSearch,function(e){r.jstree(!0).search(e||"")})})})}}}]);