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
    public static $inject = ['$location', '$scope', '$rootScope', '$log', 'HawkularInventory', 'DataResource'];

    private httpUriPart = 'http://';

    constructor(private $location:ng.ILocationService,
                private $scope:any,
                private $rootScope:ng.IRootScopeService,
                private $log:ng.ILogService,
                private HawkularInventory:any,
                private DataResource:any,
                public resourceUrl:string) {
      $scope.vm = this;
      this.resourceUrl = this.httpUriPart;

    }

    addUrl(url:string):void {
      var resource = {
        type: 'URL',
        id: '',
        parameters: {
          url: url
        }
      };

      this.$log.info('Adding new Resource Url to Hawkular-inventory: ' + url);

      globalChartTimeRange = new ChartTimeRange(1);

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
          this.HawkularInventory.Metric.save({
            tenantId: globalTenantId,
            resourceId: newResource.id
          }, metrics).$promise.then((newMetrics) => {
              toastr.info('Your data is being collected. Please be patient (should be about another minute).');
              this.$location.url('/metrics/responseTime/' + newResource.id);
            });

        });


    }
  }

  _module.controller('HawkularMetrics.AddUrlController', AddUrlController);

}
