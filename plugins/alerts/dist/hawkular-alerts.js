/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.


var HawkularAlerts;
(function (HawkularAlerts) {
    HawkularAlerts.pluginName = "hawkular-alerts";
    HawkularAlerts.log = Logger.get(HawkularAlerts.pluginName);
    HawkularAlerts.templatePath = "plugins/alerts/html";
})(HawkularAlerts || (HawkularAlerts = {}));

var HawkularAlerts;
(function (HawkularAlerts) {
    HawkularAlerts._module = angular.module(HawkularAlerts.pluginName, ['ui.bootstrap', 'ui.select', 'hawkular.services']);
    var tab = undefined;
    HawkularAlerts._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, builder) {
        tab = builder.create().id(HawkularAlerts.pluginName).title(function () { return "Alerts"; }).href(function () { return "/alerts"; }).subPath("Dashboard", "dashboard", builder.join(HawkularAlerts.templatePath, 'dashboard.html')).subPath("Definitions", "definitions", builder.join(HawkularAlerts.templatePath, 'definitions.html')).subPath("Notifiers", "notifiers", builder.join(HawkularAlerts.templatePath, 'notifiers.html')).build();
        builder.configureRouting($routeProvider, tab);
        $locationProvider.html5Mode(true);
    }]);
    HawkularAlerts._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(tab);
    }]);
    hawtioPluginLoader.addModule(HawkularAlerts.pluginName);
})(HawkularAlerts || (HawkularAlerts = {}));

var HawkularAlerts;
(function (HawkularAlerts) {
    ;
    var DashboardController = (function () {
        function DashboardController($scope, $interval, $log, HawkularAlert) {
            var _this = this;
            this.$scope = $scope;
            this.$interval = $interval;
            this.$log = $log;
            this.HawkularAlert = HawkularAlert;
            $scope.msgs = [];
            $scope.refresh = {
                interval: 2000
            };
            $scope.showRefresh = false;
            var oneHour = 1 * 60 * 60 * 1000;
            var endTime = Date.now() + oneHour;
            var startTime = endTime - (1.5 * oneHour);
            this.g = Graph.getInstance();
            this.g.init('alertsDashboard', 900, { top: 100, left: 125, bottom: 0, right: 0 }, startTime, endTime, function (series, timestamp) {
                var sanitizedSeries = series.substring(0, series.lastIndexOf('(')).trim();
                $scope.$apply(function () {
                    $scope.legend = _this.g.getEvent(sanitizedSeries, timestamp);
                });
            });
            this.getAlerts();
            this.stopInterval = $interval(function () {
                _this.getAlerts();
            }, $scope.refresh.interval);
            $scope.$on('$destroy', function () {
                _this.cancelRefresh();
            });
        }
        DashboardController.prototype.showRefreshForm = function () {
            this.$scope.showRefresh = true;
        };
        DashboardController.prototype.hideRefreshForm = function () {
            this.$scope.showRefresh = false;
        };
        DashboardController.prototype.updateRefresh = function () {
            var _this = this;
            this.$scope.showRefresh = false;
            this.cancelRefresh();
            this.stopInterval = this.$interval(function () {
                _this.getAlerts();
            }, this.$scope.refresh.interval);
        };
        DashboardController.prototype.closeAlertMsg = function (index) {
            this.$scope.msgs.splice(index, 1);
        };
        DashboardController.prototype.getAlerts = function () {
            var _this = this;
            this.HawkularAlert.Alert.query(function (alerts) {
                var alertsLength = alerts.length;
                for (var i = 0; i < alertsLength; i++) {
                    var alert = alerts[i];
                    alert.name = alert.triggerId;
                    alert.date = new Date(alert.time);
                    alert.description = alert.evalSets.toString();
                    _this.g.addEvent(alert);
                }
            }, function (reason) {
                _this.addAlertMsg(reason);
            });
        };
        DashboardController.prototype.cancelRefresh = function () {
            this.$interval.cancel(this.stopInterval);
        };
        DashboardController.prototype.addAlertMsg = function (reason) {
            var newAlert = { type: 'danger', msg: '' };
            if (reason.data && reason.data.errorMsg) {
                newAlert.msg = reason.data.errorMsg;
            }
            else {
                newAlert.msg = reason.statusText;
            }
            this.$scope.msgs.push(newAlert);
        };
        DashboardController.$inject = ['$scope', '$interval', '$log', 'HawkularAlert'];
        return DashboardController;
    })();
    HawkularAlerts.DashboardController = DashboardController;
    ;
    HawkularAlerts._module.controller('HawkularAlerts.DashboardController', DashboardController);
    var Graph = (function () {
        function Graph() {
            this._initialized = false;
            this._data = [];
            this._seriesIndexes = [];
            this._storage = [];
            if (Graph._instance) {
                throw new Error("Something error in Graph singleton initialization");
            }
            Graph._instance = this;
        }
        Graph.getInstance = function () {
            if (Graph._instance === null) {
                Graph._instance = new Graph();
            }
            return Graph._instance;
        };
        Graph.prototype.init = function (dashboardId, width, margin, startTime, endTime, hoverCallBack) {
            var _this = this;
            this._initialized = true;
            this._chartPlaceholder = document.getElementById(dashboardId);
            this._width = width;
            this._margin = margin;
            this._startTime = startTime;
            this._endTime = endTime;
            if (this._scaleDomain) {
                this._startTime = this._scaleDomain[0];
                this._endTime = this._scaleDomain[1];
            }
            this._color = d3.scale.category10();
            this._graph = d3.chart.eventDrops().start(new Date(this._startTime)).end(new Date(this._endTime)).eventColor(function (datum, index) {
                return _this._color(index);
            }).width(this._width).margin(this._margin).axisFormat(function (xAxis) {
                xAxis.ticks(5);
            }).eventHover(function (el) {
                var series = el.parentNode.firstChild.innerHTML;
                var timestamp = d3.select(el).data()[0];
                hoverCallBack(series, timestamp);
            }).eventZoom(function (scale) {
                _this._scaleDomain = scale.domain();
            });
            this._element = d3.select(this._chartPlaceholder).append('div').datum(this._data);
            this._data = this._element.datum();
            this._graph(this._element);
        };
        Graph.prototype.addEvent = function (event) {
            if (this._initialized) {
                if (this._storage[event.name] === undefined) {
                    var newSeries = [];
                    newSeries[event.date] = event;
                    this._storage[event.name] = newSeries;
                    this._seriesIndexes.push(event.name);
                    var newLine = {
                        name: event.name,
                        dates: [event.date]
                    };
                    this._data.push(newLine);
                    if (this._scaleDomain) {
                        this._graph.start(this._scaleDomain[0]);
                        this._graph.end(this._scaleDomain[1]);
                    }
                    this._graph(this._element);
                }
                else {
                    if (this._storage[event.name][event.date] === undefined) {
                        this._storage[event.name][event.date] = event;
                        var i = this._seriesIndexes.indexOf(event.name);
                        this._data[i].dates.push(event.date);
                        if (this._scaleDomain) {
                            this._graph.start(this._scaleDomain[0]);
                            this._graph.end(this._scaleDomain[1]);
                        }
                        this._graph(this._element);
                    }
                }
            }
        };
        Graph.prototype.getEvent = function (name, date) {
            if (this._initialized) {
                if (this._storage[name] !== undefined && this._storage[name][date] !== undefined) {
                    return this._storage[name][date];
                }
            }
        };
        Graph._instance = null;
        return Graph;
    })();
    HawkularAlerts.Graph = Graph;
})(HawkularAlerts || (HawkularAlerts = {}));

