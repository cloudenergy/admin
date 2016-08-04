angular.module('app').controller('BillingServicemanage', ["$scope", "$stateParams", "$q", "$uibModal", "$state", "API", "Auth", "UI", "BillingService", "Energycategory", function($scope, $stateParams, $q, $uibModal, $state, API, Auth, UI, BillingService, Energycategory) {
    Auth.Check(function() {

        $scope.askingRemoveID = undefined;
        $scope.BillingServiceID = $stateParams.id;
        $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        $scope.days = [];
        for (var i = 1; i <= 31; i++) {
            $scope.days.push(i);
        }
        $scope.week = [{
            index: 1,
            title: '一'
        }, {
            index: 2,
            title: '二'
        }, {
            index: 3,
            title: '三'
        }, {
            index: 4,
            title: '四'
        }, {
            index: 5,
            title: '五'
        }, {
            index: 6,
            title: '六'
        }, {
            index: 7,
            title: '日'
        }];
        $scope.hours = [];
        for (var i = 0; i <= 24; i++) {
            $scope.hours.push(i);
        }

        function CreateLadderPrice(from, to, price) {
            return {
                from: from,
                to: to,
                price: price
            };
        }
        //////////////////////////////////////////////////////////////////////////////////
        //Main Function
        //Get Current BillingService's EnergyCategory
        $q.all([
            API.QueryPromise(Energycategory.info, {}).$promise,
            API.QueryPromise(BillingService.info, {
                id: $scope.BillingServiceID
            }).$promise
        ]).then(
            function(result) {
                if (result[1].err || result[0].err) {
                    return;
                }

                $scope.EnergyCategories = result[0].result;
                $scope.ServiceEnergycategories = [];

                _.each(result[1].result.energycategory, function(ecID) {
                    var ecItem = _.find($scope.EnergyCategories, function(ec) {
                        return ec._id == ecID;
                    });
                    $scope.ServiceEnergycategories.push(ecItem);
                });
                ///////////////////////////////////////////////
                //
                $scope.billingService = result[1].result;
                _.each($scope.billingService.rules, function(rule, index) {
                    //init
                    BuildService(rule);
                });

                if ($scope.billingService.rules) {
                    $scope.MaxLevel = $scope.billingService.rules.length - 1;
                } else {
                    $scope.MaxLevel = 0;
                }

                //BillingService To Text
                var text = '';
                _.each($scope.billingService.rules, function(rule, index) {
                    var RuleToText = function(rule) {
                        var text = '';
                        if (rule.week) {
                            var weekText = '';
                            var weekTextIndex = ['一', '二', '三', '四', '五', '六', '日'];
                            _.each(rule.week, function(date, index) {
                                if (date) {
                                    if (weekText.length) {
                                        weekText += ',';
                                    }
                                    weekText += weekTextIndex[index];
                                }
                            });
                            if (weekText.length) {
                                text += '星期' + weekText;
                            }
                        }

                        //分段计费文字化
                        if (rule.timequantumprice) {
                            //
                            var timequantum = [];

                            //
                            {
                                var hourIndex = 0;
                                var priceIndex = rule.timequantumprice[hourIndex];
                                _.each(rule.timequantumprice, function(price, hour) {
                                    if (priceIndex != price) {
                                        //
                                        var obj = {
                                            hourFrom: hourIndex,
                                            hourTo: hour,
                                            price: priceIndex
                                        };
                                        timequantum.push(obj);
                                        hourIndex = hour;
                                        priceIndex = price;
                                    }
                                });
                                var obj = {
                                    hourFrom: hourIndex,
                                    hourTo: 24,
                                    price: priceIndex
                                };
                                timequantum.push(obj);
                            }

                            var quantumpriceText = '';
                            _.each(timequantum, function(segment) {
                                if (quantumpriceText.length) {
                                    quantumpriceText += '; ';
                                }
                                quantumpriceText += segment.hourFrom + ":00 ~ " + segment.hourTo + ':00 : ￥' + segment.price;
                            });

                            if (quantumpriceText.length) {
                                text += quantumpriceText;
                            }
                        }
                        //单价文字化
                        else if (rule.fixprice) {
                            text += '单价 ￥' + rule.fixprice;
                        }
                        return text;
                    };
                    text += RuleToText(rule);
                });

            }
        );

        //
        function BuildService(service) {
            service.SelectMonth = 1;
            service.SelectDay = 1;
            service.HourFrom = 0;
            service.HourTo = 23;
            service.price = 0;
            service.ladfrom = 0;
            service.ladto = 0;
            service.ladprice = 0;


            var applytoStr = '';
            _.each(service.applyto, function(energycategoryID) {
                var energycategory = _.find($scope.EnergyCategories, function(energycategory) {
                    return energycategory._id == energycategoryID;
                });
                applytoStr += energycategory.title + ',';
            });
            applytoStr = applytoStr.substr(0, applytoStr.length - 1);
            service.applytoStr = applytoStr;

            //
            //判断区间计费/统一计费
            if (service.timequantumprice) {
                service.billingtype = {
                    timequantum: true
                };
            } else {
                service.billingtype = {
                    fixprice: true
                };
            }

            //时间段映射成对象
            if (service.timequantumprice) {
                //parse timequantum
                //            var tq = {};
                service.timequantum = [];

                var hourIndex = 0;
                var priceIndex = service.timequantumprice[hourIndex];
                _.each(service.timequantumprice, function(price, hour) {
                    if (priceIndex != price) {
                        //
                        var obj = {
                            hourFrom: hourIndex,
                            hourTo: hour,
                            price: priceIndex
                        };
                        service.timequantum.push(obj);
                        hourIndex = hour;
                        priceIndex = price;
                    }
                });
                var obj = {
                    hourFrom: hourIndex,
                    hourTo: 24,
                    price: priceIndex
                };
                service.timequantum.push(obj);
            }

            //阶梯计费
            if (service.ladderprice) {
                service.ladder = [];
                var lowerbound = 0;
                _.map(service.ladderprice, function(price, level) {
                    var obj = {
                        from: lowerbound,
                        to: level,
                        price: price
                    };
                    lowerbound = level;
                    service.ladder.push(obj);
                });
            }

        }
        $scope.SaveStrategy = function() {
            //
            var param = {
                id: $scope.BillingServiceID,
                rules: []
            };
            _.each($scope.billingService.rules, function(rule) {
                var saveObj = {};
                saveObj.week = rule.week;
                saveObj.day = rule.day;
                saveObj.applyto = rule.applyto;
                if (rule.timequantum && rule.timequantum.length) {
                    saveObj.timequantumprice = new Array(24);
                    _.each(rule.timequantum, function(tq) {
                        for (var i = tq.hourFrom; i < tq.hourTo; i++) {
                            saveObj.timequantumprice[i] = parseFloat(tq.price);
                        }
                    });
                } else if (rule.ladder && !_.isEmpty(rule.ladder)) {
                    //
                    saveObj.ladderprice = {};
                    _.each(rule.ladder, function(lad) {
                        saveObj.ladderprice[lad.to] = lad.price;
                    });
                } else {
                    saveObj.fixprice = parseFloat(rule.fixprice || 0);
                }
                param.rules.push(saveObj);
            });

            API.Query(BillingService.update, param, function(result) {
                $state.go('admin.billingservice.info');
                UI.AlertSuccess('保存成功');
            }, function(result) {
                UI.AlertError(result.data.message);
            });
        };
        $scope.AddSubStrategy = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'energySelect.html',
                controller: 'EnergySelect',
                size: 'md',
                resolve: {
                    ServiceEnergycategories: function() {
                        return $scope.ServiceEnergycategories;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                //
                var service = {
                    applyto: result
                };
                BuildService(service);
                if (!$scope.billingService.rules) {
                    $scope.billingService.rules = [];
                }
                $scope.billingService.rules.push(service);
            }, function() {});
        };

        $scope.Day = new Date();
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.SelectRule = undefined;
        $scope.disabled = function(date, mode) {
            //        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            return mode === 'year';
        };
        $scope.open = function($event, selectRule) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.SelectRule = selectRule;
            selectRule.opened = true;
            _.each($scope.Rules, function(rule) {
                if (rule.id != selectRule.id) {
                    rule.opened = false;
                }
            });
        };

        //添加日期
        $scope.AddSelectDate = function(e, rule) {
            e.preventDefault();
            var month = rule.SelectMonth;
            month = month < 10 ? '0' + month.toString() : month.toString();
            var day = rule.SelectDay;
            day = day < 10 ? '0' + day.toString() : day.toString();

            var dt = month + day;
            if (!rule.day) {
                rule.day = [];
            }
            rule.day = _.union(rule.day, dt);
        };
        //删除已经选择的日期
        $scope.RemoveSelectDate = function(e, rule, day) {
            e.preventDefault();
            rule.day = _.without(rule.day, day);
        };
        //选择星期
        $scope.SelectWeek = function(e, week, rule) {
            e.preventDefault();

            if (!rule.week || !rule.week.length) {
                rule.week = [0, 0, 0, 0, 0, 0, 0];
            }

            if (rule.week[week]) {
                rule.week[week] = 0;
            } else {
                rule.week[week] = week + 1;
            }
        };

        //添加时间段/价格
        $scope.AddTimeQuantum = function(e, rule) {
            //先要判定新添加的时间段和已有的时候是否重叠
            var newTimeQuentum = _.range(rule.HourFrom, rule.HourTo, 1);
            for (var index in rule.timequantum) {
                var tq = rule.timequantum[index];
                var timeQuentum = _.range(tq.hourFrom, tq.hourTo, 1);
                var intersectionSet = _.intersection(newTimeQuentum, timeQuentum);
                if (intersectionSet.length) {
                    //Area overlap
                    alert('添加时间段和现有时间段重叠，请检查');
                    return;
                }
            }
            if (!rule.timequantum) {
                rule.timequantum = new Array();
            }
            rule.timequantum.push({
                hourFrom: Number(rule.HourFrom),
                hourTo: Number(rule.HourTo),
                price: Number(rule.price)
            });
        };
        //删除时间段/价格
        $scope.RemoveTimeQuantum = function(e, rule, timeQuantum) {
            e.preventDefault();

            var index = _.indexOf(rule.timequantum, timeQuantum);
            rule.timequantum.splice(index, 1);
        };

        //添加阶梯价格
        $scope.AddLadder = function(e, rule) {
            if (!rule.ladfrom && !rule.ladto) {
                alert('请填写阶梯范围');
                return;
            }
            if (rule.ladfrom >= rule.ladto) {
                alert('填写的阶梯范围有误，请检查');
                return;
            }

            if (!rule.ladder) {
                rule.ladder = [];
            } else {
                //先要判定新添加的阶梯价和已有的时候是否重叠
                var isInArea = _.find(rule.ladder, function(lad) {
                    if (rule.ladfrom > lad.from && rule.ladfrom < lad.to || rule.ladto > lad.from && rule.ladto < lad.to) {
                        return true;
                    }
                    return false;
                });
                if (isInArea) {
                    //
                    alert('添加阶梯价格和现有时间段重叠，请检查');
                    return;
                }
            }

            rule.ladder.push(CreateLadderPrice(rule.ladfrom, rule.ladto, rule.ladprice));
        };
        //删除阶梯价格
        $scope.RemoveLadder = function(e, rule, lad) {
            e.preventDefault();

            var index = _.indexOf(rule.ladderprice, lad);
            rule.ladderprice.splice(index, 1);
        };

        $scope.DoRemove = function(e, index) {
            e.preventDefault();

            $scope.billingService.rules.splice(index, 1);
            $scope.askingRemoveID = null;
        };
        $scope.AskForRemove = function(e, index) {
            e.preventDefault();
            $scope.askingRemoveID = index;
        };
        $scope.CancelRemove = function(e, index) {
            e.preventDefault();
            $scope.askingRemoveID = undefined;
        };

        $scope.onLevelUp = function(e, index) {
            e.preventDefault();

            var tmp = $scope.billingService.rules[index - 1];
            $scope.billingService.rules[index - 1] = $scope.billingService.rules[index];
            $scope.billingService.rules[index] = tmp;
        };
        $scope.onLevelDown = function(e, index) {
            e.preventDefault();

            var tmp = $scope.billingService.rules[index + 1];
            $scope.billingService.rules[index + 1] = $scope.billingService.rules[index];
            $scope.billingService.rules[index] = tmp;
        };
    });
}]);