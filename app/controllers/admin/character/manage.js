angular.module('app').controller('characterManage', ["$scope", "$stateParams", "$state", "UrlPath", "$cookies", "Account", "$q", "Project", "Building", "Customer", "Collector", "Sensor", "Auth", "API", "UI", "Character", function($scope, $stateParams, $state, UrlPath, $cookies, Account, $q, Project, Building, Customer, Collector, Sensor, Auth, API, UI, Character) {

    var characterAuthTree = {};

    var characterID = $stateParams.id;

    Auth.Check(function() {

        //保存权限
        $scope.OnSave = function(e) {
            e.preventDefault();

            var nodes = new Array();

            function TraverseNode(node, path) {
                //
                if (node._id != '/') {
                    path += node._id;
                }
                if (node.select) {
                    nodes.push(path);
                }
                if (node.nodes != undefined && node.nodes.length > 0) {
                    //path
                    _.each(node.nodes, function(subNode) {
                        TraverseNode(subNode, path + '/');
                    });
                }
            }

            TraverseNode($scope.urlpath[0], '');
            console.log(nodes);

            var rule = {};
            _.each(nodes, function(node) {
                var nodeSplit = node.split('/');
                var ruleNode = rule;
                _.each(nodeSplit, function(slot, index) {
                    if (slot == '') {
                        slot = '/';
                    }
                    var isLeaf = false;
                    if (index == nodeSplit.length - 1) {
                        isLeaf = true;
                    }
                    if (!ruleNode[slot]) {
                        ruleNode[slot] = {};
                    }
                    ruleNode[slot].leaf = isLeaf;
                    ruleNode = ruleNode[slot];
                });
            });
            console.log(rule);
            $scope.character.rule = rule;

            var returnBack = function() {
                $state.go('admin.character.info');
            };

            if (characterID) {
                //
                API.Query(Character.update, $scope.character, function(result) {
                    if (result.code) {
                        UI.AlertError(result.message);
                        return;
                    } else {
                        returnBack();
                    }
                });
            } else {
                API.Query(Character.add, $scope.character, function(result) {
                    console.log(result);
                    if (result.code) {
                        UI.AlertError(result.message);
                        return;
                    } else {
                        returnBack();
                    }
                });
            }
        };

        function findCharacter() {
            //
            var deferred = $q.defer();

            var buildRuleTree = function(data) {
                var RecursionRuleTree = function(node, path) {
                    _.map(node, function(v, k) {
                        if (v.leaf) {
                            //is left node
                            characterAuthTree[path + '/' + k] = true;
                        } else {
                            RecursionRuleTree(v, k == '/' ? '' : path + '/' + k);
                        }
                    });
                };

                RecursionRuleTree(data, '');
            };

            if (characterID) {
                API.Query(Character.info, {
                    id: characterID
                }, function(character) {
                    if (character.err) {
                        deferred.reject(character.err);
                    } else {
                        $scope.character = character.result;
                        buildRuleTree(character.result.rule);
                        deferred.resolve();
                    }
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        }

        //找到角色权限树以后，标记对应的总权限树
        findCharacter().then(function() {
            API.Query(UrlPath.info, {}, function(data) {
                if (data.err) {} else {
                    var urlPath = {
                        _id: '/',
                        nodes: new Array()
                    };
                    _.each(data.result, function(url) {
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
                                        select: false,
                                        nodes: new Array()
                                    };
                                    existsNode.select = characterAuthTree[url._id] ? true : false;
                                } else {
                                    existsNode = {
                                        _id: node,
                                        desc: url.desc || '',
                                        select: false,
                                        nodes: new Array()
                                    };
                                }
                                traverseNode.nodes.push(existsNode);
                            }
                            traverseNode = existsNode;
                        });
                    });
                    console.log(urlPath);
                    $scope.urlpath = [urlPath];


                }
            });
        });

        //Action
        $scope.enable = function(node) {
            node.select = !node.select;
        };
        $scope.toggle = function(scope) {
            console.log(scope);
            scope.toggle();
        };
        $scope.EnableSubNode = function(node, isEnable) {
            //
            console.log(node);
            var IterationNodes = function(node) {
                if (!node) {
                    return;
                }
                _.each(node.nodes, function(node) {
                    node.select = isEnable;
                    return IterationNodes(node);
                });
            };

            IterationNodes(node);
        };
    });
}]);