var HawkularAlerts;
(function (HawkularAlerts) {
    ;
    var DefinitionsController = (function () {
        function DefinitionsController($scope, $window, $log, HawkularAlert) {
            this.$scope = $scope;
            this.$window = $window;
            this.$log = $log;
            this.HawkularAlert = HawkularAlert;
            $scope.status = 'all';
            $scope.msgs = [];
            this.allDefinitions();
            this.allNotifiers();
        }
        DefinitionsController.prototype.allDefinitions = function () {
            this.$scope.status = 'all';
            this.$scope.triggers = this.HawkularAlert.Trigger.query();
        };
        DefinitionsController.prototype.newDefinition = function () {
            this.$scope.status = 'new';
            this.$scope.trigger = { match: "ALL", enabled: true };
            this.$scope.dampening = { type: 'RELAXED_COUNT', evalTrueSetting: 1, evalTotalSetting: 1, evalTimeSetting: 0 };
            this.$scope.statusDampening = { status: 'new' };
            this.allNotifiers();
        };
        DefinitionsController.prototype.saveDefinition = function () {
            var _this = this;
            this.$scope.msgs = [];
            if (this.$scope.status === 'new') {
                this.HawkularAlert.Trigger.save(this.$scope.trigger, function (trigger) {
                    _this.$scope.dampening.triggerId = trigger.id;
                    _this.HawkularAlert.Dampening.save(_this.$scope.dampening, function (dampening) {
                        _this.viewDefinition(dampening.triggerId);
                    }, function (reasonDampening) {
                        _this.addAlertMsg(reasonDampening);
                    });
                }, function (reason) {
                    _this.addAlertMsg(reason);
                });
            }
            if (this.$scope.status === 'edit') {
                this.HawkularAlert.Trigger.put({ triggerId: this.$scope.trigger.id }, this.$scope.trigger, function () {
                    _this.HawkularAlert.Dampening.put(_this.$scope.dampening, function () {
                        _this.allDefinitions();
                    }, function (reasonDampening) {
                        _this.addAlertMsg(reasonDampening);
                    });
                }, function (reason) {
                    _this.addAlertMsg(reason);
                });
            }
        };
        DefinitionsController.prototype.viewDefinition = function (id) {
            var _this = this;
            this.$scope.status = 'edit';
            this.$scope.trigger = {};
            this.HawkularAlert.Trigger.get({ triggerId: id }, function (response) {
                _this.$scope.trigger = response;
            }, function (reason) {
                _this.addAlertMsg(reason);
            });
            this.allConditions(id);
            this.getDampening(id);
        };
        DefinitionsController.prototype.deleteDefinition = function (id) {
            var _this = this;
            if (this.$window.confirm('Do you want to delete ' + id + ' ?')) {
                this.$scope.msgs = [];
                this.HawkularAlert.Trigger.delete({ triggerId: id }, function () {
                    _this.HawkularAlert.Dampening.delete({ triggerId: id }, function () {
                        _this.allDefinitions();
                    }, function (reasonDampening) {
                        _this.addAlertMsg(reasonDampening);
                    });
                }, function (reason) {
                    _this.addAlertMsg(reason);
                });
            }
        };
        DefinitionsController.prototype.closeAlertMsg = function (index) {
            this.$scope.msgs.splice(index, 1);
        };
        DefinitionsController.prototype.addAlertMsg = function (reason) {
            var newAlert = { type: 'danger', msg: '' };
            if (reason.data.errorMsg) {
                newAlert.msg = reason.data.errorMsg;
            }
            else {
                newAlert.msg = reason.statusText;
            }
            this.$scope.msgs.push(newAlert);
        };
        DefinitionsController.prototype.allNotifiers = function () {
            var _this = this;
            this.$scope.notifiers = [];
            this.HawkularAlert.Notifier.query(function (result) {
                _this.$scope.notifiers = result;
            }, function (reason) {
                _this.addAlertMsg(reason);
            });
        };
        DefinitionsController.prototype.allConditions = function (triggerId) {
            var _this = this;
            this.$scope.conditions = [];
            this.$scope.statusCondition = { status: '', conditionId: '' };
            this.HawkularAlert.Trigger.conditions({ triggerId: triggerId }, function (conditionsList) {
                var conditionClass = {};
                for (var i = 0; i < conditionsList.length; i++) {
                    conditionClass[conditionsList[i].conditionId] = conditionsList[i].className;
                }
                for (i = 0; i < conditionsList.length; i++) {
                    var condition = conditionsList[i];
                    _this.HawkularAlert[condition.className].get({ conditionId: condition.conditionId }, function (conditionByType) {
                        var className = conditionClass[conditionByType.conditionId];
                        var newCondition = {
                            conditionId: conditionByType.conditionId,
                            className: className,
                            condition: conditionByType,
                            description: _this.getDescription(className, conditionByType)
                        };
                        _this.$scope.conditions.push(newCondition);
                    }, function (reasonType) {
                        _this.addAlertMsg(reasonType);
                    });
                }
            }, function (reasonList) {
                _this.addAlertMsg(reasonList);
            });
        };
        DefinitionsController.prototype.getDampening = function (triggerId) {
            var _this = this;
            this.$scope.dampening = {};
            this.$scope.statusDampening = { status: 'view' };
            this.HawkularAlert.Dampening.get({ triggerId: triggerId }, function (dampening) {
                _this.$scope.dampening = dampening;
            }, function (reason) {
                _this.$scope.dampening = { triggerId: triggerId, type: 'RELAXED_COUNT', evalTrueSetting: 1, evalTotalSetting: 1, evalTimeSetting: 0 };
                _this.HawkularAlert.Dampening.save(_this.$scope.dampening, function (reasonDampening) {
                    _this.addAlertMsg(reasonDampening);
                });
            });
        };
        DefinitionsController.prototype.saveDampening = function () {
            var _this = this;
            this.HawkularAlert.Dampening.put(this.$scope.dampening, function () {
                _this.$scope.statusDampening.status = 'view';
            }, function (reason) {
                _this.addAlertMsg(reason);
            });
        };
        DefinitionsController.prototype.deleteDampening = function (triggerId) {
            var _this = this;
            this.HawkularAlert.Dampening.delete({ triggerId: triggerId }, function (reason) {
                _this.addAlertMsg(reason);
            });
        };
        DefinitionsController.prototype.viewDampening = function (triggerId) {
            this.$scope.statusDampening = { status: 'edit' };
        };
        DefinitionsController.prototype.getDescription = function (className, condition) {
            var description = "";
            var op = "";
            if (className === 'AvailabilityCondition') {
                description = condition.dataId + " is " + condition.operator;
            }
            else if (className === 'CompareCondition') {
                op = this.getOperator(condition.operator);
                description = condition.data1Id + " " + op + " " + "(" + condition.data2Multiplier + " * " + condition.data2Id + ")";
            }
            else if (className === 'StringCondition') {
                description = condition.dataId + " " + condition.operator + " '" + condition.pattern + "' (A/a " + condition.ignoreCase + ")";
            }
            else if (className === 'ThresholdCondition') {
                op = this.getOperator(condition.operator);
                description = condition.dataId + " " + op + " " + condition.threshold;
            }
            else if (className === 'ThresholdRangeCondition') {
                var low = "[";
                var high = "]";
                if (condition.operatorLow !== 'INCLUSIVE') {
                    low = "(";
                }
                if (condition.operatorHigh !== 'INCLUSIVE') {
                    high = ")";
                }
                var inout = " in ";
                if (!condition.inRange) {
                    inout = " out ";
                }
                description = condition.dataId + inout + low + condition.thresholdLow + ", " + condition.thresholdHigh + high;
            }
            return description;
        };
        DefinitionsController.prototype.getOperator = function (opCode) {
            var op = "";
            if (opCode === 'GT') {
                op = ">";
            }
            else if (opCode === 'GTE') {
                op = ">=";
            }
            else if (opCode === 'LT') {
                op = "<";
            }
            else if (opCode === 'LTE') {
                op = "<=";
            }
            return op;
        };
        DefinitionsController.prototype.newCondition = function () {
            this.$scope.statusCondition = { status: 'new', conditionId: '', className: 'AvailabilityCondition' };
            this.$scope.editCondition = { triggerId: this.$scope.trigger.id, conditionSetSize: 1, conditionSetIndex: 1 };
            this.$scope.classNames = ['AvailabilityCondition', 'CompareCondition', 'StringCondition', 'ThresholdCondition', 'ThresholdRangeCondition'];
            this.changeConditionType();
        };
        DefinitionsController.prototype.changeConditionType = function () {
            if (this.$scope.statusCondition.className === 'AvailabilityCondition') {
                this.$scope.editCondition.dataId = '';
                this.$scope.editCondition.operator = 'DOWN';
            }
            else if (this.$scope.statusCondition.className === 'CompareCondition') {
                this.$scope.editCondition.data1Id = '';
                this.$scope.editCondition.operator = 'LT';
                this.$scope.editCondition.data2Multiplier = 1.0;
                this.$scope.editCondition.data2Id = '';
            }
            else if (this.$scope.statusCondition.className === 'StringCondition') {
                this.$scope.editCondition.dataId = '';
                this.$scope.editCondition.operator = 'EQUAL';
                this.$scope.editCondition.pattern = '';
                this.$scope.editCondition.ignoreCase = false;
            }
            else if (this.$scope.statusCondition.className === 'ThresholdCondition') {
                this.$scope.editCondition.dataId = '';
                this.$scope.editCondition.operator = 'LT';
                this.$scope.editCondition.threshold = 0.0;
            }
            else if (this.$scope.statusCondition.className === 'ThresholdRangeCondition') {
                this.$scope.editCondition.dataId = '';
                this.$scope.editCondition.operatorLow = 'INCLUSIVE';
                this.$scope.editCondition.operatorHigh = 'INCLUSIVE';
                this.$scope.editCondition.thresholdLow = 0.0;
                this.$scope.editCondition.thresholdHigh = 0.0;
                this.$scope.editCondition.inRange = true;
            }
        };
        DefinitionsController.prototype.viewCondition = function (condition) {
            this.$scope.statusCondition = { status: 'edit', conditionId: condition.conditionId, className: condition.className };
            this.$scope.editCondition = condition.condition;
        };
        DefinitionsController.prototype.saveCondition = function () {
            var _this = this;
            if (this.$scope.statusCondition.status === 'new') {
                var updatedCondition = this.prepareCondition(this.$scope.statusCondition.className, this.$scope.editCondition);
                this.HawkularAlert[this.$scope.statusCondition.className].save(updatedCondition, function () {
                    _this.$scope.statusCondition = { status: '' };
                    _this.viewDefinition(_this.$scope.trigger.id);
                }, function (reason) {
                    _this.addAlertMsg(reason);
                });
            }
            else {
                this.HawkularAlert[this.$scope.statusCondition.className].delete({ conditionId: this.$scope.editCondition.conditionId }, function () {
                    var updatedCondition = _this.prepareCondition(_this.$scope.statusCondition.className, _this.$scope.editCondition);
                    _this.HawkularAlert[_this.$scope.statusCondition.className].save(updatedCondition, function () {
                        _this.$scope.statusCondition = { status: '' };
                        _this.viewDefinition(_this.$scope.trigger.id);
                    }, function (reason) {
                        _this.addAlertMsg(reason);
                    });
                }, function (reasonDelete) {
                    _this.addAlertMsg(reasonDelete);
                });
            }
        };
        DefinitionsController.prototype.deleteCondition = function (conditionId, className) {
            var _this = this;
            if (this.$window.confirm('Do you want to delete ' + conditionId + ' ?')) {
                this.$log.debug('deleteCondition(' + conditionId + ')');
                this.$scope.msgs = [];
                this.HawkularAlert[className].delete({ conditionId: conditionId }, function () {
                    _this.$scope.statusCondition = { status: '' };
                    _this.viewDefinition(_this.$scope.trigger.id);
                }, function (reasonDelete) {
                    _this.addAlertMsg(reasonDelete);
                });
            }
        };
        DefinitionsController.prototype.cancelCondition = function () {
            this.$scope.statusCondition = { status: '' };
        };
        DefinitionsController.prototype.reloadDefinitions = function () {
            this.$log.info('reloadDefinitions()');
            this.HawkularAlert.Alert.reload();
        };
        DefinitionsController.prototype.prepareCondition = function (className, condition) {
            var updatedCondition = {};
            updatedCondition.triggerId = condition.triggerId;
            updatedCondition.conditionSetSize = condition.conditionSetSize;
            updatedCondition.conditionSetIndex = condition.conditionSetIndex;
            if (className === 'AvailabilityCondition') {
                updatedCondition.dataId = condition.dataId;
                updatedCondition.operator = condition.operator;
            }
            else if (className === 'CompareCondition') {
                updatedCondition.data1Id = condition.data1Id;
                updatedCondition.operator = condition.operator;
                updatedCondition.data2Multiplier = condition.data2Multiplier;
                updatedCondition.data2Id = condition.data2Id;
            }
            else if (className === 'StringCondition') {
                updatedCondition.dataId = condition.dataId;
                updatedCondition.operator = condition.operator;
                updatedCondition.pattern = condition.pattern;
                updatedCondition.ignoreCase = condition.ignoreCase;
            }
            else if (className === 'ThresholdCondition') {
                updatedCondition.dataId = condition.dataId;
                updatedCondition.operator = condition.operator;
                updatedCondition.threshold = condition.threshold;
            }
            else if (className === 'ThresholdRangeCondition') {
                updatedCondition.dataId = condition.dataId;
                updatedCondition.operatorLow = condition.operatorLow;
                updatedCondition.operatorHigh = condition.operatorHigh;
                updatedCondition.thresholdLow = condition.thresholdLow;
                updatedCondition.thresholdHigh = condition.thresholdHigh;
                updatedCondition.inRange = condition.inRange;
            }
            return updatedCondition;
        };
        DefinitionsController.$inject = ['$scope', '$window', '$log', 'HawkularAlert'];
        return DefinitionsController;
    })();
    HawkularAlerts.DefinitionsController = DefinitionsController;
    ;
    HawkularAlerts._module.controller('HawkularAlerts.DefinitionsController', DefinitionsController);
})(HawkularAlerts || (HawkularAlerts = {}));

