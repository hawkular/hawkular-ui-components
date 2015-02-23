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
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics._module = angular.module(HawkularMetrics.pluginName, ['ngResource', 'hawkularCharts', 'hawkular.services']);
    var metricsTab;
    HawkularMetrics._module.config(['$httpProvider', '$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($httpProvider, $locationProvider, $routeProvider, navBuilder) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        metricsTab = navBuilder.create().id(HawkularMetrics.pluginName).title(function () { return "Metrics"; }).href(function () { return "/metrics"; }).subPath("Add Url", "addUrl", navBuilder.join(HawkularMetrics.templatePath, 'add-url.html')).subPath("Metrics Selection", "metricsSelection", navBuilder.join(HawkularMetrics.templatePath, 'metrics-selection.html')).subPath("Overview", "overview", navBuilder.join(HawkularMetrics.templatePath, 'overview.html')).subPath("Metrics View", "metricsView", navBuilder.join(HawkularMetrics.templatePath, 'metrics-view.html')).build();
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
        function AddUrlController($location, $scope, $log, HawkularInventory, resourceUrl) {
            this.$location = $location;
            this.$scope = $scope;
            this.$log = $log;
            this.HawkularInventory = HawkularInventory;
            this.resourceUrl = resourceUrl;
            this.tenantId = 'test';
            this.httpUriPart = 'http://';
            $scope.vm = this;
            this.resourceUrl = this.httpUriPart;
        }
        AddUrlController.prototype.addUrl = function (resourceId) {
            var cleanedResourceId = resourceId.substr(this.httpUriPart.length);
            this.$log.debug("Adding Url to backend: " + cleanedResourceId);
            this.HawkularInventory.Resource.save({ tenantId: this.tenantId }, cleanedResourceId);
            this.HawkularInventory.Metric.save({ tenantId: this.tenantId, resourceId: cleanedResourceId }, 'status.time');
            this.HawkularInventory.Metric.save({ tenantId: this.tenantId, resourceId: cleanedResourceId }, 'status.code');
            this.$log.debug("Current url: " + this.$location.url());
            this.$location.url("/metrics/metricsView");
        };
        AddUrlController.$inject = ['$location', '$scope', '$log', 'HawkularInventory'];
        return AddUrlController;
    })();
    HawkularMetrics.AddUrlController = AddUrlController;
    HawkularMetrics._module.controller('HawkularMetrics.AddUrlController', AddUrlController);
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics.MetricsSelectionController = HawkularMetrics._module.controller("HawkularMetrics.MetricsSelectionController", ['$scope', function ($scope) {
        $scope.overview = "Over View";
    }]);
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    var MetricsViewController = (function () {
        function MetricsViewController($scope, $rootScope, $interval, $log, HawkularMetric, startTimeStamp, endTimeStamp, dateRange) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$interval = $interval;
            this.$log = $log;
            this.HawkularMetric = HawkularMetric;
            this.startTimeStamp = startTimeStamp;
            this.endTimeStamp = endTimeStamp;
            this.dateRange = dateRange;
            this.searchId = '';
            this.showAvgLine = true;
            this.hideHighLowValues = false;
            this.showPreviousRangeDataOverlay = false;
            this.showContextZoom = true;
            this.tenantId = 'test';
            this.bucketedDataPoints = [];
            this.contextDataPoints = [];
            $scope.vm = this;
            this.startTimeStamp = moment().subtract(72, 'hours').toDate();
            this.endTimeStamp = new Date();
            this.dateRange = moment().subtract(72, 'hours').from(moment());
            $scope.$watch('vm.searchId', function (newValue, oldValue) {
                _this.refreshChartDataNow();
            });
            $scope.$on('GraphTimeRangeChangedEvent', function (event, timeRange) {
                $scope.vm.startTimeStamp = timeRange[0];
                $scope.vm.endTimeStamp = timeRange[1];
                $scope.vm.dateRange = moment(timeRange[0]).from(moment(timeRange[1]));
                $scope.vm.refreshHistoricalChartDataForTimestamp(startTimeStamp.getTime(), endTimeStamp.getTime());
            });
        }
        MetricsViewController.prototype.noDataFoundForId = function (id) {
            this.$log.warn('No Data found for id: ' + id);
            toastr.warning('No Data found for id: ' + id);
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
            this.refreshHistoricalChartData(this.startTimeStamp, this.endTimeStamp);
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
            this.refreshHistoricalChartData(this.startTimeStamp, this.endTimeStamp);
        };
        MetricsViewController.prototype.hasNext = function () {
            var nextTimeRange = MetricsViewController.calculateNextTimeRange(this.startTimeStamp, this.endTimeStamp);
            return nextTimeRange[1].getTime() < new Date().getTime();
        };
        MetricsViewController.prototype.refreshChartDataNow = function (startTime) {
            var adjStartTimeStamp = moment().subtract('hours', 72).toDate();
            this.$rootScope.$broadcast('MultiChartOverlayDataChanged');
            this.endTimeStamp = new Date();
            this.refreshHistoricalChartData(angular.isUndefined(startTime) ? adjStartTimeStamp : startTime, this.endTimeStamp);
        };
        MetricsViewController.prototype.refreshHistoricalChartData = function (startDate, endDate) {
            this.refreshHistoricalChartDataForTimestamp(startDate.getTime(), endDate.getTime());
        };
        MetricsViewController.prototype.refreshHistoricalChartDataForTimestamp = function (startTime, endTime) {
            var _this = this;
            if (angular.isUndefined(endTime)) {
                endTime = this.endTimeStamp.getTime();
            }
            if (angular.isUndefined(startTime)) {
                startTime = this.startTimeStamp.getTime();
            }
            if (this.searchId !== '') {
                this.HawkularMetric.NumericMetricData.queryMetrics({ tenantId: this.tenantId, numericId: this.searchId, start: startTime, end: endTime, buckets: 60 }).$promise.then(function (response) {
                    console.dir(response);
                    _this.bucketedDataPoints = _this.formatBucketedChartOutput(response);
                    console.dir(_this.bucketedDataPoints);
                    if (_this.bucketedDataPoints.length !== 0) {
                        _this.chartData = {
                            id: _this.searchId,
                            startTimeStamp: _this.startTimeStamp,
                            endTimeStamp: _this.endTimeStamp,
                            dataPoints: _this.bucketedDataPoints,
                            contextDataPoints: _this.contextDataPoints,
                            annotationDataPoints: []
                        };
                    }
                    else {
                        _this.noDataFoundForId(_this.searchId);
                    }
                }, function (error) {
                    toastr.error('Error Loading Chart Data: ' + error);
                });
            }
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
        MetricsViewController.prototype.togglePreviousRangeDataOverlay = function () {
            if (this.showPreviousRangeDataOverlay) {
                this.chartData.prevDataPoints = [];
            }
            else {
                this.overlayPreviousRangeData();
            }
        };
        MetricsViewController.prototype.overlayPreviousRangeData = function () {
            var _this = this;
            var previousTimeRange = MetricsViewController.calculatePreviousTimeRange(this.startTimeStamp, this.endTimeStamp);
            if (this.searchId !== '') {
                this.HawkularMetric.NumericMetricData.queryMetrics({ tenantId: this.tenantId, numericId: this.searchId, start: previousTimeRange[0], end: previousTimeRange[1], buckets: 60 }).$promise.then(function (response) {
                    var prevTimeRangeBucketedDataPoints = _this.formatPreviousBucketedOutput(response);
                    if (angular.isDefined(prevTimeRangeBucketedDataPoints) && prevTimeRangeBucketedDataPoints.length !== 0) {
                        _this.chartData = {
                            id: _this.searchId,
                            prevStartTimeStamp: previousTimeRange[0],
                            prevEndTimeStamp: previousTimeRange[1],
                            prevDataPoints: prevTimeRangeBucketedDataPoints,
                            dataPoints: _this.bucketedDataPoints,
                            contextDataPoints: _this.contextDataPoints,
                            annotationDataPoints: []
                        };
                    }
                    else {
                        _this.noDataFoundForId(_this.searchId);
                    }
                }, function (error) {
                    toastr.error('Error loading Prev Range graph data', 'Status: ' + error);
                });
            }
        };
        MetricsViewController.prototype.formatPreviousBucketedOutput = function (response) {
            var _this = this;
            var mappedNew = _.map(response, function (point, i) {
                return {
                    timestamp: _this.bucketedDataPoints[i].timestamp,
                    originalTimestamp: point.timestamp,
                    value: !angular.isNumber(point.value) ? 0 : point.value,
                    avg: (point.empty) ? 0 : point.avg,
                    min: !angular.isNumber(point.min) ? 0 : point.min,
                    max: !angular.isNumber(point.max) ? 0 : point.max,
                    empty: point.empty
                };
            });
            return mappedNew;
        };
        MetricsViewController.prototype.toggleContextZoom = function () {
            if (this.showContextZoom) {
                this.chartData.contextDataPoints = [];
            }
            else {
                this.refreshContextChart();
            }
        };
        MetricsViewController.prototype.refreshContextChart = function () {
            var _this = this;
            var endTime = moment().valueOf(), startTime = moment().subtract('months', 24).valueOf();
            this.$log.debug('refreshChartContext');
            if (this.searchId !== '') {
                if (startTime >= endTime) {
                    this.$log.warn('Start Date was >= End Date');
                    return;
                }
                this.HawkularMetric.NumericMetricData.queryMetrics({ tenantId: this.tenantId, numericId: this.searchId, start: startTime, end: endTime, buckets: 60 }).$promise.then(function (response) {
                    _this.chartData.contextDataPoints = _this.formatContextOutput(response);
                    if (angular.isUndefined(_this.chartData.contextDataPoints) || _this.chartData.contextDataPoints.length === 0) {
                        _this.noDataFoundForId(_this.searchId);
                    }
                }, function (error) {
                    toastr.error('Error loading Context graph data', 'Status: ' + error);
                });
            }
        };
        MetricsViewController.prototype.formatContextOutput = function (response) {
            return _.map(response, function (point) {
                return {
                    timestamp: point.timestamp,
                    value: !angular.isNumber(point.value) ? 0 : point.value,
                    avg: (point.empty) ? 0 : point.avg,
                    empty: point.empty
                };
            });
        };
        MetricsViewController.$inject = ['$scope', '$rootScope', '$interval', '$log', 'HawkularMetric'];
        return MetricsViewController;
    })();
    HawkularMetrics.MetricsViewController = MetricsViewController;
    HawkularMetrics._module.controller('MetricsViewController', MetricsViewController);
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics.OverviewController = HawkularMetrics._module.controller("HawkularMetrics.OverviewController", ['$scope', function ($scope) {
        $scope.overview = "Over View";
    }]);
})(HawkularMetrics || (HawkularMetrics = {}));

