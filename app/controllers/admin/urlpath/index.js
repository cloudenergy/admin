angular.module('app').controller('urlpathInfo', ["$scope", "$q", "SettingMenu", "UrlPath", "API", "Auth", "UI", function($scope, $q, SettingMenu, UrlPath, API, Auth, UI) {

    var removeNodes = new Array();
    var pastUrlPath;

    Auth.Check(function() {
        SettingMenu(function(menu) {
            $scope.menu = menu;
        });

        $scope.doSave = function(e) {
            e.preventDefault();

            var nodes = new Array();

            function TraverseNode(node, path) {
                //
                if (node._id != '/') {
                    path += node._id;
                }
                if (node.authtype != undefined) {
                    //terminal node
                    var urlpath = {
                        _id: node._id,
                        desc: node.desc,
                        authtype: node.authtype,
                        needlogin: node.needlogin,
                        enable: node.enable
                    };
                    urlpath._id = path;
                    console.log(path, 'node: ', urlpath);
                    nodes.push(urlpath);
                }
                if (node.nodes != undefined && node.nodes.length > 0) {
                    //path
                    _.each(node.nodes, function(subNode) {
                        TraverseNode(subNode, path + '/');
                    });
                }
            }

            TraverseNode($scope.urlpath[0], '');
            console.log(removeNodes);
            var removeNodeIDs = new Array();
            _.each(removeNodes, function(node) {
                removeNodeIDs.push(node.url._id);
            });
            API.QueryPromise(UrlPath.delete, {
                id: removeNodeIDs
            })

            $q.all([
                API.QueryPromise(UrlPath.delete, {
                    id: removeNodeIDs
                }).promise,
                API.QueryPromise(UrlPath.update, nodes).promise
            ]).then(
                function(result) {
                    console.log(result);
                }
            );
            //        API.Query(UrlPath.update, nodes, function(data){
            //            if(data.err){}
            //            else{
            //                UI.AlertSuccess('更新成功')
            //            }
            //        });
        };

        $scope.insert = function(event) {
            //
        };

        //        UrlPath.info(function(data) {
        API.Query(UrlPath.info, {}, function(data) {
            if (data.err) {} else {
                pastUrlPath = data.result;
                var urlPath = {
                    _id: '/',
                    nodes: new Array()
                };
                _.each(pastUrlPath, function(url) {
                    var pathNode = url._id.split('/');
                    var traverseNode = urlPath;
                    _.each(pathNode, function(node, index) {
                        if (node == '') {
                            return;
                        }

                        //是否最后一个节点
                        var isFinalNode = (pathNode.length == index + 1);
                        var existsNode = _.find(traverseNode.nodes, function(v) {
                            return v._id == node;
                        });
                        if (existsNode == undefined) {
                            if (isFinalNode) {
                                //
                                existsNode = {
                                    _id: node,
                                    url: url,
                                    desc: url.desc || '',
                                    enable: url.enable,
                                    needlogin: url.needlogin,
                                    authtype: url.authtype,
                                    nodes: new Array()
                                }
                            } else {
                                existsNode = {
                                    _id: node,
                                    desc: url.desc || '',
                                    nodes: new Array()
                                }
                            }
                            traverseNode.nodes.push(existsNode);
                        }
                        traverseNode = existsNode;
                    })
                });
                console.log(urlPath);
                $scope.urlpath = [urlPath];
            }
        }, responseError)

        //Action
        $scope.RemoveNode = function(scope, node) {
            scope.remove();
            removeNodes.push(node);
        };

        $scope.enable = function(node) {
            node.enable = !node.enable;
        };

        $scope.toggle = function(scope) {
            scope.toggle();
        };

        $scope.newSubItem = function(scope) {
            var nodeData = scope.node;
            nodeData.nodes.push({
                _id: '',
                authtype: "NONE",
                needlogin: true,
                enable: true,
                editing: true,
                isnew: true,
                nodes: []
            });
        };

        $scope.edit = function(node) {
            node.editing = true;
        };

        $scope.needLogin = function(node) {
            node.needlogin = !node.needlogin;
        };

        $scope.SetAuthType = function(node, type) {
            node.authtype = type;
        };

        $scope.cancelEditing = function(scope, node) {
            if (!node._id.length) {
                $scope.RemoveNode(scope, node);
            } else {
                node.editing = false;
            }
        };

        $scope.save = function(node) {
            node.editing = false;
            node.isnew = false;
        };

        function responseError(result) {
            UI.AlertError(result.data.message)
        }
    });
}]);