var HawkularAlerts;
(function (HawkularAlerts) {
    ;
    var NotifiersController = (function () {
        function NotifiersController($scope, $interval, $log, HawkularAlert) {
            this.$scope = $scope;
            this.$interval = $interval;
            this.$log = $log;
            this.HawkularAlert = HawkularAlert;
            $scope.status = 'all';
            $scope.msgs = [];
            $scope.notifiers = [];
            $scope.notifierTypes = [];
            this.allNotifiers();
        }
        NotifiersController.prototype.allNotifiers = function () {
            var _this = this;
            this.$scope.status = 'all';
            this.$scope.notifiers = [];
            this.HawkularAlert.Notifier.query(function (notifiers) {
                for (var i = 0; i < notifiers.length; i++) {
                    _this.HawkularAlert.Notifier.get({ notifierId: notifiers[i] }, function (notifier) {
                        var newNotifier = { notifierId: '', notifierType: notifier.NotifierType, description: notifier.description };
                        if (notifier.NotifierID) {
                            newNotifier.notifierId = notifier.NotifierID;
                        }
                        if (notifier.NotifierId) {
                            newNotifier.notifierId = notifier.NotifierId;
                        }
                        _this.$scope.notifiers.push(newNotifier);
                    }, function (reasonNotifier) {
                        _this.addAlertMsg(reasonNotifier);
                    });
                }
            }, function (reason) {
                _this.addAlertMsg(reason);
            });
        };
        NotifiersController.prototype.newNotifier = function () {
            var _this = this;
            this.$scope.status = 'new';
            this.$scope.notifier = {};
            this.$scope.notifierTypes = [];
            this.HawkularAlert.NotifierType.query(function (notifierTypes) {
                for (var i = 0; i < notifierTypes.length; i++) {
                    if (i === 0) {
                        _this.$scope.notifier.notifierType = notifierTypes[0];
                    }
                    _this.$scope.notifierTypes.push(notifierTypes[i]);
                }
            });
        };
        NotifiersController.prototype.viewNotifier = function (notifierId) {
            var _this = this;
            this.$scope.status = 'edit';
            this.$scope.notifier = {};
            this.$scope.notifierTypes = [];
            this.HawkularAlert.Notifier.get({ notifierId: notifierId }, function (notifier) {
                _this.$scope.notifier = { notifierId: '', notifierType: notifier.NotifierType, description: notifier.description };
                if (notifier.NotifierID) {
                    _this.$scope.notifier.notifierId = notifier.NotifierID;
                }
                if (notifier.NotifierId) {
                    _this.$scope.notifier.notifierId = notifier.NotifierId;
                }
            }, function (reason) {
                _this.addAlertMsg(reason);
            });
            this.HawkularAlert.NotifierType.query(function (notifierTypes) {
                for (var i = 0; i < notifierTypes.length; i++) {
                    _this.$scope.notifierTypes.push(notifierTypes[i]);
                }
            });
        };
        NotifiersController.prototype.saveNotifier = function () {
            var _this = this;
            var newNotifier = {
                NotifierId: this.$scope.notifier.notifierId,
                NotifierType: this.$scope.notifier.notifierType,
                description: this.$scope.notifier.description
            };
            if (this.$scope.status === 'new') {
                this.HawkularAlert.Notifier.save(newNotifier, function () {
                    _this.allNotifiers();
                }, function (reason) {
                    _this.addAlertMsg(reason);
                });
            }
            else {
                this.HawkularAlert.Notifier.put({ notifierId: newNotifier.NotifierId }, newNotifier, function () {
                    _this.allNotifiers();
                }, function (reason) {
                    _this.addAlertMsg(reason);
                });
            }
        };
        NotifiersController.prototype.deleteNotifier = function (notifierId) {
            var _this = this;
            this.HawkularAlert.Notifier.delete({ notifierId: notifierId }, function () {
                _this.allNotifiers();
            }, function (reason) {
                _this.addAlertMsg(reason);
            });
        };
        NotifiersController.prototype.addAlertMsg = function (reason) {
            var newAlert = { type: 'danger', msg: '' };
            if (reason.data.errorMsg) {
                newAlert.msg = reason.data.errorMsg;
            }
            else {
                newAlert.msg = reason.statusText;
            }
            this.$scope.msgs.push(newAlert);
        };
        NotifiersController.prototype.closeAlertMsg = function (index) {
            this.$scope.msgs.splice(index, 1);
        };
        NotifiersController.$inject = ['$scope', '$interval', '$log', 'HawkularAlert'];
        return NotifiersController;
    })();
    HawkularAlerts.NotifiersController = NotifiersController;
    ;
    HawkularAlerts._module.controller('HawkularAlerts.NotifiersController', NotifiersController);
})(HawkularAlerts || (HawkularAlerts = {}));

