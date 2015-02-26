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
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics._module = angular.module(HawkularMetrics.pluginName, ['ngResource', 'hawkularCharts', 'hawkular.services']);
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
            this.dateTimeRanges = [
                { 'range': '1h', 'rangeInSeconds': 60 * 60 },
                { 'range': '12h', 'rangeInSeconds': 12 * 60 * 60 },
                { 'range': 'Day', 'rangeInSeconds': 24 * 60 * 60 },
                { 'range': 'Week', 'rangeInSeconds': 7 * 24 * 60 * 60 },
                { 'range': 'Month', 'rangeInSeconds': 30 * 24 * 60 * 60 },
                { 'range': 'Year', 'rangeInSeconds': 12 * 30 * 24 * 60 * 60 }
            ];
            $scope.vm = this;
            this.startTimeStamp = moment().subtract(1, 'hours').toDate();
            this.endTimeStamp = new Date();
            this.dateRange = moment().subtract(1, 'hours').from(moment());
            $scope.$on('RefreshChart', function (event) {
                $scope.vm.refreshChartDataNow(_this.getMetricId());
            });
            $scope.vm.onCreate();
            this.currentUrl = HawkularMetrics.globalResourceUrl;
        }
        MetricsViewController.prototype.onCreate = function () {
            this.$log.debug("executing MetricsViewController.onCreate");
            this.autoRefresh(60);
            this.refreshChartDataNow(this.getMetricId());
            this.setupResourceList();
            console.debug("GlobalResourceList: ");
            console.dir(HawkularMetrics.globalResourceList);
        };
        MetricsViewController.prototype.setupResourceList = function () {
            HawkularMetrics.globalResourceList = this.HawkularInventory.Resource.query({ tenantId: HawkularMetrics.globalTenantId });
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
            var metricList = this.HawkularInventory.Resource.query({ tenantId: HawkularMetrics.globalTenantId });
            console.dir(metricList);
            var adjStartTimeStamp = moment().subtract('hours', 1).toDate();
            this.endTimeStamp = new Date();
            this.refreshHistoricalChartData(metricId, angular.isUndefined(startTime) ? adjStartTimeStamp : startTime, this.endTimeStamp);
        };
        MetricsViewController.prototype.refreshHistoricalChartData = function (metricId, startDate, endDate) {
            this.refreshHistoricalChartDataForTimestamp(metricId, startDate.getTime(), endDate.getTime());
        };
        MetricsViewController.prototype.getMetricId = function () {
            return this.isResponseTab ? this.getResourceDurationMetricId() : this.getResourceCodeMetricId();
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
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics.MetricsSelectionController = HawkularMetrics._module.controller("HawkularMetrics.MetricsSelectionController", ['$scope', function ($scope) {
        $scope.overview = "Over View";
    }]);
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics.OverviewController = HawkularMetrics._module.controller("HawkularMetrics.OverviewController", ['$scope', function ($scope) {
        $scope.overview = "Over View";
    }]);
})(HawkularMetrics || (HawkularMetrics = {}));

