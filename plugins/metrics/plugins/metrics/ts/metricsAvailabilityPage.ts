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


  export interface IAvailabilitySummary {
    start: number;
    end: number;
    downtimeDuration: number;
    lastDowntime:number;
    uptimeRatio: number;
    downtimeCount:number;
    empty:boolean;
  }


  export class MetricsAvailabilityController {
    /// for minification only
    public static  $inject = ['$scope', '$interval', '$log', 'HawkularMetric', '$routeParams'];

    constructor(private $scope:any,
                private $interval:ng.IIntervalService,
                private $log:ng.ILogService,
                private HawkularMetric:any,
                private $routeParams:any,
                public startTimeStamp:number,
                public endTimeStamp:number) {
      $scope.vm = this;

      this.startTimeStamp = +moment().subtract(1, 'hours');
      this.endTimeStamp = +moment();

      this.metricId = $scope.hkParams.resourceId;

      $scope.$watch('hkParams.resourceId', (resourceId) => {
        /// made a selection from url switcher
        if (resourceId) {
          this.metricId = resourceId;
          this.refreshAvailPageNow(this.getRawMetricId());
        }
      });

      $scope.$on('RefreshAvailabilityChart', (event) => {
        this.refreshAvailPageNow(this.getRawMetricId());
      });

      this.autoRefreshAvailability(20);
    }

    private availabilityDataPoints:IChartDataPoint[] = [];
    private autoRefreshPromise:ng.IPromise<number>;
    private metricId;

    uptimeRatio = 0;
    downtimeDuration = 0;
    lastDowntime:Date;
    downtimeCount = 0;
    empty = true;

    refreshAvailPageNow(rawMetricId:string, startTime?:number):void {
      this.$scope.hkEndTimestamp = +moment();
      var adjStartTimeStamp:number = +moment().subtract(this.$scope.hkParams.timeOffset, 'milliseconds');
      this.endTimeStamp = this.$scope.hkEndTimestamp;
      if (rawMetricId) {
        this.refreshSummaryAvailabilityData(rawMetricId, startTime ? adjStartTimeStamp : startTime, this.endTimeStamp);
        this.refreshAvailDataForTimestamp(rawMetricId, startTime ? adjStartTimeStamp : startTime, this.endTimeStamp);
      }
    }

    cancelAutoRefresh():void {
      this.$interval.cancel(this.autoRefreshPromise);
      toastr.info('Canceling Auto Refresh Availability');
    }

    autoRefreshAvailability(intervalInSeconds:number):void {
      this.endTimeStamp = this.$scope.hkEndTimestamp;
      this.startTimeStamp = this.$scope.hkStartTimestamp;
      this.$log.debug("first time through Availability page raw metricId is: " + this.getRawMetricId());
      this.refreshAvailPageNow(this.getRawMetricId());
      this.autoRefreshPromise = this.$interval(()  => {
        console.info('Autorefresh Availabilty for: ' + this.getRawMetricId());
        this.$scope.hkEndTimestamp = +moment();
        this.endTimeStamp = this.$scope.hkEndTimestamp;
        this.$scope.hkStartTimestamp = +moment().subtract(this.$scope.hkParams.timeOffset, 'milliseconds');
        this.startTimeStamp = this.$scope.hkStartTimestamp;
        this.refreshAvailPageNow(this.getRawMetricId());
      }, intervalInSeconds * 1000);

      this.$scope.$on('$destroy', () => {
        this.$interval.cancel(this.autoRefreshPromise);
      });
    }

    private noDataFoundForId(id:string):void {
      this.$log.warn('No Data found for id: ' + id);
      ///toastr.warning('No Data found for id: ' + id);
    }

    refreshSummaryAvailabilityData(metricId:string, startTime:number, endTime:number):void {

      if (metricId) {
        this.HawkularMetric.AvailabilityMetricData.query({
          tenantId: globalTenantId,
          availabilityId: metricId,
          start: startTime,
          end: endTime,
          buckets: 1
        }).$promise
          .then((availResponse:IAvailabilitySummary[]) => {
            console.info("Avail Summary:");
            console.dir(availResponse);

            if (availResponse && !_.last(availResponse).empty) {

              this.uptimeRatio = Math.round(_.last(availResponse).uptimeRatio);
              this.downtimeDuration = Math.round(_.last(availResponse).downtimeDuration);
              this.lastDowntime = new Date(_.last(availResponse).lastDowntime);
              this.downtimeCount = _.last(availResponse).downtimeCount;
              this.empty = _.last(availResponse).empty;
            }

          }, (error) => {
            this.$log.error('Error Loading Avail Summary data');
            toastr.error('Error Loading Avail Summary Data: ' + error);
          });

      }
    }


    getRawMetricId():string {
      return this.metricId;
    }


    refreshAvailDataForTimestamp(metricId:string, startTime:number, endTime:number):void {

      if (metricId) {
        this.HawkularMetric.AvailabilityMetricData.query({
          tenantId: globalTenantId,
          availabilityId: metricId,
          start: startTime,
          end: endTime,
          buckets: 60
        }).$promise
          .then((response) => {

            console.info("Availability Data: ");
            console.dir(response);

            if (this.availabilityDataPoints.length) {
              this.availabilityDataPoints = response;

            } else {
              this.noDataFoundForId(this.getRawMetricId());
            }

          }, (error) => {
            this.$log.error('Error Loading Avail data');
            toastr.error('Error Loading Avail Data: ' + error);
          });

      }
    }

  }

  _module.controller('MetricsAvailabilityController', MetricsAvailabilityController);


}
