/// <reference path="../libs/hawtio-utilities/defs.d.ts"/>
/// <reference path="../libs/hawtio-core-dts/defs.d.ts"/>
/// <reference path="../vendor/moment/moment.d.ts"/>
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

/// <reference path="../../includes.ts"/>
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

/// <reference path="../../includes.ts"/>
/// <reference path="metricsGlobals.ts"/>
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
    HawkularMetrics._module = angular.module(HawkularMetrics.pluginName, []);
    var metricsTab;
    HawkularMetrics._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, navBuilder) {
        metricsTab = navBuilder.create().id(HawkularMetrics.pluginName).title(function () { return "Metrics"; }).href(function () { return "/metrics"; }).subPath("Config", "config", navBuilder.join(HawkularMetrics.templatePath, 'config.html')).subPath("Graphs", "graphs", navBuilder.join(HawkularMetrics.templatePath, 'graphs.html')).subPath("Advanced", "advanced", navBuilder.join(HawkularMetrics.templatePath, 'advanced.html')).build();
        navBuilder.configureRouting($routeProvider, metricsTab);
        $locationProvider.html5Mode(true);
    }]);
    HawkularMetrics._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(metricsTab);
        HawkularMetrics.log.debug("loaded");
        console.warn("loaded");
    }]);
    hawtioPluginLoader.addModule(HawkularMetrics.pluginName);
})(HawkularMetrics || (HawkularMetrics = {}));

/// <reference path="metricsPlugin.ts"/>
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
    HawkularMetrics.AdvancedController = HawkularMetrics._module.controller("HawkularMetrics.AdvancedController", ['$scope', function ($scope) {
        $scope.advancedName = "Advanced Stuff";
    }]);
})(HawkularMetrics || (HawkularMetrics = {}));

/// <reference path="metricsPlugin.ts"/>
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
    HawkularMetrics.ConfigController = HawkularMetrics._module.controller("HawkularMetrics.ConfigController", ['$scope', function ($scope) {
        $scope.configName = "My Configuration";
    }]);
})(HawkularMetrics || (HawkularMetrics = {}));

