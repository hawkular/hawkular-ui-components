
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

    /**
     * NOTE: this class is Temporary and will go away soon and use ngResource version of REST api
     */
    export class MetricDataService {

        public static  $inject = ['$q', '$rootScope', '$http', '$log' ];

        constructor(private $q:ng.IQService, private $rootScope:ng.IRootScopeService, private $http:ng.IHttpService, private $log:ng.ILogService   ) {

        }

        getBaseUrl():string {
            /// @todo HARDCODED URL
            return 'http://127.0.0.1:8080/rhq-metrics/test/metrics';
        }

        getAllMetrics() {
            this.$log.info('-- Retrieving all metrics');
            var base = this.getBaseUrl() + '/?type=num',
                deferred = this.$q.defer();

            this.$http.get(base).success((data) => {
                deferred.resolve(data);
            }).error((reason, status) => {
                console.error('Error Retrieving all metrics :' + status + ", " + reason);
                toastr.warning('No Metrics retrieved.');
                deferred.reject(status + " - " + reason);
            });

            return deferred.promise;
        }


        getMetricsForTimeRange(id:string, startDate:Date, endDate:Date, buckets:number):ng.IPromise<any> {
            this.$log.info('-- Retrieving metrics data for id: ' + id);
            this.$log.info('-- Date Range: ' + startDate + ' - ' + endDate);
            var numBuckets = buckets || 60,
                deferred = this.$q.defer(),
                searchParams = {
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

            this.$http.get(this.getBaseUrl() + '/numeric/' + id + '/data', searchParams).success((data) => {
                deferred.resolve(data);
            }).error((reason, status) => {
                this.$log.error('Error Loading Chart Data:' + status + ", " + reason);
                deferred.reject(status + " - " + reason);
            });

            return deferred.promise;
        }

    }
    _module.service('metricDataService', MetricDataService);
}
