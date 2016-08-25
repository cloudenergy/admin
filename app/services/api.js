/**
 * Created with JetBrains WebStorm.
 * User: christozhou
 * Date: 14-6-5
 * Time: 下午10:58
 * To change this template use File | Settings | File Templates.
 */

angular.module('app').factory('API', function() {
    var lengthOfSensorID = {
        buildingID: 10,
        gatewayID: 2,
        addrID: 12,
        meterID: 3,
        funcID: 2
    };
    var RootEnergycategory = function(energycategoryID) {
        var idArray = energycategoryID.split('|');
        if (_.isArray(idArray)) {
            return idArray[0] || energycategoryID;
        } else {
            return energycategoryID;
        }
    };
    var TailEnergycategory = function(energycategoryID) {
        var idArray = energycategoryID.split('|');
        if (_.isArray(idArray)) {
            return idArray[idArray.length - 1] || energycategoryID;
        } else {
            return energycategoryID;
        }
    };

    return {
        Query: function(api, parameter, callback) {
            if (api == undefined || api == null) {
                return false;
            }

            if (_.isFunction(parameter)) {
                api({}, parameter);
                return api;
            } else {
                api(parameter, callback);
                return api;
            }
        },
        QueryPromise: function(api, parameter) {
            if (api == undefined || api == null) {
                return false;
            }

            if (_.isFunction(parameter)) {
                //
                return api({}, parameter);
            } else {
                return api(parameter);
            }
        },
        FindEnergyByPath: function(energy, id, path) {
            //
            var findEnergyByPath = function(node, pathStep, step) {
                if (pathStep.length <= step) {
                    return node;
                }
                var index = parseInt(pathStep[step]);
                if (node.childrens && node.childrens.length > index) {
                    return findEnergyByPath(node.childrens[index], pathStep, step + 1);
                }
                return undefined;
            }

            var node = undefined
            _.each(energy, function(e) {
                if (e._id == id) {
                    //
                    node = findEnergyByPath(e, path.split(','), 1);
                }
            });
            return node;
        },
        FindEnergyByID: function(energy, id) {
            //
            var findEnergyByID = function(node) {
                if (!node) {
                    return undefined;
                }

                for (var i in node) {
                    var e = node[i];
                    if (e.id == id) {
                        return e;
                    }
                    var returnNode = findEnergyByID(e.childrens);
                    if (returnNode) {
                        return returnNode;
                    }
                }

                return undefined;
            };

            return findEnergyByID(energy);
        },
        FindEnergyByTitle: function(energy, title) {
            //
            titleReg = new RegExp(title, 'ig');
            var findEnergyByTitle = function(node) {
                if (!node) {
                    return undefined;
                }

                for (var i in node) {
                    var e = node[i];

                    if (titleReg.test(e.title)) {
                        return e;
                    }
                    if (e.title == title) {
                        return e;
                    }
                    var returnNode = findEnergyByTitle(e.childrens);
                    if (returnNode) {
                        return returnNode;
                    }
                }

                return undefined;
            };

            return findEnergyByTitle(energy);
        },
        ParentLocation: function(url) {
            var index = url.lastIndexOf('/');
            return url.substr(0, index);
        },
        RootEnergycategory: function(energycategoryID) {
            return RootEnergycategory(energycategoryID);
        },
        TailEnergycategory: function(energycategoryID) {
            return TailEnergycategory(energycategoryID);
        },
        FindSocity: function(socities, id) {
            //
            var findSocity = function(node) {
                if (!node) {
                    return undefined;
                }

                for (var i in node) {
                    var e = node[i];
                    if (e.id == id) {
                        return e;
                    }
                    var returnNode = findSocity(e.childrens);
                    if (returnNode) {
                        return returnNode;
                    }
                }

                return undefined;
            };

            return findSocity(socities);
        },
        SensorID: function(sid) {
            return sid.substr(0, sid.length - 2);
        },
        ParseSensorID: function(id) {
            //
            if (!id || !id.length) {
                return null;
            }

            var obj = {};
            _.map(lengthOfSensorID, function(length, name) {
                obj[name] = id.substr(0, length);
                id = id.substr(length);
            });

            return obj;
        }
    }
});