/// <reference path="metricsPlugin.ts"/>
/// <reference path="../../includes.ts"/>
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
    /**
     * @ngdoc controller
     * @name ChartController
     * @description This controller is responsible for handling activity related to the Chart tab.
     * @param $scope
     * @param $rootScope
     * @param $interval
     * @param $log
     * @param metricDataService
     */
    var ChartController = (function () {
        function ChartController($scope, $rootScope, $interval, $log, metricDataService, startTimeStamp, endTimeStamp, dateRange) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$interval = $interval;
            this.$log = $log;
            this.metricDataService = metricDataService;
            this.startTimeStamp = startTimeStamp;
            this.endTimeStamp = endTimeStamp;
            this.dateRange = dateRange;
            this.searchId = '';
            this.updateEndTimeStampToNow = false;
            this.collapseTable = true;
            this.tableButtonLabel = 'Show Table';
            this.showAvgLine = true;
            this.hideHighLowValues = false;
            this.showPreviousRangeDataOverlay = false;
            this.showContextZoom = true;
            this.showAutoRefreshCancel = false;
            this.chartType = 'bar';
            this.chartTypes = ['bar', 'line', 'area', 'scatter', 'scatterline', 'candlestick', 'histogram'];
            this.dateTimeRanges = [
                { 'range': '1h', 'rangeInSeconds': 60 * 60 },
                { 'range': '4h', 'rangeInSeconds': 4 * 60 * 60 },
                { 'range': '8h', 'rangeInSeconds': 8 * 60 * 60 },
                { 'range': '12h', 'rangeInSeconds': 12 * 60 * 60 },
                { 'range': '1d', 'rangeInSeconds': 24 * 60 * 60 },
                { 'range': '5d', 'rangeInSeconds': 5 * 24 * 60 * 60 },
                { 'range': '1m', 'rangeInSeconds': 30 * 24 * 60 * 60 },
                { 'range': '3m', 'rangeInSeconds': 3 * 30 * 24 * 60 * 60 },
                { 'range': '6m', 'rangeInSeconds': 6 * 30 * 24 * 60 * 60 }
            ];
            this.bucketedDataPoints = [];
            this.contextDataPoints = [];
            $scope.vm = this;
            this.startTimeStamp = moment().subtract('hours', 24).toDate(); //default time period set to 24 hours
            this.endTimeStamp = new Date();
            this.dateRange = moment().subtract('hours', 24).from(moment(), true);
            $scope.$on('GraphTimeRangeChangedEvent', function (event, timeRange) {
                $scope.vm.startTimeStamp = timeRange[0];
                $scope.vm.endTimeStamp = timeRange[1];
                $scope.vm.dateRange = moment(timeRange[0]).from(moment(timeRange[1]));
                $scope.vm.refreshHistoricalChartDataForTimestamp(startTimeStamp, endTimeStamp);
            });
        }
        //@todo: refactor out vars to I/F object
        //chartInputParams:IChartInputParams ;
        //       $rootScope.$on('DateRangeMove', (event, message) =>  {
        //            $log.debug('DateRangeMove on chart Detected.');
        //        });
        //
        ChartController.prototype.noDataFoundForId = function (id) {
            this.$log.warn('No Data found for id: ' + id);
            toastr.warning('No Data found for id: ' + id);
        };
        ChartController.prototype.calculatePreviousTimeRange = function (startDate, endDate) {
            var previousTimeRange = [];
            var intervalInMillis = endDate.getTime() - startDate.getTime();
            previousTimeRange.push(new Date(startDate.getTime() - intervalInMillis));
            previousTimeRange.push(startDate);
            return previousTimeRange;
        };
        ChartController.prototype.showPreviousTimeRange = function () {
            var previousTimeRange = this.calculatePreviousTimeRange(this.startTimeStamp, this.endTimeStamp);
            this.startTimeStamp = previousTimeRange[0];
            this.endTimeStamp = previousTimeRange[1];
            this.refreshHistoricalChartData(this.startTimeStamp, this.endTimeStamp);
        };
        ChartController.prototype.calculateNextTimeRange = function (startDate, endDate) {
            var nextTimeRange = [];
            var intervalInMillis = endDate.getTime() - startDate.getTime();
            nextTimeRange.push(endDate);
            nextTimeRange.push(new Date(endDate.getTime() + intervalInMillis));
            return nextTimeRange;
        };
        ChartController.prototype.showNextTimeRange = function () {
            var nextTimeRange = this.calculateNextTimeRange(this.startTimeStamp, this.endTimeStamp);
            this.startTimeStamp = nextTimeRange[0];
            this.endTimeStamp = nextTimeRange[1];
            this.refreshHistoricalChartData(this.startTimeStamp, this.endTimeStamp);
        };
        ChartController.prototype.hasNext = function () {
            var nextTimeRange = this.calculateNextTimeRange(this.startTimeStamp, this.endTimeStamp);
            // unsophisticated test to see if there is a next; without actually querying.
            //@fixme: pay the price, do the query!
            return nextTimeRange[1].getTime() < _.now();
        };
        ChartController.prototype.toggleTable = function () {
            this.collapseTable = !this.collapseTable;
            if (this.collapseTable) {
                this.tableButtonLabel = 'Show Table';
            }
            else {
                this.tableButtonLabel = 'Hide Table';
            }
        };
        ChartController.prototype.cancelAutoRefresh = function () {
            this.showAutoRefreshCancel = !this.showAutoRefreshCancel;
            this.$interval.cancel(this.updateLastTimeStampToNowPromise);
            toastr.info('Canceling Auto Refresh');
        };
        ChartController.prototype.autoRefresh = function (intervalInSeconds) {
            var _this = this;
            toastr.info('Auto Refresh Mode started');
            this.updateEndTimeStampToNow = !this.updateEndTimeStampToNow;
            this.showAutoRefreshCancel = true;
            if (this.updateEndTimeStampToNow) {
                this.refreshHistoricalChartDataForTimestamp();
                this.showAutoRefreshCancel = true;
                this.updateLastTimeStampToNowPromise = this.$interval(function () {
                    _this.endTimeStamp = new Date();
                    _this.refreshHistoricalChartDataForTimestamp();
                }, intervalInSeconds * 1000);
            }
            else {
                this.$interval.cancel(this.updateLastTimeStampToNowPromise);
            }
            this.$scope.$on('$destroy', function () {
                _this.$interval.cancel(_this.updateLastTimeStampToNowPromise);
            });
        };
        ChartController.prototype.refreshChartDataNow = function (startTime) {
            var adjStartTimeStamp = moment().subtract('hours', 24).toDate(); //default time period set to 24 hours
            this.$rootScope.$broadcast('MultiChartOverlayDataChanged');
            this.endTimeStamp = new Date();
            this.refreshHistoricalChartData(angular.isUndefined(startTime) ? adjStartTimeStamp : startTime, this.endTimeStamp);
        };
        ChartController.prototype.refreshHistoricalChartData = function (startDate, endDate) {
            this.refreshHistoricalChartDataForTimestamp(startDate.getTime(), endDate.getTime());
        };
        ChartController.prototype.refreshHistoricalChartDataForTimestamp = function (startTime, endTime) {
            var _this = this;
            // calling refreshChartData without params use the model values
            if (angular.isUndefined(endTime)) {
                endTime = this.endTimeStamp.getTime();
            }
            if (angular.isUndefined(startTime)) {
                startTime = this.startTimeStamp.getTime();
            }
            ///
            ///       if (startTime >= endTime) {
            ///            $log.warn('Start Date was >= End Date');
            ///            return;
            ///        }
            if (this.searchId !== '') {
                this.metricDataService.getMetricsForTimeRange(this.searchId, new Date(startTime), new Date(endTime)).then(function (response) {
                    console.dir(response);
                    // we want to isolate the response from the data we are feeding to the chart
                    _this.bucketedDataPoints = _this.formatBucketedChartOutput(response);
                    if (_this.bucketedDataPoints.length !== 0) {
                        // this is basically the DTO for the chart
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
        ChartController.prototype.formatBucketedChartOutput = function (response) {
            //  The schema is different for bucketed output
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
        ChartController.prototype.togglePreviousRangeDataOverlay = function () {
            if (this.showPreviousRangeDataOverlay) {
                this.chartData.prevDataPoints = [];
            }
            else {
                this.overlayPreviousRangeData();
            }
        };
        ChartController.prototype.overlayPreviousRangeData = function () {
            var _this = this;
            var previousTimeRange = this.calculatePreviousTimeRange(this.startTimeStamp, this.endTimeStamp);
            if (this.searchId !== '') {
                this.metricDataService.getMetricsForTimeRange(this.searchId, previousTimeRange[0], previousTimeRange[1]).then(function (response) {
                    // we want to isolate the response from the data we are feeding to the chart
                    var prevTimeRangeBucketedDataPoints = _this.formatPreviousBucketedOutput(response);
                    if (angular.isDefined(prevTimeRangeBucketedDataPoints) && prevTimeRangeBucketedDataPoints.length !== 0) {
                        // this is basically the DTO for the chart
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
        ChartController.prototype.formatPreviousBucketedOutput = function (response) {
            var _this = this;
            //  The schema is different for bucketed output
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
        ChartController.prototype.toggleContextZoom = function () {
            if (this.showContextZoom) {
                this.chartData.contextDataPoints = [];
            }
            else {
                this.refreshContextChart();
            }
        };
        ChartController.prototype.refreshContextChart = function () {
            var _this = this;
            // unsophisticated default time range to avoid DB checking right now
            // @fixme: add a real service to determine unbounded range
            var endTime = _.now(), startTime = moment().subtract('months', 24).valueOf();
            console.debug('refreshChartContext');
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
        ChartController.prototype.formatContextOutput = function (response) {
            //  The schema is different for bucketed output
            return _.map(response, function (point) {
                return {
                    timestamp: point.timestamp,
                    value: !angular.isNumber(point.value) ? 0 : point.value,
                    avg: (point.empty) ? 0 : point.avg,
                    empty: point.empty
                };
            });
        };
        ChartController.$inject = ['$scope', '$rootScope', '$interval', '$log', 'metricDataService'];
        return ChartController;
    })();
    HawkularMetrics.ChartController = ChartController;
    HawkularMetrics._module.controller('ChartController', ChartController);
})(HawkularMetrics || (HawkularMetrics = {}));

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
    /**
     * NOTE: this class is Temporary and will go away soon and use ngResource version of REST api
     */
    var MetricDataService = (function () {
        function MetricDataService($q, $rootScope, $http, $log) {
            this.$q = $q;
            this.$rootScope = $rootScope;
            this.$http = $http;
            this.$log = $log;
        }
        MetricDataService.prototype.getBaseUrl = function () {
            /// @todo HARDCODED URL
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

angular.module("hawkular-metrics-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/metrics/html/advanced.html","<div class=\"row\" ng-controller=\"HawkularMetrics.AdvancedController\">\n    <div class=\"col-md-12\">\n        <h1>Advanced Settings: {{advancedName}}</h1>\n       TBD\n    </div>\n</div>\n");
$templateCache.put("plugins/metrics/html/config.html","<div class=\"row\" ng-controller=\"HawkularMetrics.ConfigController\">\n    <div class=\"col-md-12\">\n        <h1>Metrics Graph Config</h1>\n        <h3>{{configName}}</h3>\n       TBD\n    </div>\n</div>\n");
$templateCache.put("plugins/metrics/html/graphs.html","<div class=\"panel panel-default\" style=\"width:880px\" ng-controller=\"ChartController as vm\">\n    <div class=\"panel-body\">\n        <div class=\"well\">\n            <small style=\"margin-left: 15px\" class=\"graphDateTimeRangeLabel\"></small>\n\n            <form class=\"form-horizontal\" name=\"chartForm\" role=\"form\" novalidate >\n\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\">Metric ID:</label>\n\n                    <div class=\"col-sm-5\">\n                        <input type=\"text\" class=\"form-control\" name=\"searchId\" ng-model=\"vm.searchId\"\n                               ng-enter=\"vm.refreshChartDataNow();\"\n                               placeholder=\"Enter Id...\" required ng-minlength=\"1\">\n                        <span class=\"error-message\"\n                              ng-show=\"chartForm.searchId.$dirty && chartForm.searchId.$error.required\"> * Required.</span>\n                        <span class=\"help-block\">Example: 100, apache3.cpu1  </span>\n                    </div>\n                </div>\n\n                <!--<div class=\"row\">-->\n                    <!--<div class=\"col-md-12\">-->\n                        <!--<relative-time-range-button-bar style=\"margin-left: 140px;\"-->\n                                                        <!--start-time-stamp=\"vm.startTimestamp\"-->\n                                                        <!--end-time-stamp=\"vm..endTimeStamp\">-->\n                        <!--</relative-time-range-button-bar>-->\n\n                        <!--<input type=\"text\" style=\"margin-left: 20px;text-align: center;\" ng-model=\"vm.dateRange\" readonly disbabled/>-->\n                        <!--<p></p>-->\n                    <!--</div>-->\n                <!--</div>-->\n\n                <!--<div class=\"form-group\">-->\n                <!--<label class=\"col-sm-2 control-label\">Start</label>-->\n\n                <!--<div class=\"col-sm-6\">-->\n                <!--<div class=\"dropdown\">-->\n                <!--<a class=\"dropdown-toggle\" id=\"dropdownStart\" role=\"button\" data-toggle=\"dropdown\"-->\n                <!--data-target=\"#\" href=\"#\">-->\n                <!--<div class=\"input-group\">-->\n                <!--<input type=\"text\" class=\"form-control\"-->\n                <!--data-ng-model=\"vm.startTimeStamp\">-->\n                <!--<span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-calendar\"></i></span>-->\n                <!--</div>-->\n                <!--</a>-->\n                <!--<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">-->\n                <!--<datetimepicker data-ng-model=\"vm.startTimeStamp\"-->\n                <!--data-datetimepicker-config=\"{ dropdownSelector: \'#dropdownStart\' }\"/>-->\n                <!--</ul>-->\n                <!--</div>-->\n                <!--</div>-->\n                <!--</div>-->\n\n\n                <!--<div class=\"form-group\">-->\n                <!--<label class=\"col-sm-2 control-label\">End</label>-->\n\n                <!--<div class=\"col-sm-6\">-->\n\n                <!--<div class=\"dropdown\">-->\n                <!--<a class=\"dropdown-toggle\" id=\"dropdownEnd\" role=\"button\" data-toggle=\"dropdown\"-->\n                <!--data-target=\"#\" href=\"#\">-->\n                <!--<div class=\"input-group\">-->\n                <!--<input type=\"text\" class=\"form-control\"-->\n                <!--data-ng-model=\"vm.endTimeStamp\">-->\n                <!--<span class=\"input-group-addon\"><i-->\n                <!--class=\"glyphicon glyphicon-calendar\"></i></span>-->\n                <!--</div>-->\n                <!--</a>-->\n                <!--<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">-->\n                <!--<datetimepicker data-ng-model=\"vm.endTimeStamp\"-->\n                <!--data-datetimepicker-config=\"{ dropdownSelector: \'#dropdownEnd\' }\"/>-->\n                <!--</ul>-->\n                <!--</div>-->\n                <!--</div>-->\n                <!--</div>-->\n\n                <div class=\"form-group\">\n                    <div class=\"col-sm-offset-2 col-sm-10\">\n                        <div class=\"btn-group\" ng-disabled=\"!chartForm.$valid || vm.showAutoRefreshCancel\" dropdown>\n                            <button type=\"button\" class=\"btn btn-primary\" ng-disabled=\"!chartForm.$valid || vm.showAutoRefreshCancel\"\n                                    ng-click=\"vm.refreshChartDataNow()\">Refresh\n                            </button>\n                            <button type=\"button\" class=\"btn btn-primary dropdown-toggle\" ng-disabled=\"!chartForm.$valid || vm.showAutoRefreshCancel\">\n                                <span class=\"caret\"></span>\n                                <span class=\"sr-only\">Refresh</span>\n                            </button>\n                            <ul class=\"dropdown-menu\" role=\"menu\" ng-disabled=\"!chartForm.$valid\">\n                                <li><a href=\"#\" ng-click=\"vm.refreshHistoricalChartData()\">Refresh from History</a></li>\n                                <li><a href=\"#\" ng-click=\"vm.autoRefresh(5)\">Auto Refresh (every 5s)</a></li>\n                                <li><a href=\"#\" ng-click=\"vm.autoRefresh(30)\">Auto Refresh (every 30s)</a></li>\n                                <li><a href=\"#\" ng-click=\"vm.autoRefresh(60)\">Auto Refresh (every 1m)</a></li>\n                            </ul>\n                        </div>\n                        <button style=\"margin-left: 15px\" type=\"button\" class=\"btn-small btn-danger\" ng-hide=\"!vm.showAutoRefreshCancel\" ng-click=\"vm.cancelAutoRefresh()\">Stop</button>\n                        <span class=\"help-block\">Default is Refresh to Now</span>\n                    </div>\n                </div>\n            </form>\n        </div>\n\n        <div ng-show=\"vm.chartData.dataPoints.length > 4\">\n            <div id=\"stackedBarChart\" style=\"height:270px\">\n                <!-- HINT: colors for the chart can be changed in the d3-chart.css -->\n                <rhqm-chart\n                        data=\"{{vm.chartData.dataPoints}}\"\n                        annotation-data=\"{{vm.chartData.annotationDataPoints}}\"\n                        previous-range-data=\"{{vm.chartData.prevDataPoints}}\"\n                        context-data=\"{{vm.chartData.contextDataPoints}}\"\n                        multi-chart-overlay-data=\"{{vm.multiChartOverlayData}}\"\n                        chart-type=\"{{vm.chartType}}\"\n                        show-avg-line=\"{{vm.showAvgLine}}\"\n                        hide-high-low-values=\"{{vm.hideHighLowValues}}\"\n                        chart-title=\"{{\'Metrics Id: \'+vm.searchId}}\"\n                        chart-height=\"250\"></rhqm-chart>\n            </div>\n\n            <div style=\"margin-top: 30px;\">\n                <button class=\"btn btn-sm\" ng-click=\"vm.showPreviousTimeRange()\" style=\"margin-left:90px;\"\n                        ng-show=\"vm.chartData.dataPoints.length > 2\">&lt;&lt; Prev.\n                </button>\n                <button class=\"btn btn-sm\" style=\"float:right;margin-right: 90px;\" ng-click=\"vm.showNextTimeRange()\"\n                        ng-show=\"vm.chartData.dataPoints.length > 2\" ng-disabled=\"!vm.hasNext();\">Next &gt;&gt;</button>\n            </div>\n            <br/>\n            <br/>\n\n            <div class=\"form-group\">\n\n                <label class=\"col-sm-2 control-label\">Chart Type:</label>\n\n                <div class=\"col-sm-10\">\n                    <div class=\"btn-group\">\n                        <button type=\"button\" class=\"btn btn-primary btn-sm\"\n                                ng-model=\"vm.chartType\" btn-radio=\"value\"\n                                ng-repeat=\"value in vm.chartTypes\"\n                                >{{value}}\n                        </button>\n                    </div>\n                </div>\n            </div>\n\n\n            <!--\n            <div class=\"form-group\" style=\"margin-top: 15px;\">\n                <label class=\"col-sm-2 control-label\">Features:</label>\n\n                <div class=\"col-sm-10\">\n                    <div class=\"btn-group\">\n                        <label class=\"btn btn-primary btn-sm\" ng-model=\"vm.showAvgLine\" btn-checkbox>Show Avg. Line</label>\n                        <label class=\"btn btn-primary btn-sm\" ng-model=\"vm.hideHighLowValues\" btn-checkbox>Hide High/Low Values</label>\n                        <label class=\"btn btn-primary btn-sm\" ng-model=\"vm.showPreviousRangeDataOverlay\" btn-checkbox\n                               ng-click=\"vm.togglePreviousRangeDataOverlay()\">Overlay Prev. Range</label>\n                        <label class=\"btn btn-primary btn-sm\" ng-model=\"vm.showContextZoom\" btn-checkbox ng-click=\"vm.toggleContextZoom()\">Show Context Zoom</label>\n                    </div>\n\n                </div>\n            </div>\n\n            <ng-include src=\"\'views/multi-metric-section.html\'\"></ng-include>\n\n            -->\n\n        </div>\n    </div>\n</div>\n");}]); hawtioPluginLoader.addModule("hawkular-metrics-templates");