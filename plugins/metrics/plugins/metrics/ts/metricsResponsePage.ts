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
    start?: number;
    end?: number;
    value: number;
    avg: number;
    empty: boolean;
  }

  export interface IChartDataPoint extends IContextChartDataPoint {
    date: Date;
    min: number;
    max: number;
    percentile95th: number;
    median: number;
  }


  /**
   * @ngdoc controller
   * @name ChartController
   * @description This controller is responsible for handling activity related to the Chart tab.
   * @param $scope
   * @param $rootScope for publishing $broadcast events only
   * @param $interval
   * @param $log
   * @param HawkularMetric
   * @param HawkularInventory
   */
  export class MetricsViewController {
    /// for minification only
    public static  $inject = ['$scope', '$rootScope', '$interval', '$log', 'HawkularMetric', 'HawkularInventory', '$routeParams'];

    constructor(private $scope:any,
                private $rootScope:ng.IRootScopeService,
                private $interval:ng.IIntervalService,
                private $log:ng.ILogService,
                private HawkularMetric:any,
                private HawkularInventory:any,
                private $routeParams:any,
                public startTimeStamp:Date,
                public endTimeStamp:Date) {
      $scope.vm = this;

      this.startTimeStamp = moment().subtract(1, 'hours').toDate();
      this.endTimeStamp = new Date();

      $scope.$on('RefreshChart', (event) => {
        this.refreshChartDataNow(this.getMetricId());
      });



      $scope.$watch('vm.selectedResource', (resource) => {
        if (resource) {
          /// made a selection from url switcher
          globalMetricId = resource.id;
          this.refreshChartDataNow(this.getMetricId());
        } else {
          /// case when coming from addUrl screen
          globalResourceList = this.HawkularInventory.Resource.query({tenantId: globalTenantId}).$promise.
            then((resources)=> {
              this.resourceList = resources;
              this.selectedResource = _.last(resources);
              this.refreshChartDataNow(this.getMetricId());
            });
        }

      });




      this.onCreate($routeParams.resourceId);
    }

    private bucketedDataPoints:IChartDataPoint[] = [];
    private contextDataPoints:IChartDataPoint[] = [];
    private chartData:any;
    private autoRefreshPromise:ng.IPromise<number>;
    private _resourceList = [];
    selectedResource;

    median = 0;
    percentile95th = 0;
    average = 0;


    public get resourceList():string[] {
      return this._resourceList;
    }

    public set resourceList(newResourceList:string[]) {
      globalResourceList = newResourceList;
      this._resourceList = newResourceList;
    }

    private onCreate(curResourceId:string) {
      /// setup autorefresh for every minute
      this.autoRefresh(60);
      this.HawkularInventory.Resource.query({tenantId: globalTenantId}, (aResourceList) => {
        this.resourceList = aResourceList;
        this.selectedResource = _.last(this._resourceList);
        for (var i = 0; i < this._resourceList.length; i++) {
          if (aResourceList[i].id === curResourceId) {
            this.selectedResource = this._resourceList[i];
          }
        }
        this.refreshChartDataNow(this.getMetricId());
      });
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


    refreshChartDataNow(metricId:string, startTime?:Date):void {
      var adjStartTimeStamp:Date = moment().subtract('hours', 1).toDate(); //default time period set to 24 hours
      this.endTimeStamp = new Date();
      this.refreshHistoricalChartData(metricId, angular.isUndefined(startTime) ? adjStartTimeStamp : startTime, this.endTimeStamp);
    }

    refreshHistoricalChartData(metricId:string, startDate:Date, endDate:Date):void {
      this.refreshHistoricalChartDataForTimestamp(metricId, startDate.getTime(), endDate.getTime());
    }

    getMetricId():string {
      return MetricsViewController.getResourceDurationMetricId();
    }

    private static getResourceDurationMetricId() {
      return globalMetricId + '.status.duration';
    }


    refreshHistoricalChartDataForTimestamp(metricId:string, startTime?:number, endTime?:number):void {
      // calling refreshChartData without params use the model values
      if (!endTime) {
        endTime = this.endTimeStamp.getTime();
      }
      if (!startTime) {
        startTime = this.startTimeStamp.getTime();
      }

      if (metricId) {
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

            this.median = Math.round(_.last(this.bucketedDataPoints).median);
            this.percentile95th = Math.round(_.last(this.bucketedDataPoints).percentile95th);
            this.average = Math.round(_.last(this.bucketedDataPoints).avg);

            if (this.bucketedDataPoints.length) {
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
            this.$log.error('Error Loading Chart data');
            toastr.error('Error Loading Chart Data: ' + error);
          });

      }
    }

    private formatBucketedChartOutput(response):IChartDataPoint[] {
      //  The schema is different for bucketed output
      return _.map(response, (point:IChartDataPoint) => {
        return {
          timestamp: point.start,
          date: new Date(point.start),
          value: !angular.isNumber(point.value) ? 0 : point.value,
          avg: (point.empty) ? 0 : point.avg,
          min: !angular.isNumber(point.min) ? 0 : point.min,
          max: !angular.isNumber(point.max) ? 0 : point.max,
          percentile95th: !angular.isNumber(point.percentile95th) ? 0 : point.percentile95th,
          median: !angular.isNumber(point.median) ? 0 : point.median,
          empty: point.empty
        };
      });
    }

  }

  _module.controller('MetricsViewController', MetricsViewController);


}