angular.module("hawkular-ui-components-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/index.html","<!DOCTYPE html>\n<html>\n\n<head>\n    <title>hawkular-metrics</title>\n    <base href=\'/\'></base>\n    <meta charset=\"UTF8\">\n\n\n    <link rel=\"stylesheet\" href=\"libs/bootstrap/dist/css/bootstrap.css\"/>\n    <link rel=\"stylesheet\" href=\"libs/patternfly/dist/css/patternfly.css\"/>\n    <link rel=\"stylesheet\" href=\"libs/hawkular-charts/css/hawkular-chart.css\"/>\n\n    <!-- bower:css -->\n    <link rel=\"stylesheet\" href=\"libs/toastr/toastr.css\" />\n    <!-- endbower -->\n\n    <!-- ES6/ES6 shim -->\n    <!--[if IE 8]>\n    <script src=\"libs/es5-dom-shim/__COMIPLE/a.ie8.js\"></script>\n    <![endif]-->\n    <script src=\"libs/es5-dom-shim/__COMPILE/a.js\"></script>\n\n    <!-- bower:js -->\n    <script src=\"libs/jquery/dist/jquery.js\"></script>\n    <script src=\"libs/angular/angular.js\"></script>\n    <script src=\"libs/angular-sanitize/angular-sanitize.js\"></script>\n    <script src=\"libs/js-logger/src/logger.js\"></script>\n    <script src=\"libs/hawtio-core/hawtio-core.js\"></script>\n    <script src=\"libs/lodash/dist/lodash.compat.js\"></script>\n    <script src=\"libs/angular-route/angular-route.js\"></script>\n    <script src=\"libs/hawtio-core-navigation/dist/hawtio-core-navigation.js\"></script>\n    <script src=\"libs/uri.js/src/URI.js\"></script>\n    <script src=\"libs/uri.js/src/IPv6.js\"></script>\n    <script src=\"libs/uri.js/src/SecondLevelDomains.js\"></script>\n    <script src=\"libs/uri.js/src/punycode.js\"></script>\n    <script src=\"libs/uri.js/src/URITemplate.js\"></script>\n    <script src=\"libs/uri.js/src/jquery.URI.js\"></script>\n    <script src=\"libs/uri.js/src/URI.min.js\"></script>\n    <script src=\"libs/uri.js/src/jquery.URI.min.js\"></script>\n    <script src=\"libs/uri.js/src/URI.fragmentQuery.js\"></script>\n    <script src=\"libs/uri.js/src/URI.fragmentURI.js\"></script>\n    <script src=\"libs/hawtio-utilities/dist/sugar.js\"></script>\n    <script src=\"libs/hawtio-utilities/dist/angular-file-upload.js\"></script>\n    <script src=\"libs/hawtio-utilities/dist/hawtio-utilities.js\"></script>\n    <script src=\"libs/moment/moment.js\"></script>\n    <script src=\"libs/angular-bootstrap/ui-bootstrap-tpls.js\"></script>\n    <script src=\"libs/toastr/toastr.js\"></script>\n    <script src=\"libs/d3/d3.js\"></script>\n    <script src=\"libs/d3-tip/index.js\"></script>\n    <script src=\"libs/numeral/numeral.js\"></script>\n    <script src=\"libs/hawkular-charts/hawkular-charts.js\"></script>\n    <script src=\"libs/angular-resource/angular-resource.js\"></script>\n    <script src=\"libs/hawkular-ui-services/dist/hawkular-ui-service.js\"></script>\n    <!-- endbower -->\n\n    <script src=\"libs/bootstrap/dist/js/bootstrap.js\"></script>\n    <script src=\"libs/patternfly/dist/js/patternfly.js\"></script>\n    <script type=\"node_modules/angular-hint/hint.js\"></script>\n\n</head>\n\n<body data-ng-strict-di>\n<nav class=\"navbar navbar-default navbar-pf\" role=\"navigation\">\n    <ul class=\"nav navbar-nav navbar-primary\" hawtio-main-nav></ul>\n    <ul class=\"nav navbar-nav\" hawtio-sub-tabs></ul>\n</nav>\n\n<div id=\"main\" class=\"container-fluid ng-cloak\" ng-controller=\"HawtioNav.ViewController\">\n    <div ng-include src=\"viewPartial\"></div>\n</div>\n\n<!-- add any scripts under dist/ here -->\n<script src=\"dist/hawkular-metrics.js\"></script>\n\n</body>\n</html>\n");}]); hawtioPluginLoader.addModule("hawkular-ui-components-templates");