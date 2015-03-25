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

  export class MetricsAvailabilityController {
    /// for minification only
    public static  $inject = ['$scope', '$interval', '$log', 'HawkularMetric', '$routeParams'];

    constructor(private $scope:any,
                private $interval:ng.IIntervalService,
                private $log:ng.ILogService,
                private HawkularMetric:any,
                private $routeParams:any,
                public startTimeStamp:Date,
                public endTimeStamp:Date) {
      $scope.vm = this;

      this.startTimeStamp = moment().subtract(1, 'hours').toDate();
      this.endTimeStamp = new Date();

      $scope.$on('RefreshAvailabilityChart', (event) => {
        this.refreshAvailChartDataNow(this.getMetricId());
      });

      this.onCreate($routeParams.resourceId);
    }

    private availabilityDataPoints:any[] = [];
    private chartData:any;
    private autoRefreshPromise:ng.IPromise<number>;
    selectedResource;

    availabilityPercent = 0;
    downTimeDuration = 0;
    lastDownTime:Date;
    downTimeEvents = 0;


    private onCreate(curResourceId:string) {
      /// setup autorefresh for every minute
      this.autoRefreshAvailability(20);
    }


    cancelAutoRefresh():void {
      this.$interval.cancel(this.autoRefreshPromise);
      toastr.info('Canceling Auto Refresh Availability');
    }

    autoRefreshAvailability(intervalInSeconds:number):void {
      this.refreshHistoricalAvailDataForTimestamp(this.getMetricId());
      this.autoRefreshPromise = this.$interval(()  => {
        this.endTimeStamp = new Date();
        this.refreshHistoricalAvailDataForTimestamp(this.getMetricId());
      }, intervalInSeconds * 1000);

      this.$scope.$on('$destroy', () => {
        this.$interval.cancel(this.autoRefreshPromise);
      });
    }

    private noDataFoundForId(id:string):void {
      this.$log.warn('No Data found for id: ' + id);
      ///toastr.warning('No Data found for id: ' + id);
    }


    refreshAvailChartDataNow(metricId:string, startTime?:Date):void {
      var adjStartTimeStamp:Date = moment().subtract('hours', 1).toDate(); //default time period set to 24 hours
      this.endTimeStamp = new Date();
      this.refreshHistoricalChartData(metricId, angular.isUndefined(startTime) ? adjStartTimeStamp : startTime, this.endTimeStamp);
    }

    refreshHistoricalChartData(metricId:string, startDate:Date, endDate:Date):void {
      this.refreshHistoricalAvailDataForTimestamp(metricId, startDate.getTime(), endDate.getTime());
    }

    getMetricId():string {
      return MetricsAvailabilityController.getResourceCodeMetricId();
    }

    private static getResourceCodeMetricId() {
      return globalMetricId + '.status.code';
    }


    refreshHistoricalAvailDataForTimestamp(metricId:string, startTime?:number, endTime?:number):void {
      // calling refreshChartData without params use the model values
      if (!endTime) {
        endTime = this.endTimeStamp.getTime();
      }
      if (!startTime) {
        startTime = this.startTimeStamp.getTime();
      }

      if (metricId) {
        this.HawkularMetric.AvailabilityMetricData.query({
          tenantId: globalTenantId,
          availabilityId: metricId
        }).$promise
          .then((response) => {

            // we want to isolate the response from the data we are feeding to the chart
            this.availabilityDataPoints = this.formatAvailability(response);
            console.info("Availability: ");
            console.dir(this.availabilityDataPoints);

            //this.totalDowntime = Math.round(_.last(this.bucketedDataPoints).median);
            //@todo: get rid of these fake values
            this.availabilityPercent = .95;
            this.downTimeDuration = 44;
            this.lastDownTime = moment().subtract('hours', 2).toDate();
            this.downTimeEvents = 2;

            if (this.availabilityDataPoints.length) {
              // this is basically the DTO for the chart
              this.chartData = {
                id: metricId,
                startTimeStamp: this.startTimeStamp,
                endTimeStamp: this.endTimeStamp,
                dataPoints: this.availabilityDataPoints,
                annotationDataPoints: []
              };

            } else {
              this.noDataFoundForId(this.getMetricId());
            }

          }, (error) => {
            this.$log.error('Error Loading Avail data');
            toastr.error('Error Loading Avail Data: ' + error);
          });

      }
    }

    private formatAvailability(response):any[] {
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

  _module.controller('MetricsAvailabilityController', MetricsAvailabilityController);


}
