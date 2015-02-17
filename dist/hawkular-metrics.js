

var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics.pluginName = "hawkular-metrics";
    HawkularMetrics.log = Logger.get(HawkularMetrics.pluginName);
    HawkularMetrics.templatePath = "plugins/metrics/html";
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics._module = angular.module(HawkularMetrics.pluginName, ['hawkularCharts', 'hawkular.services']);
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
    hawtioPluginLoader.addModule(HawkularMetrics.pluginName);
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    var AddUrlController = (function () {
        function AddUrlController($location, $scope, $log, HawkularMetric, resourceUrl) {
            this.$location = $location;
            this.$scope = $scope;
            this.$log = $log;
            this.HawkularMetric = HawkularMetric;
            this.resourceUrl = resourceUrl;
            this.tenantId = 'test';
            $scope.vm = this;
            this.resourceUrl = '';
        }
        AddUrlController.prototype.addUrl = function (url) {
            var _this = this;
            this.$log.debug("Adding Url to backend: " + url);
            this.HawkularMetric.Metric.queryNum({ tenantId: 'test' }, function (data) {
                console.dir(data);
                _this.$log.debug("#Metrics: " + data.length);
            });
            this.registerFixedMetrics(this.tenantId);
            this.$log.debug("Current url: " + this.$location.url());
            this.$location.url("/metrics/metricsView");
        };
        AddUrlController.prototype.registerFixedMetrics = function (tenantId) {
            this.HawkularMetric.Metric.queryNum({ tenantId: 'test' });
            var result;
            var webResponseTimeMetric = {
                "name": "web.responseTime",
                "tags": {
                    "attribute1": "web",
                    "attribute2": "value2"
                }
            };
            var cpuUsageMetric = {
                "name": "cpu.usage",
                "tags": {
                    "attribute1": "cpu",
                    "attribute2": "value2"
                }
            };
            result = this.HawkularMetric.NumericMetric.save({ tenantId: tenantId }, webResponseTimeMetric);
            this.$log.info("Created Metric: " + result);
            result = this.HawkularMetric.NumericMetric.save({ tenantId: tenantId }, cpuUsageMetric);
            this.$log.info("Created Metric: " + result);
        };
        AddUrlController.$inject = ['$location', '$scope', '$log', 'HawkularMetric'];
        return AddUrlController;
    })();
    HawkularMetrics.AddUrlController = AddUrlController;
    HawkularMetrics._module.controller('HawkularMetrics.AddUrlController', AddUrlController);
})(HawkularMetrics || (HawkularMetrics = {}));

