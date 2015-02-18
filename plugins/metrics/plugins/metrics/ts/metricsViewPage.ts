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

module HawkularMetrics {

    export interface IContextChartDataPoint {
        timestamp: number;
        value: number;
        avg: number;
        empty: boolean;
    }

    export interface IChartDataPoint extends IContextChartDataPoint {
        date: Date;
        min: number;
        max: number;
    }

///    export interface IChartParams {
///        searchId: string;
///        startTimeStamp: Date;
///        endTimeStamp: Date;
///        dateRange: string;
///        updateEndTimeStampToNow: boolean;
///        collapseTable: boolean;
///        showAvgLine: boolean;
///        hideHighLowValues:boolean;
///        showPreviousRangeDataOverlay: boolean;
///        showContextZoom: boolean;
///        showAutoRefreshCancel:boolean;
///        chartType: string;
///        chartTypes: string[];
///
///    }
    export interface IMetricsViewController {
        searchId: string;
        startTimeStamp: Date;
        endTimeStamp: Date;
        dateRange: string;
        showAvgLine: boolean;
        hideHighLowValues:boolean;
        showPreviousRangeDataOverlay: boolean;
        showContextZoom: boolean;

        showPreviousTimeRange():void;
        showNextTimeRange():void;
        hasNext():boolean;
        refreshChartDataNow(startTime:Date):void;
        refreshHistoricalChartData(startDate:Date, endDate:Date):void;
        refreshHistoricalChartDataForTimestamp(startTime?:number, endTime?:number):void;
        overlayPreviousRangeData():void;
        togglePreviousRangeDataOverlay():void;
        toggleContextZoom():void ;
        refreshContextChart():void;
    }


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
    export class MetricsViewController implements IMetricsViewController {
        public static  $inject = ['$scope', '$rootScope', '$interval', '$log', 'HawkularMetric'];

        searchId = '';
        showAvgLine = true;
        hideHighLowValues = false;
        showPreviousRangeDataOverlay = false;
        showContextZoom = true;
        private tenantId = 'test';

        constructor(private $scope:any,
                    private $rootScope:ng.IRootScopeService,
                    private $interval:ng.IIntervalService,
                    private $log:ng.ILogService,
                    private HawkularMetric:any,
                    public startTimeStamp:Date,
                    public endTimeStamp:Date,
                    public dateRange:string) {
            $scope.vm = this;

            this.startTimeStamp = moment().subtract(72, 'hours').toDate();
            this.endTimeStamp = new Date();
            this.dateRange = moment().subtract(72, 'hours').from(moment());

            $scope.$watch('vm.searchId', (newValue, oldValue)  => {
                this.refreshChartDataNow();
            });

            $scope.$on('GraphTimeRangeChangedEvent', (event, timeRange) => {
                $scope.vm.startTimeStamp = timeRange[0];
                $scope.vm.endTimeStamp = timeRange[1];
                $scope.vm.dateRange = moment(timeRange[0]).from(moment(timeRange[1]));
                $scope.vm.refreshHistoricalChartDataForTimestamp(startTimeStamp.getTime(), endTimeStamp.getTime());
            });

        }

        private bucketedDataPoints:IChartDataPoint[] = [];
        private contextDataPoints:IChartDataPoint[] = [];
        private chartData:any;


        ///@todo: refactor out vars to I/F object
        ///chartInputParams:IChartInputParams ;

///       $rootScope.$on('DateRangeMove', (event, message) =>  {
///            $log.debug('DateRangeMove on chart Detected.');
///        });

        private noDataFoundForId(id:string):void {
            this.$log.warn('No Data found for id: ' + id);
            toastr.warning('No Data found for id: ' + id);
        }

        private static calculatePreviousTimeRange(startDate:Date, endDate:Date):any {
            var previousTimeRange:Date[] = [];
            var intervalInMillis = endDate.getTime() - startDate.getTime();

            previousTimeRange.push(new Date(startDate.getTime() - intervalInMillis));
            previousTimeRange.push(startDate);
            return previousTimeRange;
        }

        showPreviousTimeRange():void {
            var previousTimeRange = MetricsViewController.calculatePreviousTimeRange(this.startTimeStamp, this.endTimeStamp);

            this.startTimeStamp = previousTimeRange[0];
            this.endTimeStamp = previousTimeRange[1];
            this.refreshHistoricalChartData(this.startTimeStamp, this.endTimeStamp);

        }


        private static calculateNextTimeRange(startDate:Date, endDate:Date):any {
            var nextTimeRange = [];
            var intervalInMillis = endDate.getTime() - startDate.getTime();

            nextTimeRange.push(endDate);
            nextTimeRange.push(new Date(endDate.getTime() + intervalInMillis));
            return nextTimeRange;
        }


        showNextTimeRange():void {
            var nextTimeRange = MetricsViewController.calculateNextTimeRange(this.startTimeStamp, this.endTimeStamp);

            this.startTimeStamp = nextTimeRange[0];
            this.endTimeStamp = nextTimeRange[1];
            this.refreshHistoricalChartData(this.startTimeStamp, this.endTimeStamp);

        }


        hasNext():boolean {
            var nextTimeRange = MetricsViewController.calculateNextTimeRange(this.startTimeStamp, this.endTimeStamp);
            // unsophisticated test to see if there is a next; without actually querying.

            //@fixme: pay the price, do the query!
            return nextTimeRange[1].getTime() < new Date().getTime();
        }