angular.module("hawkular-alerts-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/alerts/html/dashboard.html","<style>\n  .zoom {\n    fill: transparent;\n    cursor: pointer;\n  }\n\n  .y-axis path,\n  .y-axis line,\n  .x-axis path,\n  .x-axis line {\n    stroke: black;\n    fill: none;\n    stroke-width: 1px;\n  }\n\n  .y-axis g line {\n    stroke: grey;\n    fill: none;\n    stroke-width: 1px;\n  }\n\n  .graph-body .line circle {\n    opacity: 0.2;\n  }\n\n  .start, .end {\n    font-weight: bold;\n  }\n\n  g.line text {\n  }\n</style>\n<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"HawkularAlerts.DashboardController as dsc\">\n    <h1>Alerts Dashboard</h1>\n    <div id=\"alertsDashboard\"></div>\n    <div class=\"col-md-8 col-md-offset-2\" ng-show=\"legend != null\">\n      <div class=\"dataTables_wrapper no-footer\">\n        <div class=\"dataTables_header\">\n          <div class=\"dataTables_info\">Alert at <b>{{ legend.date | date:\'d MMM, y hh:mm:ss a\' }}</b></div>\n        </div>\n        <table class=\"datatable table table-striped table-bordered dataTable no-footer\" role=\"grid\">\n          <thead>\n          <tr role=\"row\">\n            <th> EvalSet</th>\n            <th> Conditions</th>\n          </tr>\n          </thead>\n          <tbody>\n          <tr ng-repeat=\"evalSet in legend.evalSets\" ng-class-odd=\"\'gradeA odd\'\" ng-class-even=\"\'gradeA even\'\" >\n            <td></td>\n            <td>\n              <ul class=\"list-unstyled\">\n                <li ng-repeat=\"condition in evalSet\">\n                  <b>{{ condition.log }}</b> at <i>{{ condition.evalTimestamp | date:\'d MMM, y hh:mm:ss a\'}}</i>\n                </li>\n              </ul>\n              {{ match.time | date:\'d MMM, y hh:mm:ss a\'}}\n            </td>\n          </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n    <div class=\"col-md-6\">\n      <p>\n        <a href ng-click=\"dsc.showRefreshForm()\"><span class=\"pficon pficon-refresh\"></span> Refresh Config</a>\n      </p>\n      <form ng-if=\"showRefresh\" class=\"form-horizontal\" ng-submit=\"dsc.updateRefresh()\">\n        <div class=\"form-group\">\n          <label class=\"col-md-4 control-label\" for=\"refreshInput\">\n            Refresh (ms):\n          </label>\n          <div class=\"col-md-3\">\n            <input type=\"number\" id=\"refreshInput\" ng-model=\"refresh.interval\" class=\"form-control\" ng-minlength=\"1\" required>\n          </div>\n        </div>\n        <div class=\"form-group\">\n          <div class=\"col-md-6 col-md-offset-4\">\n            <button type=\"submit\" class=\"btn btn-primary\">Change</button>\n            <button type=\"button\" class=\"btn btn-default\" ng-click=\"dsc.hideRefreshForm()\">Cancel</button>\n          </div>\n        </div>\n      </form>\n      <alert ng-repeat=\"alertMsg in msgs\" type=\"{{alertMsg.type}}\" close=\"dsc.closeAlertMsg($index)\">{{alertMsg.msg}}</alert>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/alerts/html/definitions.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"HawkularAlerts.DefinitionsController as dc\">\n\n    <div ng-if=\"status == \'all\'\" ng-include=\"\'plugins/alerts/html/definitionsAll.html\'\"></div>\n\n    <div ng-if=\"status == \'new\'\" ng-include=\"\'plugins/alerts/html/definitionsNew.html\'\"></div>\n\n    <div ng-if=\"status == \'edit\'\" ng-include=\"\'plugins/alerts/html/definitionsEdit.html\'\"></div>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/alerts/html/definitionsAll.html","<h1>Trigger Definitions</h1>\n<div class=\"dataTables_wrapper no-footer\">\n  <div class=\"dataTables_header\">\n    <div class=\"text-right\">\n      <button ng-click=\"dc.newDefinition()\" type=\"button\" class=\"btn btn-primary\">New Trigger</button>\n      <button ng-click=\"dc.allDefinitions()\" type=\"button\" class=\"btn btn-info\">Refresh</button>\n      <button ng-click=\"dc.reloadDefinitions()\" type=\"button\" class=\"btn btn-success\">Reload</button>\n    </div>\n  </div>\n  <table class=\"datatable table table-striped table-bordered dataTable no-footer\" role=\"grid\">\n    <thead>\n    <tr role=\"row\">\n      <th class=\"vert-align\">Id</th>\n      <th class=\"vert-align\">Enabled</th>\n      <th class=\"vert-align\">Name</th>\n      <th class=\"vert-align\">Description</th>\n      <th class=\"vert-align\">Match</th>\n      <th class=\"vert-align\">Notifiers</th>\n      <th></th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr ng-repeat=\"trigger in triggers | orderBy:[\'id\', \'name\']:false\" ng-class-odd=\"\'gradeA odd\'\" ng-class-even=\"\'gradeA even\'\" >\n      <td class=\"vert-align\">{{ trigger.id }}</td>\n      <td class=\"vert-align\">{{ trigger.enabled }}</td>\n      <td class=\"vert-align\">{{ trigger.name }}</td>\n      <td class=\"vert-align\">{{ trigger.description }}</td>\n      <td class=\"vert-align\">{{ trigger.match }}</td>\n      <td class=\"vert-align\">\n        <ul class=\"list-unstyled\">\n          <li ng-repeat=\"notifier in trigger.notifiers\">{{ notifier }}</li>\n        </ul>\n      </td>\n      <td style=\"vertical-align: middle;\">\n        <div class=\"text-right\">\n          <a ng-click=\"dc.viewDefinition(trigger.id)\" class=\"btn btn-primary\">View</a>\n          <a class=\"btn btn-danger\" ng-click=\"dc.deleteDefinition(trigger.id)\">Delete</a>\n        </div>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n</div>\n\n");
$templateCache.put("plugins/alerts/html/definitionsConditions.html","<div class=\"dataTables_wrapper no-footer\">\n  <div class=\"dataTables_header\" ng-if=\"statusCondition.status != \'new\'\">\n    <div class=\"text-right\">\n      <button  type=\"button\" class=\"btn btn-primary\"\n          ng-click=\"dc.newCondition()\">New Condition</button>\n    </div>\n  </div>\n  <div ng-if=\"statusCondition.status == \'new\'\" class=\"col-md-12\"\n       ng-include=\"\'plugins/alerts/html/definitionsConditionsEdit.html\'\">\n  </div>\n  <table class=\"datatable table table-striped table-bordered dataTable no-footer\" role=\"grid\">\n    <thead>\n    <tr role=\"row\">\n      <th class=\"vert-align\">Condition</th>\n      <th class=\"vert-align\">Description</th>\n      <th></th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr ng-repeat-start=\"condition in conditions | orderBy:[\'conditionId\', \'description\']:false\" ng-class-odd=\"\'gradeA odd\'\" ng-class-even=\"\'gradeA even\'\" >\n      <td class=\"vert-align\">{{ condition.conditionId }}</td>\n      <td class=\"vert-align\">{{ condition.description }}</td>\n      <td style=\"vertical-align: middle;\">\n        <div class=\"text-right\">\n          <a ng-if=\"!(statusCondition.status == \'edit\' && statusCondition.conditionId == condition.conditionId)\"\n             ng-click=\"dc.viewCondition(condition)\" class=\"btn btn-primary\">View</a>\n          <a ng-if=\"!(statusCondition.status == \'edit\' && statusCondition.conditionId == condition.conditionId)\"\n             class=\"btn btn-danger\" ng-click=\"dc.deleteCondition(condition.conditionId, condition.className)\">Delete</a>\n        </div>\n      </td>\n    </tr>\n    <tr ng-if=\"statusCondition.status == \'edit\' && statusCondition.conditionId == condition.conditionId\" ng-repeat-end=\"\">\n      <td colspan=\"3\">\n        <div class=\"col-md-12\" ng-include=\"\'plugins/alerts/html/definitionsConditionsEdit.html\'\">\n        </div>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n</div>");
$templateCache.put("plugins/alerts/html/definitionsConditionsEdit.html","<h4 class=\"h5\">{{statusCondition.className}}</h4>\n<form class=\"form-horizontal\" name=\"editConditionForm\">\n  <div ng-if=\"statusCondition.status == \'new\'\" class=\"form-group\">\n    <label class=\"col-md-4 control-label\" for=\"newConditionType\">\n      Condition Type\n    </label>\n    <div class=\"col-md-6\">\n      <ui-select ng-if=\"statusCondition.status == \'new\'\" id=\"newConditionType\"\n                 ng-model=\"statusCondition.className\" theme=\"bootstrap\"\n                 ng-change=\"dc.changeConditionType()\">\n        <ui-select-match placeholder=\"Select condition type...\">{{$select.selected}}</ui-select-match>\n        <ui-select-choices repeat=\"classLabel in classNames | filter:$select.search\">\n          {{ classLabel }}\n        </ui-select-choices>\n      </ui-select>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-4 control-label\" for=\"conditionSetSize\">\n      Condition Set Size\n    </label>\n    <div class=\"col-md-6\">\n      <input type=\"number\" id=\"conditionSetSize\" ng-model=\"editCondition.conditionSetSize\" class=\"form-control\" ng-minlength=\"1\" required>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-4 control-label\" for=\"conditionSetIndex\">\n      Condition Set Index\n    </label>\n    <div class=\"col-md-6\">\n      <input type=\"number\" id=\"conditionSetIndex\" ng-model=\"editCondition.conditionSetIndex\" class=\"form-control\" ng-minlength=\"1\" required>\n    </div>\n  </div>\n\n  <div ng-if=\"statusCondition.className == \'AvailabilityCondition\'\">\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"availabilityDataId\">\n        Data Id\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"availabilityDataId\" ng-model=\"editCondition.dataId\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">\n        Operator\n      </label>\n      <div class=\"col-md-6\">\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"UP\"> UP\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"NOT_UP\"> NOT_UP\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"DOWN\"> DOWN\n        </label>\n      </div>\n    </div>\n  </div>\n\n  <div ng-if=\"statusCondition.className == \'CompareCondition\'\">\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"compareData1Id\">\n        Data 1 Id\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"compareData1Id\" ng-model=\"editCondition.data1Id\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">\n        Operator\n      </label>\n      <div class=\"col-md-6\">\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"LT\"> <\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"GT\"> >\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"LTE\"> <=\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"GTE\"> >=\n        </label>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"compareData2Id\">\n        Data 2 Id\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"compareData2Id\" ng-model=\"editCondition.data2Id\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"compareData2Multiplier\">\n        Data 2 Multiplier\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"number\" id=\"compareData2Multiplier\" ng-model=\"editCondition.data2Multiplier\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n  </div>\n\n  <div ng-if=\"statusCondition.className == \'StringCondition\'\">\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"stringDataId\">\n        Data Id\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"stringDataId\" ng-model=\"editCondition.dataId\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">\n        Operator\n      </label>\n      <div class=\"col-md-6\">\n        <label class=\"radio\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"EQUAL\"> EQUAL\n        </label>\n        <label class=\"radio\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"NOT_EQUAL\"> NOT_EQUAL\n        </label>\n        <label class=\"radio\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"STARTS_WITH\"> START_WITH\n        </label>\n        <label class=\"radio\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"ENDS_WITH\"> ENDS_WITH\n        </label>\n        <label class=\"radio\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"CONTAINS\"> CONTAINS\n        </label>\n        <label class=\"radio\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"MATCH\"> MATCH\n        </label>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"pattern\">\n        Pattern\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"pattern\" ng-model=\"editCondition.pattern\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"ignoredCase\">\n        Ignore Case\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"checkbox\" id=\"ignoredCase\" ng-model=\"editCondition.ignoreCase\" class=\"checkbox\" >\n      </div>\n    </div>\n  </div>\n\n  <div ng-if=\"statusCondition.className == \'ThresholdCondition\'\">\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"thresholdDataId\">\n        Data Id\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"thresholdDataId\" ng-model=\"editCondition.dataId\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">\n        Operator\n      </label>\n      <div class=\"col-md-6\">\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"LT\"> <\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"GT\"> >\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"LTE\"> <=\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operator\" class=\"radio\" value=\"GTE\"> >=\n        </label>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"threshold\">\n        Threshold\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"number\" id=\"threshold\" ng-model=\"editCondition.threshold\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n  </div>\n\n  <div ng-if=\"statusCondition.className == \'ThresholdRangeCondition\'\">\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"thresholdRangeDataId\">\n        Data Id\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"thresholdRangeDataId\" ng-model=\"editCondition.dataId\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">\n        In Range:\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"checkbox\" ng-model=\"editCondition.inRange\" class=\"checkbox\" >\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">\n        Operator Low\n      </label>\n      <div class=\"col-md-6\">\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operatorLow\" class=\"radio\" value=\"INCLUSIVE\"> [\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operatorLow\" class=\"radio\" value=\"EXCLUSIVE\"> (\n        </label>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"thresholdLow\">\n        Threshold Low\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"number\" id=\"thresholdLow\" ng-model=\"editCondition.thresholdLow\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"thresholdHigh\">\n        Threshold High\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"number\" id=\"thresholdHigh\" ng-model=\"editCondition.thresholdHigh\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">\n        Operator High\n      </label>\n      <div class=\"col-md-6\">\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operatorHigh\" class=\"radio\" value=\"INCLUSIVE\"> ]\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"editCondition.operatorHigh\" class=\"radio\" value=\"EXCLUSIVE\"> )\n        </label>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <div class=\"col-md-offset-4 col-md-6\">\n      <button ng-click=\"dc.saveCondition()\" class=\"btn btn-primary\">Save</button>\n      <a ng-if=\"statusCondition.status != \'new\'\" class=\"btn btn-danger\" ng-click=\"dc.deleteCondition(statusCondition.conditionId, statusCondition.className)\">Delete</a>\n      <button type=\"button\" ng-click=\"dc.cancelCondition()\" class=\"btn btn-default\">Cancel</button>\n    </div>\n  </div>\n</form>");
$templateCache.put("plugins/alerts/html/definitionsDampening.html","<div class=\"dataTables_wrapper no-footer\">\n  <table ng-if=\"statusDampening.status == \'view\'\" class=\"datatable table table-striped table-bordered dataTable no-footer\" role=\"grid\">\n    <thead>\n    <tr role=\"row\">\n      <th class=\"vert-align\">Type</th>\n      <th class=\"vert-align\">True Evals</th>\n      <th class=\"vert-align\">Total Evals</th>\n      <th class=\"vert-align\">Eval Period</th>\n      <th></th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr class=\"gradeA odd\">\n      <td class=\"vert-align\">{{ dampening.type }}</td>\n      <td class=\"vert-align\">{{ dampening.evalTrueSetting }}</td>\n      <td class=\"vert-align\">{{ dampening.evalTotalSetting }}</td>\n      <td class=\"vert-align\">{{ dampening.evalTimeSetting }}</td>\n      <td style=\"vertical-align: middle;\">\n        <div class=\"text-right\">\n          <a ng-click=\"dc.viewDampening()\" class=\"btn btn-primary\">View</a>\n        </div>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n</div>\n<div ng-if=\"statusDampening.status == \'edit\' || statusDampening.status == \'new\'\" class=\"col-md-12\">\n  <div class=\"form-group\">\n    <label class=\"col-md-4 control-label\">\n      Type\n    </label>\n    <div class=\"col-md-6\">\n      <label class=\"radio\">\n        <input type=\"radio\" ng-model=\"dampening.type\" class=\"radio\" value=\"STRICT\"> STRICT\n      </label>\n      <label class=\"radio\">\n        <input type=\"radio\" ng-model=\"dampening.type\" class=\"radio\" value=\"RELAXED_COUNT\"> RELAXED_COUNT\n      </label>\n      <label class=\"radio\">\n        <input type=\"radio\" ng-model=\"dampening.type\" class=\"radio\" value=\"RELAXED_TIME\"> RELAXED_TIME\n      </label>\n      <label class=\"radio\">\n        <input type=\"radio\" ng-model=\"dampening.type\" class=\"radio\" value=\"STRICT_TIME\"> STRICT_TIME\n      </label>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-4 control-label\" for=\"trueEvals\">\n      True Evals\n    </label>\n    <div class=\"col-md-6\">\n      <input type=\"number\" id=\"trueEvals\" ng-model=\"dampening.evalTrueSetting\" class=\"form-control\" ng-minlength=\"1\" required>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-4 control-label\" for=\"totalEvals\">\n      Total Evals\n    </label>\n    <div class=\"col-md-6\">\n      <input type=\"number\" id=\"totalEvals\" ng-model=\"dampening.evalTotalSetting\" class=\"form-control\" ng-minlength=\"1\" required>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-4 control-label\" for=\"evalPeriod\">\n      Eval Period\n    </label>\n    <div class=\"col-md-6\">\n      <input type=\"number\" id=\"evalPeriod\" ng-model=\"dampening.evalTimeSetting\" class=\"form-control\" ng-minlength=\"1\" required>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <div class=\"col-md-offset-4 col-md-6\">\n      <button ng-click=\"dc.saveDampening()\" class=\"btn btn-primary\">Save</button>\n      <button type=\"button\" ng-click=\"dc.getDampening(trigger.id)\" class=\"btn btn-default\">Cancel</button>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/alerts/html/definitionsEdit.html","<h1>{{ trigger.name }}</h1>\n<div class=\"col-md-12\">\n  <form class=\"form-horizontal\" name=\"editTriggerForm\">\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"triggerId\">\n        Id\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"triggerId\" ng-model=\"trigger.id\" class=\"form-control\" ng-minlength=\"1\" required disabled>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"triggerEnabled\">\n        Enabled\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"checkbox\" id=\"triggerEnabled\" ng-model=\"trigger.enabled\" class=\"checkbox\" >\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"triggerName\">\n        Name\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"triggerName\" ng-model=\"trigger.name\" ng-minlength=\"1\" class=\"form-control\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"triggerDescription\">\n        Description\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"triggerDescription\" ng-model=\"trigger.description\" class=\"form-control\">\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\">\n        Match\n      </label>\n      <div class=\"col-md-6\">\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"trigger.match\" class=\"radio\" value=\"ALL\"> ALL\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"trigger.match\" class=\"radio\" value=\"ANY\"> ANY\n        </label>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"triggerNotifiers\">\n        Notifiers\n      </label>\n      <div class=\"col-md-6\">\n        <ui-select id=\"triggerNotifiers\" multiple ng-model=\"trigger.notifiers\" theme=\"bootstrap\" ng-disabled=\"disabled\" close-on-select=\"false\">\n          <ui-select-match placeholder=\"Select notifier...\">{{$item}}</ui-select-match>\n          <ui-select-choices repeat=\"notifier in notifiers | filter:$select.search\">\n            {{ notifier }}\n          </ui-select-choices>\n        </ui-select>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\">\n        <h2 class=\"h4\">Dampening</h2>\n      </label>\n      <div class=\"col-md-6\" ng-include=\"\'plugins/alerts/html/definitionsDampening.html\'\">\n\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\">\n        <h2 class=\"h4\">Conditions</h2>\n      </label>\n      <div class=\"col-md-6\" ng-include=\"\'plugins/alerts/html/definitionsConditions.html\'\">\n\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"col-md-offset-2 col-md-6\">\n        <button class=\"btn btn-primary\" ng-click=\"dc.saveDefinition()\">Save</button>\n        <a class=\"btn btn-danger\" ng-click=\"dc.deleteDefinition(trigger.id)\">Delete</a>\n        <button type=\"button\" ng-click=\"dc.allDefinitions()\" class=\"btn btn-default\">Cancel</button>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"col-md-offset-2 col-md-6\">\n        <alert ng-repeat=\"alertMsg in msgs\" type=\"{{alertMsg.type}}\" close=\"dc.closeAlertMsg($index)\">{{alertMsg.msg}}</alert>\n      </div>\n    </div>\n  </form>\n</div>\n\n\n");
$templateCache.put("plugins/alerts/html/definitionsNew.html","<h1>New Trigger Definition</h1>\n<div class=\"col-md-12\">\n  <form class=\"form-horizontal\" name=\"newTriggerForm\" ng-submit=\"dc.saveDefinition()\">\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"triggerId\">\n        Id\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"triggerId\" ng-model=\"trigger.id\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"triggerEnabled\">\n        Enabled\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"checkbox\" id=\"triggerEnabled\" ng-model=\"trigger.enabled\" class=\"checkbox\" >\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"triggerName\">\n        Name\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"triggerName\" ng-model=\"trigger.name\" ng-minlength=\"1\" class=\"form-control\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"triggerDescription\">\n        Description\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"triggerDescription\" ng-model=\"trigger.description\" class=\"form-control\">\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\">\n        Match\n      </label>\n      <div class=\"col-md-6\">\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"trigger.match\" class=\"radio\" value=\"ALL\"> ALL\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" ng-model=\"trigger.match\" class=\"radio\" value=\"ANY\"> ANY\n        </label>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"triggerNotifiers\">\n        Notifiers\n      </label>\n      <div class=\"col-md-6\">\n        <ui-select id=\"triggerNotifiers\" multiple ng-model=\"trigger.notifiers\" theme=\"bootstrap\" ng-disabled=\"disabled\" close-on-select=\"false\">\n          <ui-select-match placeholder=\"Select notifier...\">{{$item}}</ui-select-match>\n          <ui-select-choices repeat=\"notifier in notifiers | filter:$select.search\">\n            {{ notifier }}\n          </ui-select-choices>\n        </ui-select>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\">\n        <h2 class=\"h4\">Dampening</h2>\n      </label>\n      <div class=\"col-md-6\" ng-include=\"\'plugins/alerts/html/definitionsDampening.html\'\">\n\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"col-md-offset-2 col-md-6\">\n        <button type=\"submit\" class=\"btn btn-primary\">Save</button>\n        <button type=\"button\" ng-click=\"dc.allDefinitions()\" class=\"btn btn-default\">Cancel</button>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"col-md-offset-2 col-md-6\">\n        <alert ng-repeat=\"alertMsg in msgs\" type=\"{{alertMsg.type}}\" close=\"dc.closeAlertMsg($index)\">{{alertMsg.msg}}</alert>\n      </div>\n    </div>\n  </form>\n</div>\n");
$templateCache.put("plugins/alerts/html/actions.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"HawkularAlerts.NotifiersController as nc\">\n\n    <div ng-if=\"status == \'all\'\" ng-include=\"\'plugins/alerts/html/actionsAll.html\'\"></div>\n\n    <div ng-if=\"status == \'new\'\" ng-include=\"\'plugins/alerts/html/actionsNew.html\'\"></div>\n\n    <div ng-if=\"status == \'edit\'\" ng-include=\"\'plugins/alerts/html/actionsEdit.html\'\"></div>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/alerts/html/actionsAll.html","<h1>Notifiers</h1>\n<div class=\"dataTables_wrapper no-footer\">\n  <div class=\"dataTables_header\">\n    <div class=\"text-right\">\n      <button ng-click=\"nc.newNotifier()\" type=\"button\" class=\"btn btn-primary\">New Notifier</button>\n      <button ng-click=\"nc.allNotifiers()\" type=\"button\" class=\"btn btn-info\">Refresh</button>\n    </div>\n  </div>\n  <table class=\"datatable table table-striped table-bordered dataTable no-footer\" role=\"grid\">\n    <thead>\n    <tr role=\"row\">\n      <th class=\"vert-align\">Notifier Id</th>\n      <th class=\"vert-align\">Notifier Type</th>\n      <th class=\"vert-align\">Description</th>\n      <th></th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr ng-repeat=\"notifier in notifiers | orderBy:[\'notifierId\', \'notifierType\']:false\" ng-class-odd=\"\'gradeA odd\'\" ng-class-even=\"\'gradeA even\'\" >\n      <td class=\"vert-align\">{{ notifier.notifierId }}</td>\n      <td class=\"vert-align\">{{ notifier.notifierType }}</td>\n      <td class=\"vert-align\">{{ notifier.description }}</td>\n      <td style=\"vertical-align: middle;\">\n        <div class=\"text-right\">\n          <a ng-click=\"nc.viewNotifier(notifier.notifierId)\" class=\"btn btn-primary\">View</a>\n          <a class=\"btn btn-danger\" ng-click=\"nc.deleteNotifier(notifier.notifierId)\">Delete</a>\n        </div>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n</div>\n\n");
$templateCache.put("plugins/alerts/html/actionsEdit.html","<h1>{{ notifier.notifierId }}</h1>\n<div class=\"col-md-12\">\n  <form class=\"form-horizontal\" name=\"editNotifierForm\" ng-submit=\"nc.saveNotifier()\">\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"notifierId\">\n        Notifier Id\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"notifierId\" ng-model=\"notifier.notifierId\" class=\"form-control\" ng-minlength=\"1\" disabled>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"notifierType\">\n        Notifier Type\n      </label>\n      <div class=\"col-md-6\">\n        <select ng-model=\"notifier.notifierType\" id=\"notifierType\">\n          <option ng-repeat=\"notifierType in notifierTypes\" ng-selected=\"notifier.notifierType == notifierType\"> {{ notifierType }}</option>\n        </select>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"notifierDescription\">\n        Description\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"notifierDescription\" ng-model=\"notifier.description\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"col-md-offset-2 col-md-6\">\n        <button type=\"submit\" class=\"btn btn-primary\">Save</button>\n        <button type=\"button\" ng-click=\"nc.allNotifiers()\" class=\"btn btn-default\">Cancel</button>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"col-md-offset-2 col-md-6\">\n        <alert ng-repeat=\"alertMsg in msgs\" type=\"{{alertMsg.type}}\" close=\"nc.closeAlertMsg($index)\">{{alertMsg.msg}}</alert>\n      </div>\n    </div>\n  </form>\n</div>\n");
$templateCache.put("plugins/alerts/html/actionsNew.html","<h1>New Notifier</h1>\n<div class=\"col-md-12\">\n  <form class=\"form-horizontal\" name=\"newNotifierForm\" ng-submit=\"nc.saveNotifier()\">\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"notifierId\">\n        Notifier Id\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"notifierId\" ng-model=\"notifier.notifierId\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"notifierType\">\n        Notifier Type\n      </label>\n      <div class=\"col-md-6\">\n        <select ng-model=\"notifier.notifierType\" id=\"notifierType\">\n          <option ng-repeat=\"notifierType in notifierTypes\" ng-selected=\"notifierType == \'email\'\"> {{ notifierType }}</option>\n        </select>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <label class=\"col-md-2 control-label\" for=\"notifierDescription\">\n        Description\n      </label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" id=\"notifierDescription\" ng-model=\"notifier.description\" class=\"form-control\" ng-minlength=\"1\" required>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"col-md-offset-2 col-md-6\">\n        <button type=\"submit\" class=\"btn btn-primary\">Save</button>\n        <button type=\"button\" ng-click=\"nc.allNotifiers()\" class=\"btn btn-default\">Cancel</button>\n      </div>\n    </div>\n    <div class=\"form-group\">\n      <div class=\"col-md-offset-2 col-md-6\">\n        <alert ng-repeat=\"alertMsg in msgs\" type=\"{{alertMsg.type}}\" close=\"nc.closeAlertMsg($index)\">{{alertMsg.msg}}</alert>\n      </div>\n    </div>\n  </form>\n</div>");}]); hawtioPluginLoader.addModule("hawkular-alerts-templates");