var HawkularMetrics;
(function (HawkularMetrics) {
    var MetricDataService = (function () {
        function MetricDataService($q, $rootScope, $http, $log) {
            this.$q = $q;
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.$log = $log;
        }
        MetricDataService.prototype.getBaseUrl = function () {
            return 'http://127.0.0.1:8080/rhq-metrics/test/metrics';
        };
        MetricDataService.prototype.getAllMetrics = function () {
            this.$log.info('-- Retrieving all metrics');
            var base = this.getBaseUrl() + '/?type=num', deferred = this.$q.defer();
            this.$http.get(base).success(function (data) {
                deferred.resolve(data);
            }).error(function (reason, status) {
                console.error('Error Retrieving all metrics :' + status + ", " + reason);
                toastr.warning('No Metrics retrieved.');
                deferred.reject(status + " - " + reason);
            });
            return deferred.promise;
        };
        MetricDataService.prototype.getMetricsForTimeRange = function (id, startDate, endDate, buckets) {
            var _this = this;
            this.$log.info('-- Retrieving metrics data for id: ' + id);
            this.$log.info('-- Date Range: ' + startDate + ' - ' + endDate);
            var numBuckets = buckets || 60, deferred = this.$q.defer(), searchParams = {
                params: {
                    start: startDate.getTime(),
                    end: endDate.getTime(),
                    buckets: numBuckets
                }
            };
            if (startDate >= endDate) {
                this.$log.warn("Start date was after end date");
                deferred.reject("Start date was after end date");
            }
            this.$http.get(this.getBaseUrl() + '/numeric/' + id + '/data', searchParams).success(function (data) {
                deferred.resolve(data);
            }).error(function (reason, status) {
                _this.$log.error('Error Loading Chart Data:' + status + ", " + reason);
                deferred.reject(status + " - " + reason);
            });
            return deferred.promise;
        };
        MetricDataService.$inject = ['$q', '$rootScope', '$http', '$log'];
        return MetricDataService;
    })();
    HawkularMetrics.MetricDataService = MetricDataService;
    HawkularMetrics._module.service('metricDataService', MetricDataService);
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
        function MetricsViewController($scope, $rootScope, $interval, $log, metricDataService, startTimeStamp, endTimeStamp, dateRange) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$interval = $interval;
            this.$log = $log;
            this.metricDataService = metricDataService;
            this.startTimeStamp = startTimeStamp;
            this.endTimeStamp = endTimeStamp;
            this.dateRange = dateRange;
            this.searchId = '';
            this.showAvgLine = true;
            this.hideHighLowValues = false;
            this.showPreviousRangeDataOverlay = false;
            this.showContextZoom = true;
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
                this.metricDataService.getMetricsForTimeRange(this.searchId, new Date(startTime), new Date(endTime), 60).then(function (response) {
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
                this.metricDataService.getMetricsForTimeRange(this.searchId, previousTimeRange[0], previousTimeRange[1]).then(function (response) {
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
                this.metricDataService.getMetricsForTimeRange(this.searchId, new Date(startTime), new Date(endTime), 300).then(function (response) {
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
        MetricsViewController.$inject = ['$scope', '$rootScope', '$interval', '$log', 'metricDataService'];
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

angular.module("hawkular-metrics-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/metrics/html/add-url.html","<div class=\"row\" ng-controller=\"HawkularMetrics.AddUrlController\" style=\"margin-left: 10px;\">\n    <h1>Welcome Brian!</h1>\n\n    <h2>Collect metrics from a website that you want to monitor.</h2>\n\n    <form class=\"form-horizontal\" name=\"addUrlForm\" role=\"form\" novalidate>\n        <div class=\"form-group input\">\n            <div class=\"col-lg-6 col-sm-8 col-xs-12 align-center\">\n                <div class=\"input-group\">\n                    <input type=\"url\" class=\"form-control input-lg\" name=\"resourceUrl\" ng-model=\"vm.resourceUrl\"\n                           ng-model-options=\"{ updateOn: \'default blur\'}\"\n                           placeholder=\"Enter a website URL (e.g., http://mysite.com/home)\" required >\n                      <span class=\"error-message\"\n                            ng-show=\"addUrlForm.resourceUrl.$dirty && addUrlForm.resourceUrl.$error.required\">The URL you entered is not valid. Please enter a valid URL.</span>\n\n              <span class=\"input-group-btn\">\n                <button class=\"btn btn-primary btn-lg\" type=\"button\" ng-disabled=\"!addUrlForm.$valid\"\n                        ng-click=\"vm.addUrl(vm.resourceUrl)\">Get Metrics\n                </button>\n              </span>\n                </div>\n            </div>\n        </div>\n    </form>\n</div>\n");
$templateCache.put("plugins/metrics/html/metrics-selection.html","<div class=\"row\" ng-controller=\"HawkularMetrics.MetricsSelectionController\">\n    <div class=\"col-md-12\">\n        <h1>Metrics Selection: TBD</h1>\n       TBD\n    </div>\n</div>\n");
$templateCache.put("plugins/metrics/html/metrics-view.html","<div class=\"panel panel-default\" style=\"width:880px\" ng-controller=\"MetricsViewController as vm\">\n    <div class=\"panel-body\">\n        <div class=\"well\">\n            <small style=\"margin-left: 15px\" class=\"graphDateTimeRangeLabel\"></small>\n\n            <form class=\"form-horizontal\" name=\"chartForm\" role=\"form\" novalidate>\n\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\">Metric ID:</label>\n\n                    <div class=\"col-sm-5\">\n                        <input type=\"text\" class=\"form-control\" name=\"searchId\" ng-model=\"vm.searchId\"\n                               ng-model-options=\"{ updateOn: \'default blur\', debounce: { \'default\': 700, \'blur\': 0 } }\"\n                               placeholder=\"Enter Id...\" required ng-minlength=\"1\">\n                        <span class=\"error-message\"\n                              ng-show=\"chartForm.searchId.$dirty && chartForm.searchId.$error.required\"> * Required.</span>\n                        <span class=\"help-block\">Example: 100, apache3.cpu1  </span>\n                    </div>\n                </div>\n\n                <!--<div class=\"row\">-->\n                <!--<div class=\"col-md-12\">-->\n                <!--<relative-time-range-button-bar style=\"margin-left: 140px;\"-->\n                <!--start-time-stamp=\"vm.startTimestamp\"-->\n                <!--end-time-stamp=\"vm..endTimeStamp\">-->\n                <!--</relative-time-range-button-bar>-->\n\n                <!--<input type=\"text\" style=\"margin-left: 20px;text-align: center;\" ng-model=\"vm.dateRange\" readonly disbabled/>-->\n                <!--<p></p>-->\n                <!--</div>-->\n                <!--</div>-->\n\n                <!--<div class=\"form-group\">-->\n                <!--<label class=\"col-sm-2 control-label\">Start</label>-->\n\n                <!--<div class=\"col-sm-6\">-->\n                <!--<div class=\"dropdown\">-->\n                <!--<a class=\"dropdown-toggle\" id=\"dropdownStart\" role=\"button\" data-toggle=\"dropdown\"-->\n                <!--data-target=\"#\" href=\"#\">-->\n                <!--<div class=\"input-group\">-->\n                <!--<input type=\"text\" class=\"form-control\"-->\n                <!--data-ng-model=\"vm.startTimeStamp\">-->\n                <!--<span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-calendar\"></i></span>-->\n                <!--</div>-->\n                <!--</a>-->\n                <!--<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">-->\n                <!--<datetimepicker data-ng-model=\"vm.startTimeStamp\"-->\n                <!--data-datetimepicker-config=\"{ dropdownSelector: \'#dropdownStart\' }\"/>-->\n                <!--</ul>-->\n                <!--</div>-->\n                <!--</div>-->\n                <!--</div>-->\n\n\n                <!--<div class=\"form-group\">-->\n                <!--<label class=\"col-sm-2 control-label\">End</label>-->\n\n                <!--<div class=\"col-sm-6\">-->\n\n                <!--<div class=\"dropdown\">-->\n                <!--<a class=\"dropdown-toggle\" id=\"dropdownEnd\" role=\"button\" data-toggle=\"dropdown\"-->\n                <!--data-target=\"#\" href=\"#\">-->\n                <!--<div class=\"input-group\">-->\n                <!--<input type=\"text\" class=\"form-control\"-->\n                <!--data-ng-model=\"vm.endTimeStamp\">-->\n                <!--<span class=\"input-group-addon\"><i-->\n                <!--class=\"glyphicon glyphicon-calendar\"></i></span>-->\n                <!--</div>-->\n                <!--</a>-->\n                <!--<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">-->\n                <!--<datetimepicker data-ng-model=\"vm.endTimeStamp\"-->\n                <!--data-datetimepicker-config=\"{ dropdownSelector: \'#dropdownEnd\' }\"/>-->\n                <!--</ul>-->\n                <!--</div>-->\n                <!--</div>-->\n                <!--</div>-->\n\n                <div class=\"form-group\">\n                    <div class=\"col-sm-offset-2 col-sm-10\">\n                        <button type=\"button\" class=\"btn btn-primary\"\n                                ng-disabled=\"!chartForm.$valid\"\n                                ng-click=\"vm.refreshChartDataNow()\">Refresh\n                        </button>\n                    </div>\n                </div>\n        </div>\n        </form>\n    </div>\n\n\n    <div ng-show=\"vm.chartData.dataPoints.length > 1\">\n        <div id=\"stackedBarChart\" style=\"height:270px\">\n            <!-- HINT: colors for the chart can be changed in the d3-chart.css -->\n            <hawkular-chart\n                    data=\"{{vm.chartData.dataPoints}}\"\n                    chart-type=\"bar\"\n                    show-avg-line=\"{{vm.showAvgLine}}\"\n                    hide-high-low-values=\"{{vm.hideHighLowValues}}\"\n                    chart-title=\"{{\'Metrics Id: \'+vm.searchId}}\"\n                    chart-height=\"250\"></hawkular-chart>\n        </div>\n\n        <div style=\"margin-top: 30px;\">\n            <button class=\"btn btn-sm\" ng-click=\"vm.showPreviousTimeRange()\" style=\"margin-left:90px;\"\n                    ng-show=\"vm.chartData.dataPoints.length > 2\">&lt;&lt; Prev.\n            </button>\n            <button class=\"btn btn-sm\" style=\"float:right;margin-right: 90px;\" ng-click=\"vm.showNextTimeRange()\"\n                    ng-show=\"vm.chartData.dataPoints.length > 2\" ng-disabled=\"!vm.hasNext();\">Next &gt;&gt;</button>\n        </div>\n        <br/>\n\n    </div>\n</div>\n</div>\n");
$templateCache.put("plugins/metrics/html/overview.html","<div class=\"row\" ng-controller=\"HawkularMetrics.OverviewController\">\n    <div class=\"col-md-12\">\n        <h1>Overview: TBD</h1>\n       TBD\n    </div>\n</div>\n");}]); hawtioPluginLoader.addModule("hawkular-metrics-templates");