angular.module("hawkular-metrics-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/metrics/html/add-url.html","<div class=\"row\" ng-controller=\"HawkularMetrics.AddUrlController\" style=\"margin-left: 10px;\">\n\n    <h2>Collect metrics from a website that you want to monitor.</h2>\n\n    <form class=\"form-horizontal\" name=\"addUrlForm\" role=\"form\" novalidate>\n        <div class=\"form-group input\">\n            <div class=\"col-lg-6 col-sm-8 col-xs-12 align-center\">\n                <div class=\"input-group\">\n                    <input type=\"url\" class=\"form-control input-lg\" name=\"resourceUrl\" ng-model=\"vm.resourceUrl\"\n                           ng-model-options=\"{ updateOn: \'default blur\'}\"\n                           ng-enter=\"vm.addUrl(vm.resourceUrl)\"\n                           placeholder=\"Enter a website URL (e.g., http://mysite.com/home)\" required >\n                      <span class=\"error-message\"\n                            ng-show=\"addUrlForm.resourceUrl.$dirty && addUrlForm.resourceUrl.$error.required\">The URL you entered is not valid. Please enter a valid URL.</span>\n\n              <span class=\"input-group-btn\">\n                <button class=\"btn btn-primary btn-lg\" type=\"button\" ng-disabled=\"!addUrlForm.$valid\"\n                        ng-click=\"vm.addUrl(vm.resourceUrl)\">Get Metrics\n                </button>\n              </span>\n                </div>\n            </div>\n        </div>\n    </form>\n</div>\n");
$templateCache.put("plugins/metrics/html/metrics-response.html","<div ng-controller=\"MetricsViewController as vm\">\n    <!--\n    <div class=\"panel-top clearfix\">\n        <div class=\"col-md-3 col-sm-4\">\n            <div class=\"input-group input-group-lg\">\n                <input type=\"text\" class=\"form-control input-lg\" value=\"http://example-app.com\">\n            <span class=\"input-group-btn\">\n              <button class=\"btn btn-default btn-lg\" type=\"button\"><i class=\"fa fa-chevron-right\"></i></button>\n            </span>\n            </div>\n        </div>\n        <div class=\"col-md-3 col-sm-4 pull-right\">\n            <div class=\"input-group input-group-lg\">\n                <input type=\"text\" class=\"form-control input-lg\" value=\"3 Feb - 10 Feb, 2015\">\n            <span class=\"input-group-btn\">\n              <button class=\"btn btn-default btn-lg\" type=\"button\"><i class=\"fa fa-calendar\"></i></button>\n            </span>\n            </div>\n        </div>\n    </div>\n    -->\n\n\n    <div class=\"col-sm-9 col-md-10 content\">\n            <h1>Response Time</h1>\n\n            <p class=\"update-info pull-right\"><i class=\"fa fa-refresh\"></i>\n                <a ng-click=\"vm.refreshChartDataNow(vm.getMetricId())\">Last update 1 minutes ago</a>\n            </p>\n            <ul class=\"nav nav-tabs nav-tabs-pf\">\n                <li class=\"active\"><a href=\"#\">Response Time</a></li>\n                <li><a href=\"#\">Responsiveness</a></li>\n            </ul>\n        <div style=\"width:800px;\">\n            <div id=\"stackedBarChart\" style=\"height:270px\">\n                <!-- HINT: colors for the chart can be changed in the hawkular-charts.css -->\n                <hawkular-chart\n                        data=\"{{vm.chartData.dataPoints}}\"\n                        chart-type=\"line\"\n                        show-avg-line=\"false\"\n                        hide-high-low-values=\"true\"\n                        chart-title=\"Metrics for: {{vm.currentUrl}}\"\n                        chart-height=\"250\">\n                </hawkular-chart>\n            </div>\n            <!--\n            <div style=\"margin-top: 30px;\">\n                <button class=\"btn btn-sm\" ng-click=\"vm.showPreviousTimeRange()\" style=\"margin-left:90px;\"\n                        ng-show=\"vm.chartData.dataPoints.length > 2\">&lt;&lt; Prev.\n                </button>\n                <button class=\"btn btn-sm\" style=\"float:right;margin-right: 50px;\" ng-click=\"vm.showNextTimeRange()\"\n                        ng-show=\"vm.chartData.dataPoints.length > 2\" ng-disabled=\"!vm.hasNext();\">Next &gt;&gt;</button>\n            </div>\n            <br/>\n            -->\n            </div>\n\n    </div>\n\n\n</div>\n</div>\n");
$templateCache.put("plugins/metrics/html/metrics-selection.html","<div class=\"row\" ng-controller=\"HawkularMetrics.MetricsSelectionController\">\n    <div class=\"col-md-12\">\n        <h1>Metrics Selection: TBD</h1>\n       Screen: TBD\n    </div>\n</div>\n");
$templateCache.put("plugins/metrics/html/overview.html","<div class=\"row\" ng-controller=\"HawkularMetrics.OverviewController\">\n    <div class=\"col-md-12\">\n        <h1>Metrics Overview</h1>\n        <p class=\"update-info pull-right\"><i class=\"fa fa-refresh\"></i> Last update 3 minutes ago</p>\n        <ul class=\"list-unstyled metrics-boxes\">\n            <li class=\"availability\">\n                <a href=\"#availability\">\n                    <div class=\"metric-box-content\">\n                        <h2>Availability</h2>\n                        <div class=\"data one-line\">99.992<span>%</span></div>\n                    </div>\n                    <span class=\"nav-arrow\"></span>\n                </a>\n            </li>\n            <li>\n                <a href=\"#response-time\" id=\"link-response-time\">\n                    <div class=\"metric-box-content\">\n                        <h2>Response Time</h2>\n                        <div class=\"data one-line\">2.762 s</div>\n                    </div>\n                    <span class=\"nav-arrow\"></span>\n                </a>\n            </li>\n            <li>\n                <a href=\"#downtime\">\n                    <div class=\"metric-box-content\">\n                        <h2>Up/down time</h2>\n                        <div class=\"data two-lines\">\n                            <div class=\"upper-line\"><i class=\"fa fa-arrow-up\"></i> 30 days up</div>\n                            <div><i class=\"fa fa-arrow-down\"></i> 1 down</div>\n                        </div>\n                    </div>\n                    <span class=\"nav-arrow\"></span>\n                </a>\n            </li>\n        </ul>\n\n        <a href=\"#response-time\" class=\"next-page\">\n            <span class=\"hide\">Go to response time</span>\n            <i class=\"fa fa-chevron-down\"></i>\n        </a>\n    </div>\n</div>\n");}]); hawtioPluginLoader.addModule("hawkular-metrics-templates");