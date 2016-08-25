angular.module('app').config(["$provide", function($provide) {

    /**
     * 默认POST提交
     */
    var APICONFIG = {
        auth: ['auth', , {
            check: {},
            login: {},
            logout: {}
        }],
        account: ['account', , {
            info: {}
        }],
        control: ['control', , {
            send: {},
            statusquery: {}
        }],
        business: ['business', , {
            //账户资金详情
            accountbalance: {},
            //平台资金流水
            pltfundflow: {},
            fundflow: {},
            monitor: {},
            //日汇总
            dailyfundsummary: {},
            //月汇总
            monthlyfundsummary: {},
            //流水详情
            ordernodetail: {},
            //项目资金流水统计(物业财务首页)
            projectfundflowstatistic: {},
            //商户消耗明细（账务管理消耗金额明细列表）
            departmentconsumptiondetail: {},
            //商户消耗统计（账务管理消耗金额统计）
            departmentconsumptionstatistic: {}
        }],
        //渠道账户
        channelaccount: ['channelaccount', , {
            add: {},
            delete: {},
            update: {},
            checking: {},
            info: {}
        }],
        //建筑
        building: ['building', , {
            info: {}
        }],
        //项目列表
        project: ['project', , {
            info: {},
            add: {},
            update: {},
            delete: {}
        }],
        //提现
        withdraw: ['withdraw', , {
            //提现审核
            checking: {},
            //提现详情
            details: {},
            //提现请求列表
            info: {},
            apply: {}
        }],
        payment: ['payment', , {
            channelinfo: {},
            handlingcharge: {}
        }],
        bank: ['bank', , {
            info: {}
        }],
        //社会属性
        customer: ['customer', , {
            //查询
            info: {},
            //更新
            update: {}
        }],
        sensor: ['sensor', , {
            info: {}
        }],
        sensorchannel: ['sensorchannel', , {
            info: {},
            add: {},
            update: {},
            syncdata: {},
            delete: {}
        }],
        device: ['device', , {
            type: {}
        }],
        department: ['department', , {
            info: {},
            delete: {}
        }],
        export: ['export', , {
            // 流水导出
            projectflow: {},
            // 项目日账单
            projectdailybill: {},
            // 项目日回单
            projectdailyreceipt: {},
            // 项目月账单
            projectmonthlybill: {},
            // 项目月回单
            projectmonthlyreceipt: {},
            // 消耗明细
            consumptiondetail: {}
        }],
        energy: ['energy', , {
            info: {}
        }],
        energycategory: ['energycategory', , {
            info: {}
        }]
    };

    /* api service
     * $resource(url, [paramDefaults], [actions], options);
     * usage:
     *      $api.name1.action([parameters], [success], [error])
     *      $api.name2.action([parameters], postData, [success], [error])
     */
    $provide.service('$api', ["$rootScope", "$resource", "$location", "$state", function($rootScope, $resource, $location, $state) {

        // 自动补全URL
        function fullUrl(url, bool) {
            return /(^http:\/\/)|(^https:\/\/)/.test(url) && url || [
                // location.protocol, '//',
                // location.host,
                localStorage.testapi && '/testapi/' || '/api/',
                url,
                bool && '/:_api_action' || ''
            ].join('');
        }
        // 获取参数
        function requestData(data) {
            return angular.isArray(this) && {
                parameters: !angular.isFunction(arguments[0]) && arguments[0] || undefined,
                postData: !angular.isFunction(arguments[1]) && arguments[1] || undefined
            } || {
                parameters: !angular.isFunction(data.parameters) && data.parameters || undefined,
                postData: !angular.isFunction(data.postData) && data.postData || undefined
            };
        }
        // 取消请求
        function cancelRequest(key) {
            angular.forEach($rootScope._api_request[key], function(item, key) {
                item.request.$cancelRequest();
            });
            delete $rootScope._api_request[key];
        }

        // 设置API请求缓存参数
        $rootScope._api_request = {};

        // 监听路由变动，即时取消上一次路由中的API请求
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            toState.name !== fromState.name && cancelRequest(fromState._URL);
        });
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $location.url() !== fromState._URL && cancelRequest(fromState._URL);
        });

        angular.forEach(APICONFIG, function(config, name) {
            if (angular.isArray(config) && config[0]) {
                config[0] = fullUrl(config[0], !!config[2]);
                config[3] = angular.extend({}, {
                    // 默认可取消
                    cancellable: true
                }, config[3]);
                angular.forEach(config[2], function(action, name) {
                    angular.extend(action, {
                        url: action.url && fullUrl(action.url) || undefined,
                        method: action.method || 'POST',
                        params: angular.extend(action.url && {} || {
                            _api_action: name
                        }, action.params)
                    });
                });
                angular.forEach(this[name] = $resource.apply($resource, config), function(fn, action, request, cancellable) {
                    this[action] = function() {
                        if (cancellable = angular.isObject(arguments[0]) && arguments[0].cancellable) {
                            delete arguments[0].cancellable;
                        }
                        request = fn.apply(this, arguments);
                        // 若改请求已设置取消请求的参数，则将该请求缓存到变量中，
                        // 便于下一次路由触发后取消该次未完成的API请求
                        if (request.$cancelRequest) {
                            $state.current._URL = $location.url();
                            $rootScope._api_request[$state.current._URL] = $rootScope._api_request[$state.current._URL] || {};
                            (function(origin, current) {
                                if (origin) {
                                    if (cancellable || angular.equals(current, requestData.call({}, origin))) {
                                        if (!origin.request.$resolved) {
                                            origin.request.$cancelRequest();
                                            !cancellable && console.warn('duplicate request:', localStorage.testapi && 'testapi' || 'api', '/', name, '/', action);
                                        }
                                    } else {
                                        $rootScope._api_request[$state.current._URL][name + '_' + action + '_' + Date.now()] = origin;
                                        // console.info('multiple request:', localStorage.testapi && 'testapi' || 'api', '/', name, '/', action);
                                    }
                                }
                            }($rootScope._api_request[$state.current._URL][name + '_' + action + '_recently'], requestData.apply([], arguments)));
                            $rootScope._api_request[$state.current._URL][name + '_' + action + '_recently'] = angular.extend({
                                request: request
                            }, requestData.apply([], arguments));
                        }
                        return request;
                    };
                }, this[name]);
            }
        }, this);

    }]);

}]);