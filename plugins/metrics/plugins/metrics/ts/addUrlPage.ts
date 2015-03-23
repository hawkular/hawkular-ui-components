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

module HawkularMetrics {


  export class AddUrlController {
    /// this is for minification purposes
    public static $inject = ['$location', '$scope', '$rootScope', '$log', '$filter', 'HawkularInventory', 'HawkularMetric', 'HawkularAlert', 'DataResource', 'HawkularAlertsManager'];

    private httpUriPart = 'http://';
    public addProgress: boolean = false;
    private resourceList;

    constructor(private $location:ng.ILocationService,
                private $scope:any,
                private $rootScope:ng.IRootScopeService,
                private $log:ng.ILogService,
                private $filter:ng.IFilterService,
                private HawkularInventory:any,
                private HawkularMetric:any,
                private HawkularAlert:any,
                private DataResource:any,
                private HawkularAlertsManager: HawkularMetrics.IHawkularAlertsManager,
                public resourceUrl:string) {
      $scope.vm = this;
      this.resourceUrl = this.httpUriPart;
      this.resourceList = this.getResourceList();
    }

    addUrl(url:string):void {
      this.addProgress = true;

      var resource = {
        type: 'URL',
        id: '',
        parameters: {
          url: url
        }
      };

      this.$log.info('Adding new Resource Url to Hawkular-inventory: ' + url);

      globalChartTimeRange = new ChartTimeRange(1);
      var globalMetricId: string;

      /// Add the Resource
      this.HawkularInventory.Resource.save({tenantId: globalTenantId}, resource).$promise
        .then((newResource) => {
          this.DataResource.updateResources();
          // we now have a resourceId from this call
          globalMetricId = newResource.id;
          globalResourceUrl = resource.parameters.url;
          console.dir(newResource);
          this.$log.info('New Resource ID: ' + globalMetricId + ' created for url: ' + globalResourceUrl);
          var metrics = [{
            name: globalMetricId + '.status.duration',
            unit: 'MILLI_SECOND',
            description: 'Response Time in ms.'
          }, {
            name: globalMetricId + '.status.code',
            unit: 'NONE',
            description: 'Status Code'
          }];


          /// For right now we will just Register a couple of metrics automatically
          return this.HawkularInventory.Metric.save({
            tenantId: globalTenantId,
            resourceId: newResource.id
          }, metrics).$promise.then((newMetrics) => {
              // TODO: Add availability...
            });

        }).then(()=> {
          // Find if a default email exists
          return this.HawkularAlertsManager.addEmailAction('myemail@company.com');
        }).then(()=> {
          // Create threshold trigger for newly created metrics
          console.log('metric', globalMetricId);
          return this.HawkularAlertsManager.createTrigger(globalMetricId + '_trigger_thres', true, 'THRESHOLD', 'myemail@company.com');
        }).then((alert)=> {
          console.log('alert', alert);
          // Create availability trigger for newly created metrics
          return this.HawkularAlertsManager.createTrigger(globalMetricId + '_trigger_avail', false, 'AVAILABILITY', 'myemail@company.com');
        }).finally(()=> {
          this.addProgress = false;
          toastr.info('Your data is being collected. Please be patient (should be about another minute).');
          this.$location.url('/metrics/responseTime/' + globalMetricId);
        });
    }

    getResourceList():any {
      return this.HawkularInventory.Resource.query({tenantId: globalTenantId}, (aResourceList) => {
        this.resourceList = aResourceList;
        angular.forEach(this.resourceList, function(res, idx) {
          this.HawkularMetric.NumericMetricData.queryMetrics({
            tenantId: globalTenantId, resourceId: res.id, numericId: (res.id + '.status.duration'),
            start: moment().subtract(1, 'hour').valueOf(), end: moment().valueOf()}, (resource) => {
            // FIXME: Work data so it works for chart ?
            res['responseTime'] = resource;
          });
          this.HawkularMetric.NumericMetricData.queryMetrics({
            tenantId: globalTenantId, resourceId: res.id, numericId: (res.id + '.status.code'),
            start: moment().subtract(1, 'hour').valueOf(), end: moment().valueOf()}, (resource) => {
            // FIXME: Use availability instead..
            res['isUp'] = (resource[0].value >= 200 && resource[0].value < 300);
            var upTime = 0;
            for(var i = 0; i < resource.length; i++) {
              if(resource[i].value >= 200 && resource[i].value < 300) {
                upTime++;
              }
            }
            res['availability'] = upTime/resource.length * 100;
            res['downTime'] = resource.length - upTime;
          });
          this.HawkularAlert.Alert.query({ query: res.id, start: moment().subtract(1, 'hour').valueOf(),
            end: moment().valueOf()}, (alertsList) => {
            res['alerts'] = [];
            for(var i = 0; i < alertsList.length; i++) {
              if (alertsList[i].evalSets[0][0].condition.dataId.indexOf(res.id) === 0) {
                res['alerts'].push(alertsList[i].evalSets[0][0]);
              }
            }
          });
          res['updateTime'] = new Date();
        }, this);

      });
    }

    getAverage(data:any, field:string):number {
      if (data) {
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
          sum += parseInt(data[i][field], 10);
        }
        return Math.round(sum / data.length);
      }
    }

    deleteResource(resource:any):any {
      // TODO: use modal to confirm delete...
      this.HawkularInventory.Resource.delete({
        tenantId: globalTenantId,
        resourceId: resource.id
      }).$promise.then((res) => {
          toastr.info('The site ' + resource.parameters.url + ' is no longer being monitored.');
          this.resourceList = this.getResourceList();
        });
    }

  }

  _module.controller('HawkularMetrics.AddUrlController', AddUrlController);

}
