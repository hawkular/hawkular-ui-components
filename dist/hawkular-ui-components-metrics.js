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


var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics.pluginName = "hawkular-metrics";
    HawkularMetrics.log = Logger.get(HawkularMetrics.pluginName);
    HawkularMetrics.templatePath = "plugins/metrics/html";
    HawkularMetrics.globalTenantId = "test";
    HawkularMetrics.globalResourceId = "";
    HawkularMetrics.globalResourceUrl = "";
    HawkularMetrics.globalResourceList = [];
    HawkularMetrics.globalChartTimeRange;
    var ChartTimeRange = (function () {
        function ChartTimeRange(initialHoursDifference) {
            this.initialHoursDifference = initialHoursDifference;
            this.init();
        }
        ChartTimeRange.prototype.init = function () {
            this.endTimestamp = moment().valueOf();
            this.startTimestamp = moment().subtract('hour', this.initialHoursDifference).valueOf();
        };
        ChartTimeRange.prototype.getStartDate = function () {
            return new Date(this.startTimestamp);
        };
        ChartTimeRange.prototype.getEndDate = function () {
            return new Date(this.endTimestamp);
        };
        ChartTimeRange.prototype.getFormattedTimeRange = function () {
            return moment(this.startTimestamp).format('H:mm') + ' - ' + moment(this.endTimestamp).format('H:mm') + ' (' + moment(this.endTimestamp).from(moment(this.startTimestamp), true) + ')';
        };
        return ChartTimeRange;
    })();
    HawkularMetrics.ChartTimeRange = ChartTimeRange;
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics._module = angular.module(HawkularMetrics.pluginName, ['ngResource', 'ui.select', 'hawkularCharts', 'hawkular.services']);
    var metricsTab;
    HawkularMetrics._module.config(['$httpProvider', '$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($httpProvider, $locationProvider, $routeProvider, navBuilder) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        metricsTab = navBuilder.create().id(HawkularMetrics.pluginName).title(function () { return "Metrics"; }).href(function () { return "/metrics"; }).subPath("Add Url", "addUrl", navBuilder.join(HawkularMetrics.templatePath, 'add-url.html')).subPath("Overview", "overview", navBuilder.join(HawkularMetrics.templatePath, 'overview.html')).subPath("Metrics Response", "metricsResponse", navBuilder.join(HawkularMetrics.templatePath, 'metrics-response.html')).build();
        navBuilder.configureRouting($routeProvider, metricsTab);
        $locationProvider.html5Mode(true);
    }]);
    HawkularMetrics._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(metricsTab);
        HawkularMetrics.log.debug("loaded Metrics Plugin");
    }]);
    HawkularMetrics._module.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
    hawtioPluginLoader.addModule(HawkularMetrics.pluginName);
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    var AddUrlController = (function () {
        function AddUrlController($location, $scope, $rootScope, $log, HawkularInventory, resourceUrl) {
            this.$location = $location;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$log = $log;
            this.HawkularInventory = HawkularInventory;
            this.resourceUrl = resourceUrl;
            this.httpUriPart = 'http://';
            $scope.vm = this;
            this.resourceUrl = this.httpUriPart;
        }
        AddUrlController.prototype.addUrl = function (url) {
            var _this = this;
            var resource = {
                type: 'URL',
                id: '',
                parameters: {
                    url: url
                }
            };
            this.$log.info("Adding new Resource Url to Hawkular-inventory: " + url);
            HawkularMetrics.globalChartTimeRange = new HawkularMetrics.ChartTimeRange(1);
            this.HawkularInventory.Resource.save({ tenantId: HawkularMetrics.globalTenantId }, resource).$promise.then(function (newResource) {
                HawkularMetrics.globalResourceId = newResource.id;
                HawkularMetrics.globalResourceUrl = resource.parameters.url;
                console.dir(newResource);
                _this.$log.info("New Resource ID: " + HawkularMetrics.globalResourceId + " created for url: " + HawkularMetrics.globalResourceUrl);
                var metrics = [{
                    name: HawkularMetrics.globalResourceId + '.status.duration',
                    unit: 'MILLI_SECOND',
                    description: 'Response Time in ms.'
                }, {
                    name: HawkularMetrics.globalResourceId + '.status.code',
                    unit: 'NONE',
                    description: 'Status Code'
                }];
                _this.HawkularInventory.Metric.save({
                    tenantId: HawkularMetrics.globalTenantId,
                    resourceId: newResource.id
                }, metrics).$promise.then(function (newMetrics) {
                    toastr.info("Your data is being collected. Please be patient (should be about another minute).");
                    _this.$location.url("/metrics/metricsResponse");
                });
            });
        };
        AddUrlController.$inject = ['$location', '$scope', '$rootScope', '$log', 'HawkularInventory'];
        return AddUrlController;
    })();
    HawkularMetrics.AddUrlController = AddUrlController;
    HawkularMetrics._module.controller('HawkularMetrics.AddUrlController', AddUrlController);
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    var sharedMetricId;
    var MetricsViewController = (function () {
        function MetricsViewController($scope, $rootScope, $interval, $log, HawkularMetric, HawkularInventory, startTimeStamp, endTimeStamp, dateRange) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$interval = $interval;
            this.$log = $log;
            this.HawkularMetric = HawkularMetric;
            this.HawkularInventory = HawkularInventory;
            this.startTimeStamp = startTimeStamp;
            this.endTimeStamp = endTimeStamp;
            this.dateRange = dateRange;
            this.bucketedDataPoints = [];
            this.contextDataPoints = [];
            this.isResponseTab = true;
            this.resourceList = [];
            $scope.vm = this;
            this.startTimeStamp = moment().subtract(1, 'hours').toDate();
            this.endTimeStamp = new Date();
            this.dateRange = moment(this.startTimeStamp).format('H:mm') + ' - ' + moment(this.endTimeStamp).format('H:mm') + ' (' + moment(this.endTimeStamp).from(moment(this.startTimeStamp), true) + ')';
            $scope.$on('RefreshChart', function (event) {
                $scope.vm.refreshChartDataNow(_this.getMetricId());
            });
            $scope.$watch('vm.selectedResource', function (resource) {
                if (angular.isUndefined(resource)) {
                    HawkularMetrics.globalResourceList = _this.HawkularInventory.Resource.query({ tenantId: HawkularMetrics.globalTenantId }).$promise.then(function (resources) {
                        _this.resourceList = resources;
                        _this.selectedResource = resources[resources.length - 1];
                        $scope.vm.refreshChartDataNow(_this.getMetricId());
                    });
                }
                else {
                    HawkularMetrics.globalResourceId = resource.id;
                    $scope.vm.refreshChartDataNow(_this.getMetricId());
                }
            });
            $scope.vm.onCreate();
        }
        MetricsViewController.prototype.onCreate = function () {
            this.autoRefresh(60);
            this.setupResourceList();
            this.resourceList = HawkularMetrics.globalResourceList;
            this.selectedResource = this.resourceList[this.resourceList.length - 1];
            this.refreshChartDataNow(this.getMetricId());
        };
        MetricsViewController.prototype.setupResourceList = function () {
            HawkularMetrics.globalResourceList = this.HawkularInventory.Resource.query({ tenantId: HawkularMetrics.globalTenantId });
            this.resourceList = HawkularMetrics.globalResourceList;
        };
        MetricsViewController.prototype.cancelAutoRefresh = function () {
            this.$interval.cancel(this.autoRefreshPromise);
            toastr.info('Canceling Auto Refresh');
        };
        MetricsViewController.prototype.autoRefresh = function (intervalInSeconds) {
            var _this = this;
            this.refreshHistoricalChartDataForTimestamp(this.getMetricId());
            this.autoRefreshPromise = this.$interval(function () {
                _this.endTimeStamp = new Date();
                _this.refreshHistoricalChartDataForTimestamp(_this.getMetricId());
            }, intervalInSeconds * 1000);
            this.$scope.$on('$destroy', function () {
                _this.$interval.cancel(_this.autoRefreshPromise);
            });
        };
        MetricsViewController.prototype.noDataFoundForId = function (id) {
            this.$log.warn('No Data found for id: ' + id);
        };
        MetricsViewController.calculatePreviousTimeRange = function (startDate, endDate) {
            var previousTimeRange = [];
            var intervalInMillis = endDate.getTime() - startDate.getTime();
            previousTimeRange.push(new Date(startDate.getTime() - intervalInMillis));
            previousTimeRange.push(startDate);
            return previousTimeRange;
        };
        MetricsViewController.prototype.showPreviousTimeRange = function () {
            var previousTimeRange = MetricsViewController.calculatePreviousTimeRange(this.startTimeStamp, this.endTimeStamp);
            this.startTimeStamp = previousTimeRange[0];
            this.endTimeStamp = previousTimeRange[1];
            this.refreshHistoricalChartData(this.getMetricId(), this.startTimeStamp, this.endTimeStamp);
        };
        MetricsViewController.calculateNextTimeRange = function (startDate, endDate) {
            var nextTimeRange = [];
            var intervalInMillis = endDate.getTime() - startDate.getTime();
            nextTimeRange.push(endDate);
            nextTimeRange.push(new Date(endDate.getTime() + intervalInMillis));
            return nextTimeRange;
        };
        MetricsViewController.prototype.showNextTimeRange = function () {
            var nextTimeRange = MetricsViewController.calculateNextTimeRange(this.startTimeStamp, this.endTimeStamp);
            this.startTimeStamp = nextTimeRange[0];
            this.endTimeStamp = nextTimeRange[1];
            this.refreshHistoricalChartData(this.getMetricId(), this.startTimeStamp, this.endTimeStamp);
        };
        MetricsViewController.prototype.hasNext = function () {
            var nextTimeRange = MetricsViewController.calculateNextTimeRange(this.startTimeStamp, this.endTimeStamp);
            return nextTimeRange[1].getTime() < new Date().getTime();
        };
        MetricsViewController.prototype.refreshChartDataNow = function (metricId, startTime) {
            var adjStartTimeStamp = moment().subtract('hours', 1).toDate();
            this.endTimeStamp = new Date();
            this.refreshHistoricalChartData(metricId, angular.isUndefined(startTime) ? adjStartTimeStamp : startTime, this.endTimeStamp);
        };
        MetricsViewController.prototype.refreshHistoricalChartData = function (metricId, startDate, endDate) {
            this.refreshHistoricalChartDataForTimestamp(metricId, startDate.getTime(), endDate.getTime());
        };
        MetricsViewController.prototype.getMetricId = function () {
            var metricId = this.isResponseTab ? this.getResourceDurationMetricId() : this.getResourceCodeMetricId();
            sharedMetricId = metricId;
            return metricId;
        };
        MetricsViewController.prototype.getResourceDurationMetricId = function () {
            return HawkularMetrics.globalResourceId + '.status.duration';
        };
        MetricsViewController.prototype.getResourceCodeMetricId = function () {
            return HawkularMetrics.globalResourceId + '.status.code';
        };
        MetricsViewController.prototype.refreshHistoricalChartDataForTimestamp = function (metricId, startTime, endTime) {
            var _this = this;
            if (angular.isUndefined(endTime)) {
                endTime = this.endTimeStamp.getTime();
            }
            if (angular.isUndefined(startTime)) {
                startTime = this.startTimeStamp.getTime();
            }
            this.HawkularMetric.NumericMetricData.queryMetrics({
                tenantId: HawkularMetrics.globalTenantId,
                numericId: metricId,
                start: startTime,
                end: endTime,
                buckets: 60
            }).$promise.then(function (response) {
                _this.bucketedDataPoints = _this.formatBucketedChartOutput(response);
                console.dir(_this.bucketedDataPoints);
                if (_this.bucketedDataPoints.length !== 0) {
                    _this.chartData = {
                        id: metricId,
                        startTimeStamp: _this.startTimeStamp,
                        endTimeStamp: _this.endTimeStamp,
                        dataPoints: _this.bucketedDataPoints,
                        contextDataPoints: _this.contextDataPoints,
                        annotationDataPoints: []
                    };
                }
                else {
                    _this.noDataFoundForId(_this.getMetricId());
                }
            }, function (error) {
                toastr.error('Error Loading Chart Data: ' + error);
            });
        };
        MetricsViewController.prototype.formatBucketedChartOutput = function (response) {
            return _.map(response.data, function (point) {
                return {
                    timestamp: point.timestamp,
                    date: new Date(point.timestamp),
                    value: !angular.isNumber(point.value) ? 0 : point.value,
                    avg: (point.empty) ? 0 : point.avg,
                    min: !angular.isNumber(point.min) ? 0 : point.min,
                    max: !angular.isNumber(point.max) ? 0 : point.max,
                    empty: point.empty
                };
            });
        };
        MetricsViewController.$inject = ['$scope', '$rootScope', '$interval', '$log', 'HawkularMetric', 'HawkularInventory'];
        return MetricsViewController;
    })();
    HawkularMetrics.MetricsViewController = MetricsViewController;
    HawkularMetrics._module.controller('MetricsViewController', MetricsViewController);
    var QuickAlertController = (function () {
        function QuickAlertController($scope, HawkularAlert) {
            this.$scope = $scope;
            this.HawkularAlert = HawkularAlert;
            this.$scope.showQuickAlert = false;
            this.$scope.quickTrigger = {
                operator: 'LT',
                threshold: 0
            };
            this.allNotifiers();
            console.log('Notifiers: ' + this.$scope.notifiers);
        }
        QuickAlertController.prototype.toggleQuickAlert = function () {
            this.$scope.showQuickAlert = !this.$scope.showQuickAlert;
        };
        QuickAlertController.prototype.allNotifiers = function () {
            var _this = this;
            this.$scope.notifiers = [];
            this.HawkularAlert.Notifier.query(function (result) {
                _this.$scope.notifiers = result;
            }, function (error) {
                if (error.data.errorMsg) {
                    toastr.error(error.data.errorMsg);
                }
                else {
                    toastr.error('Error loading Alerts Notifiers: ' + error);
                }
            });
        };
        QuickAlertController.prototype.saveQuickAlert = function () {
            var _this = this;
            if (sharedMetricId !== '.status.duration' && sharedMetricId !== '.status.code') {
                var newTrigger = {};
                newTrigger.id = sharedMetricId + 'ResponseTime' + '-' + this.$scope.quickTrigger.operator + '-' + this.$scope.quickTrigger.threshold;
                newTrigger.name = newTrigger.id;
                newTrigger.description = 'Created on ' + new Date();
                newTrigger.match = 'ALL';
                newTrigger.enabled = true;
                newTrigger.notifiers = this.$scope.quickTrigger.notifiers;
                var newDampening = {
                    triggerId: newTrigger.id,
                    type: 'RELAXED_COUNT',
                    evalTrueSetting: 1,
                    evalTotalSetting: 1,
                    evalTimeSetting: 0
                };
                this.HawkularAlert.Trigger.save(newTrigger, function (trigger) {
                    newDampening.triggerId = trigger.id;
                    _this.HawkularAlert.Dampening.save(newDampening, function (dampening) {
                        var newThresholdCondition = {
                            triggerId: newDampening.triggerId,
                            dataId: sharedMetricId,
                            conditionSetSize: 1,
                            conditionSetIndex: 1,
                            operator: _this.$scope.quickTrigger.operator,
                            threshold: _this.$scope.quickTrigger.threshold
                        };
                        _this.HawkularAlert['ThresholdCondition'].save(newThresholdCondition, function () {
                            _this.HawkularAlert.Alert.reload(function (errorReload) {
                                if (errorReload.data.errorMsg) {
                                    toastr.error(errorReload.data.errorMsg);
                                }
                                else {
                                    toastr.error('Error reloading alerts' + errorReload);
                                }
                            });
                            _this.toggleQuickAlert();
                        }, function (errorCondition) {
                            if (errorCondition.data.errorMsg) {
                                toastr.error(errorCondition.data.errorMsg);
                            }
                            else {
                                toastr.error('Error loading Saving Trigger Condition' + errorCondition);
                            }
                        });
                    }, function (errorDampening) {
                        if (errorDampening.data.errorMsg) {
                            toastr.error(errorDampening.data.errorMsg);
                        }
                        else {
                            toastr.error('Error loading Saving Trigger Dampening ' + errorDampening);
                        }
                    });
                }, function (error) {
                    if (error.data.errorMsg) {
                        toastr.error(error.data.errorMsg);
                    }
                    else {
                        toastr.error('Error loading Saving Trigger ' + error);
                    }
                });
            }
            else {
                toastr.warning('No metric selected');
            }
        };
        QuickAlertController.$inject = ['$scope', 'HawkularAlert'];
        return QuickAlertController;
    })();
    HawkularMetrics.QuickAlertController = QuickAlertController;
    HawkularMetrics._module.controller('QuickAlertController', QuickAlertController);
})(HawkularMetrics || (HawkularMetrics = {}));

