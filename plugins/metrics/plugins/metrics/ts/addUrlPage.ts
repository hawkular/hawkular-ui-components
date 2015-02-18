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

module HawkularMetrics {

    export class AddUrlController {
        public static $inject = ['$location', '$scope', '$log', 'HawkularMetric' ];

       ///@todo: fixed tenant until we get it from KeyCloak
        private tenantId = 'test';

        constructor(private $location:ng.ILocationService,
                    private $scope:any,
                    private $log:ng.ILogService,
                    private HawkularMetric:any,
                    public resourceUrl:string) {
            $scope.vm = this;
            this.resourceUrl = '';

        }

        addUrl(url:string):void {
            this.$log.debug("Adding Url to backend: " + url);
            this.registerFixedMetrics(this.tenantId);

            this.$log.debug("Current url: " + this.$location.url());

            /// Hop on over to the metricsView page for charting
            this.$location.url("/metrics/metricsView");

        }


        /// @todo: this will become the 'Metrics Selection' screen once we get that
        /// For right now we will just Register a couple of metrics automatically
        /// Later, this will become the metrics selection screen and the user can
        /// select metrics for the resource url
        registerFixedMetrics(tenantId:string):void {
            /// for now just register the two metrics

            var result:any;
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

            //@todo: ignoring error handling for now
            result = this.HawkularMetric.NumericMetric.save({tenantId: tenantId}, webResponseTimeMetric);
            this.$log.info("Created Metric: " + result);
            result = this.HawkularMetric.NumericMetric.save({tenantId: tenantId}, cpuUsageMetric);
            this.$log.info("Created Metric: " + result);

        }

    }

    _module.controller('HawkularMetrics.AddUrlController', AddUrlController);

}