        refreshChartDataNow(startTime?:Date):void {
            var adjStartTimeStamp:Date = moment().subtract('hours', 72).toDate(); //default time period set to 24 hours
            this.$rootScope.$broadcast('MultiChartOverlayDataChanged');
            this.endTimeStamp = new Date();
            this.refreshHistoricalChartData(angular.isUndefined(startTime) ? adjStartTimeStamp : startTime, this.endTimeStamp);
        }

        refreshHistoricalChartData(startDate:Date, endDate:Date):void {
            this.refreshHistoricalChartDataForTimestamp(startDate.getTime(), endDate.getTime());
        }


        refreshHistoricalChartDataForTimestamp(startTime?:number, endTime?:number):void {
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

                this.HawkularMetric.NumericMetricData.queryMetrics({tenantId: this.tenantId, numericId: this.searchId, start: startTime, end: endTime, buckets:  60}).$promise
                   .then((response) => {
                        console.dir(response);
                        // we want to isolate the response from the data we are feeding to the chart
                        this.bucketedDataPoints = this.formatBucketedChartOutput(response);
                        console.dir(this.bucketedDataPoints);

                        if (this.bucketedDataPoints.length !== 0) {
                            // this is basically the DTO for the chart
                            this.chartData = {
                                id: this.searchId,
                                startTimeStamp: this.startTimeStamp,
                                endTimeStamp: this.endTimeStamp,
                                dataPoints: this.bucketedDataPoints,
                                contextDataPoints: this.contextDataPoints,
                                annotationDataPoints: []
                            };

                        } else {
                            this.noDataFoundForId(this.searchId);
                        }

                    }, (error) => {
                        toastr.error('Error Loading Chart Data: ' + error);
                    });
            }

        }

        private formatBucketedChartOutput(response):IChartDataPoint[] {
            //  The schema is different for bucketed output
            return _.map(response.data, (point:IChartDataPoint) => {
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
        }


        togglePreviousRangeDataOverlay():void {
            if (this.showPreviousRangeDataOverlay) {
                this.chartData.prevDataPoints = [];
            } else {
                this.overlayPreviousRangeData();
            }
        }


        overlayPreviousRangeData():void {
            var previousTimeRange = MetricsViewController.calculatePreviousTimeRange(this.startTimeStamp, this.endTimeStamp);

            if (this.searchId !== '') {
                this.HawkularMetric.NumericMetricData.queryMetrics({tenantId: this.tenantId, numericId: this.searchId, start: previousTimeRange[0], end: previousTimeRange[1], buckets:  60}).$promise
                    .then((response) => {
                        // we want to isolate the response from the data we are feeding to the chart
                        var prevTimeRangeBucketedDataPoints = this.formatPreviousBucketedOutput(response);

                        if (angular.isDefined(prevTimeRangeBucketedDataPoints) && prevTimeRangeBucketedDataPoints.length !== 0) {

                            // this is basically the DTO for the chart
                            this.chartData = {
                                id: this.searchId,
                                prevStartTimeStamp: previousTimeRange[0],
                                prevEndTimeStamp: previousTimeRange[1],
                                prevDataPoints: prevTimeRangeBucketedDataPoints,
                                dataPoints: this.bucketedDataPoints,
                                contextDataPoints: this.contextDataPoints,
                                annotationDataPoints: []
                            };

                        } else {
                            this.noDataFoundForId(this.searchId);
                        }

                    }, (error) => {
                        toastr.error('Error loading Prev Range graph data', 'Status: ' + error);
                    });
            }
        }

        private formatPreviousBucketedOutput(response) {
            //  The schema is different for bucketed output
            var mappedNew = _.map(response, (point:IChartDataPoint, i:number)  => {
                return {
                    timestamp: this.bucketedDataPoints[i].timestamp,
                    originalTimestamp: point.timestamp,
                    value: !angular.isNumber(point.value) ? 0 : point.value,
                    avg: (point.empty) ? 0 : point.avg,
                    min: !angular.isNumber(point.min) ? 0 : point.min,
                    max: !angular.isNumber(point.max) ? 0 : point.max,
                    empty: point.empty
                };
            });
            return mappedNew;
        }


        toggleContextZoom():void {
            if (this.showContextZoom) {
                this.chartData.contextDataPoints = [];
            } else {
                this.refreshContextChart();
            }
        }

        refreshContextChart():void {
            // unsophisticated default time range to avoid DB checking right now
            // @fixme: add a real service to determine unbounded range
            var endTime = moment().valueOf(),
                startTime = moment().subtract('months', 24).valueOf();

            this.$log.debug('refreshChartContext');
            if (this.searchId !== '') {
                if (startTime >= endTime) {
                    this.$log.warn('Start Date was >= End Date');
                    return;
                }


                this.HawkularMetric.NumericMetricData.queryMetrics({tenantId: this.tenantId, numericId: this.searchId, start: startTime, end: endTime, buckets:  60}).$promise
                    .then((response) => {

                        this.chartData.contextDataPoints = this.formatContextOutput(response);

                        if (angular.isUndefined(this.chartData.contextDataPoints) || this.chartData.contextDataPoints.length === 0) {
                            this.noDataFoundForId(this.searchId);
                        }

                    }, (error) => {
                        toastr.error('Error loading Context graph data', 'Status: ' + error);
                    });
            }
        }

        private formatContextOutput(response) {
            //  The schema is different for bucketed output
            return _.map(response, (point:IChartDataPoint) => {
                return {
                    timestamp: point.timestamp,
                    value: !angular.isNumber(point.value) ? 0 : point.value,
                    avg: (point.empty) ? 0 : point.avg,
                    empty: point.empty
                };
            });
        }
    }

    _module.controller('MetricsViewController', MetricsViewController);

}