angular.module("hawkular-ui-components-metrics-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/metrics/html/add-url.html","<div class=\"row\" ng-controller=\"HawkularMetrics.AddUrlController\" style=\"margin-left: 10px;\">\n\n    <h2>Collect metrics from a website that you want to monitor.</h2>\n\n    <form class=\"form-horizontal\" name=\"addUrlForm\" role=\"form\" novalidate>\n        <div class=\"form-group input\">\n            <div class=\"col-lg-6 col-sm-8 col-xs-12 align-center\">\n                <div class=\"input-group\">\n                    <input type=\"url\" class=\"form-control input-lg\" name=\"resourceUrl\" ng-model=\"vm.resourceUrl\"\n                           ng-model-options=\"{ updateOn: \'default blur\'}\"\n                           ng-enter=\"vm.addUrl(vm.resourceUrl)\"\n                           placeholder=\"Enter a website URL (e.g., http://mysite.com/home)\" required >\n                      <span class=\"error-message\"\n                            ng-show=\"addUrlForm.resourceUrl.$dirty && addUrlForm.resourceUrl.$error.required\">The URL you entered is not valid. Please enter a valid URL.</span>\n\n              <span class=\"input-group-btn\">\n                <button class=\"btn btn-primary btn-lg\" type=\"button\" ng-disabled=\"!addUrlForm.$valid\"\n                        ng-click=\"vm.addUrl(vm.resourceUrl)\">Get Metrics\n                </button>\n              </span>\n                </div>\n            </div>\n        </div>\n    </form>\n</div>\n");
$templateCache.put("plugins/metrics/html/metrics-response.html","<div ng-controller=\"MetricsViewController as vm\">\n\n    <div class=\"col-sm-9 col-md-10 content\">\n\n        <div class=\"well\">\n            <span class=\"col-md-3 col-sm-4\" style=\"margin:-10px 0 0 -20px;\">\n                <select class=\"form-control input-sm\" ng-model=\"vm.selectedResource\"\n                        ng-options=\"rs.parameters.url for rs in vm.resourceList\" style=\"width:100%;\"></select>\n            </span>\n            <span class=\"col-md-3 col-sm-2 pull-right\" style=\"margin:-10px;\">\n                <span class=\"input-group input-group-sm\" style=\"width:100%;\">\n                    <input type=\"text\" class=\"form-control input-sm\" value=\"{{vm.dateRange}}\" readonly>\n                </span>\n            </span>\n        </div>\n        <h1>Response Time</h1>\n\n        <p class=\"update-info pull-right\"><i class=\"fa fa-refresh\"></i>\n            <a ng-click=\"vm.refreshChartDataNow(vm.getMetricId())\">Last update 1 minutes ago</a>\n        </p>\n        <ul class=\"nav nav-tabs nav-tabs-pf\">\n            <li class=\"active\"><a href=\"#\">Response Time</a></li>\n            <li><a href=\"#\">Responsiveness</a></li>\n        </ul>\n        <div style=\"width:800px;\" ng-switch=\"vm.chartData.dataPoints.length > 1\">\n            <p class=\"label label-info\" ng-switch-when=\"false\" style=\"margin-bottom: 25px;\">We are collecting your\n                initial data. Please be patient(could be up to a minute)...</p>\n\n            <div id=\"stackedBarChart\" style=\"height:270px\" ng-switch-when=\"true\">\n                <!-- HINT: colors for the chart can be changed in the hawkular-charts.css -->\n                <hawkular-chart\n                        data=\"{{vm.chartData.dataPoints}}\"\n                        chart-type=\"line\"\n                        show-avg-line=\"false\"\n                        hide-high-low-values=\"true\"\n                        y-axis-units=\"Response time (ms)\"\n                        chart-title=\"Monitored Resource: {{vm.selectedResource.parameters.url}}\"\n                        chart-height=\"250\">\n                </hawkular-chart>\n            </div>\n            <!--\n            <div style=\"margin-top: 30px;\">\n                <button class=\"btn btn-sm\" ng-click=\"vm.showPreviousTimeRange()\" style=\"margin-left:90px;\"\n                        ng-show=\"vm.chartData.dataPoints.length > 2\">&lt;&lt; Prev.\n                </button>\n                <button class=\"btn btn-sm\" style=\"float:right;margin-right: 50px;\" ng-click=\"vm.showNextTimeRange()\"\n                        ng-show=\"vm.chartData.dataPoints.length > 2\" ng-disabled=\"!vm.hasNext();\">Next &gt;&gt;</button>\n            </div>\n            <br/>\n            -->\n        </div>\n\n    </div>\n\n    <div ng-controller=\"QuickAlertController as qac\" ng-show=\"vm.chartData.dataPoints.length > 1\">\n        <div ng-if=\"!showQuickAlert\" class=\"col-sm-9 col-md-10 content\">\n            <button class=\"btn btn-primary\" ng-click=\"qac.toggleQuickAlert()\">Add an Alert</button>\n        </div>\n        <div ng-if=\"showQuickAlert\" class=\"col-sm-9 col-md-10 content\">\n            <h1>Add an Alert</h1>\n\n            <form class=\"form-horizontal\" name=\"addQuickAlertForm\" role=\"form\">\n                <div class=\"form-group\">\n                    <label class=\"col-md-4 control-label\">\n                        Fire when metric is\n                    </label>\n\n                    <div class=\"col-md-6\">\n                        <label class=\"radio-inline\">\n                            <input type=\"radio\" ng-model=\"quickTrigger.operator\" class=\"radio\" value=\"LT\"> <\n                        </label>\n                        <label class=\"radio-inline\">\n                            <input type=\"radio\" ng-model=\"quickTrigger.operator\" class=\"radio\" value=\"GT\"> >\n                        </label>\n                        <label class=\"radio-inline\">\n                            <input type=\"radio\" ng-model=\"quickTrigger.operator\" class=\"radio\" value=\"LTE\"> <=\n                        </label>\n                        <label class=\"radio-inline\">\n                            <input type=\"radio\" ng-model=\"quickTrigger.operator\" class=\"radio\" value=\"GTE\"> >=\n                        </label>\n                    </div>\n                </div>\n                <div class=\"form-group\">\n                    <label class=\"col-md-4 control-label\" for=\"threshold\">\n                        Of threshold\n                    </label>\n\n                    <div class=\"col-md-6\">\n                        <input type=\"number\" id=\"threshold\" ng-model=\"quickTrigger.threshold\" class=\"form-control\"\n                               ng-minlength=\"1\" required>\n                    </div>\n                </div>\n                <div class=\"form-group\">\n                    <label class=\"col-md-4 control-label\" for=\"notifiers\">\n                        Notify to:\n                    </label>\n\n                    <div class=\"col-md-6\">\n                        <ui-select id=\"notifiers\" multiple ng-model=\"quickTrigger.notifiers\" theme=\"bootstrap\"\n                                   ng-disabled=\"disabled\" close-on-select=\"false\">\n                            <ui-select-match placeholder=\"Select notifier...\">{{$item}}</ui-select-match>\n                            <ui-select-choices repeat=\"notifier in notifiers | filter:$select.search\">\n                                {{ notifier }}\n                            </ui-select-choices>\n                        </ui-select>\n                    </div>\n                </div>\n                <div class=\"form-group\">\n                    <div class=\"col-md-offset-4 col-md-6\">\n                        <button class=\"btn btn-primary\" ng-click=\"qac.saveQuickAlert()\">Create Alert</button>\n                        <button type=\"button\" class=\"btn btn-default\" ng-click=\"qac.toggleQuickAlert()\">Cancel</button>\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n\n</div>\n\n\n");
$templateCache.put("plugins/metrics/html/overview.html","<div class=\"row\" ng-controller=\"HawkularMetrics.OverviewController as vm\">\n    <div class=\"col-md-12\">\n        <h1>TBD: Metrics Overview</h1>\n    </div>\n</div>\n");}]); hawtioPluginLoader.addModule("hawkular-ui-components-metrics-templates");