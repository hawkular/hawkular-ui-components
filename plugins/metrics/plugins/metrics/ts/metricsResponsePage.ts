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

/// <reference path="metricsPlugin.ts"/>
/// <reference path="../../includes.ts"/>

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


    var sharedMetricId;

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
    export class MetricsViewController {
        /// for minification only
        public static  $inject = ['$scope', '$rootScope', '$interval', '$log', 'HawkularMetric', 'HawkularInventory'];

        constructor(private $scope:any,
                    private $rootScope:ng.IRootScopeService,
                    private $interval:ng.IIntervalService,
                    private $log:ng.ILogService,
                    private HawkularMetric:any,
                    private HawkularInventory:any,
                    public startTimeStamp:Date,
                    public endTimeStamp:Date,
                    public dateRange:string) {
            $scope.vm = this;

            this.startTimeStamp = moment().subtract(1, 'hours').toDate();
            this.endTimeStamp = new Date();
            this.dateRange = moment(this.startTimeStamp).format('H:mm') + ' - ' + moment(this.endTimeStamp).format('H:mm')
            + ' (' + moment(this.endTimeStamp).from(moment(this.startTimeStamp), true) + ')';

            $scope.$on('RefreshChart', (event) => {
                $scope.vm.refreshChartDataNow(this.getMetricId());
            });

            $scope.$watch('vm.selectedResource', (resource) => {
                if (angular.isUndefined(resource)) {
                    /// case when coming from addUrl screen
                    globalResourceList = this.HawkularInventory.Resource.query({tenantId: globalTenantId}).$promise.
                        then((resources)=> {
                        this.resourceList = resources;
                        this.selectedResource = resources[resources.length - 1];
                        $scope.vm.refreshChartDataNow(this.getMetricId());
                    });

                } else {
                    /// made a selection from url switcher
                    globalResourceId = resource.id;
                    $scope.vm.refreshChartDataNow(this.getMetricId());
                }

            });

            $scope.vm.onCreate();

        }

        private bucketedDataPoints:IChartDataPoint[] = [];
        private contextDataPoints:IChartDataPoint[] = [];
        private chartData:any;
        private isResponseTab = true;
        private autoRefreshPromise:ng.IPromise<number>;

        /// expose this to the View
        resourceList = [];
        selectedResource;


        private onCreate() {
            /// setup autorefresh for every minute
            this.autoRefresh(60);
            this.setupResourceList();
            this.resourceList = globalResourceList;
            this.selectedResource = this.resourceList[this.resourceList.length - 1];
            this.refreshChartDataNow(this.getMetricId());
        }

        setupResourceList() {
            globalResourceList = this.HawkularInventory.Resource.query({tenantId: globalTenantId});
            this.resourceList = globalResourceList;
        }

        cancelAutoRefresh():void {
            this.$interval.cancel(this.autoRefreshPromise);
            toastr.info('Canceling Auto Refresh');
        }

        autoRefresh(intervalInSeconds:number):void {
            this.refreshHistoricalChartDataForTimestamp(this.getMetricId());
            this.autoRefreshPromise = this.$interval(()  => {
                this.endTimeStamp = new Date();
                this.refreshHistoricalChartDataForTimestamp(this.getMetricId());
            }, intervalInSeconds * 1000);

            this.$scope.$on('$destroy', () => {
                this.$interval.cancel(this.autoRefreshPromise);
            });
        }

        private noDataFoundForId(id:string):void {
            this.$log.warn('No Data found for id: ' + id);
            ///toastr.warning('No Data found for id: ' + id);
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
            this.refreshHistoricalChartData(this.getMetricId(), this.startTimeStamp, this.endTimeStamp);

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
            this.refreshHistoricalChartData(this.getMetricId(), this.startTimeStamp, this.endTimeStamp);

        }


        hasNext():boolean {
            var nextTimeRange = MetricsViewController.calculateNextTimeRange(this.startTimeStamp, this.endTimeStamp);
            // unsophisticated test to see if there is a next; without actually querying.

            //@fixme: pay the price, do the query!
            return nextTimeRange[1].getTime() < new Date().getTime();
        }


        refreshChartDataNow(metricId:string, startTime?:Date):void {
            var adjStartTimeStamp:Date = moment().subtract('hours', 1).toDate(); //default time period set to 24 hours
            //this.$rootScope.$broadcast('MultiChartOverlayDataChanged');
            this.endTimeStamp = new Date();
            this.refreshHistoricalChartData(metricId, angular.isUndefined(startTime) ? adjStartTimeStamp : startTime, this.endTimeStamp);
        }

        refreshHistoricalChartData(metricId:string, startDate:Date, endDate:Date):void {
            this.refreshHistoricalChartDataForTimestamp(metricId, startDate.getTime(), endDate.getTime());
        }

        getMetricId() {
            var metricId = this.isResponseTab ? this.getResourceDurationMetricId() : this.getResourceCodeMetricId();
            sharedMetricId = metricId;
            return metricId;
        }

        private getResourceDurationMetricId() {
            return globalResourceId + '.status.duration';
        }

        private getResourceCodeMetricId() {
            return globalResourceId + '.status.code';
        }

        refreshHistoricalChartDataForTimestamp(metricId:string, startTime?:number, endTime?:number):void {
            // calling refreshChartData without params use the model values
            if (angular.isUndefined(endTime)) {
                endTime = this.endTimeStamp.getTime();
            }
            if (angular.isUndefined(startTime)) {
                startTime = this.startTimeStamp.getTime();
            }

            this.HawkularMetric.NumericMetricData.queryMetrics({
                tenantId: globalTenantId,
                numericId: metricId,
                start: startTime,
                end: endTime,
                buckets: 60
            }).$promise
                .then((response) => {
                    // we want to isolate the response from the data we are feeding to the chart
                    this.bucketedDataPoints = this.formatBucketedChartOutput(response);
                    console.dir(this.bucketedDataPoints);

                    if (this.bucketedDataPoints.length !== 0) {
                        // this is basically the DTO for the chart
                        this.chartData = {
                            id: metricId,
                            startTimeStamp: this.startTimeStamp,
                            endTimeStamp: this.endTimeStamp,
                            dataPoints: this.bucketedDataPoints,
                            contextDataPoints: this.contextDataPoints,
                            annotationDataPoints: []
                        };

                    } else {
                        this.noDataFoundForId(this.getMetricId());
                    }

                }, (error) => {
                    toastr.error('Error Loading Chart Data: ' + error);
                });

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

    }

    _module.controller('MetricsViewController', MetricsViewController);

    export interface IQuickAlertController {
        toggleQuickAlert():void
        saveQuickAlert():void
    }

    export class QuickAlertController implements IQuickAlertController {
        public static  $inject = ['$scope', 'HawkularAlert'];

        constructor(private $scope:any,
                    private HawkularAlert: any) {
            this.$scope.showQuickAlert = false;
            this.$scope.quickTrigger = {
                operator: 'LT',
                threshold: 0
            };
            this.allNotifiers();
            console.log('Notifiers: ' + this.$scope.notifiers);
        }

        toggleQuickAlert():void {
            this.$scope.showQuickAlert = !this.$scope.showQuickAlert;
        }

        private allNotifiers():void {
            this.$scope.notifiers = [];
            this.HawkularAlert.Notifier.query(
                (result) => {
                    this.$scope.notifiers = result;
                }, (error) => {
                    if (error.data.errorMsg) {
                        toastr.error(error.data.errorMsg);
                    } else {
                        toastr.error('Error loading Alerts Notifiers: ' + error);
                    }
                }
            );
        }

        saveQuickAlert():void {
            if (sharedMetricId !== '.status.duration' && sharedMetricId !== '.status.code') {
                var newTrigger:any = {};
                newTrigger.id = sharedMetricId + 'ResponseTime' + '-' + this.$scope.quickTrigger.operator + '-' + this.$scope.quickTrigger.threshold;
                newTrigger.name = newTrigger.id;
                newTrigger.description = 'Created on ' + new Date();
                newTrigger.match = 'ALL';
                newTrigger.enabled = true;
                newTrigger.notifiers = this.$scope.quickTrigger.notifiers;

                var newDampening:any = { triggerId: newTrigger.id,
                    type: 'RELAXED_COUNT',
                    evalTrueSetting: 1,
                    evalTotalSetting: 1,
                    evalTimeSetting: 0
                };

                this.HawkularAlert.Trigger.save(newTrigger,
                    (trigger) => {
                        newDampening.triggerId = trigger.id;
                        this.HawkularAlert.Dampening.save(newDampening,
                            (dampening) => {
                                var newThresholdCondition = {
                                    triggerId: newDampening.triggerId,
                                    dataId: sharedMetricId,
                                    conditionSetSize: 1,
                                    conditionSetIndex: 1,
                                    operator: this.$scope.quickTrigger.operator,
                                    threshold: this.$scope.quickTrigger.threshold
                                };
                                this.HawkularAlert['ThresholdCondition'].save(newThresholdCondition,
                                    () => {
                                        this.HawkularAlert.Alert.reload(
                                            (errorReload) => {
                                                if (errorReload.data.errorMsg) {
                                                    toastr.error(errorReload.data.errorMsg);
                                                } else {
                                                    toastr.error('Error reloading alerts' + errorReload);
                                                }
                                            });
                                        this.toggleQuickAlert();
                                    },
                                    (errorCondition) => {
                                        if (errorCondition.data.errorMsg) {
                                            toastr.error(errorCondition.data.errorMsg);
                                        } else {
                                            toastr.error('Error loading Saving Trigger Condition' + errorCondition);
                                        }
                                    });
                            }, (errorDampening) => {
                                if (errorDampening.data.errorMsg) {
                                    toastr.error(errorDampening.data.errorMsg);
                                } else {
                                    toastr.error('Error loading Saving Trigger Dampening ' + errorDampening);
                                }
                            }
                        );
                    }, (error) => {
                        if (error.data.errorMsg) {
                            toastr.error(error.data.errorMsg);
                        } else {
                            toastr.error('Error loading Saving Trigger ' + error);
                        }
                    }
                );
            } else {
                toastr.warning('No metric selected');
            }

        }

    }

    _module.controller('QuickAlertController', QuickAlertController);


}
