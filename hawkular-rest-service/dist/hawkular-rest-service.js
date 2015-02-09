/// <reference path="../bower_components/dt-angular/angular.d.ts" />
var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module = angular.module('hawkular.rest', ['ngResource']);
})(hawkularRest || (hawkularRest = {}));

/**
 * @ngdoc provider
 * @name hawkular.rest.HawkularInventory
 * @description
 * # HawkularInventory
 * Provider in the hawkular.rest.
 */
var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module.provider('HawkularInventory', function () {
        // time (in ms) the notifications are shown
        this.host = 'localhost';
        this.port = 8080;
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', function ($resource) {
            var prefix = 'http://' + this.host + ':' + this.port;
            var factory = {};
            factory['Resource'] = $resource(prefix + '/hawkular/inventory/:tenantId/resources/:resourceId', {
                tenantId: '@tenantId',
                resourceId: '@resourceId'
            });
            factory['Metric'] = $resource(prefix + '/hawkular/inventory/:tenantId/resources/:resourceId/metric/:metricId', {
                tenantId: '@tenantId',
                resourceId: '@resourceId',
                metricId: '@metricId'
            });
            return factory;
        }];
    });
})(hawkularRest || (hawkularRest = {}));

/**
 * @ngdoc provider
 * @name hawkular.rest.HawkularMetric
 * @description
 * # HawkularRest
 * Provider in the hawkular.rest.
 */
var hawkularRest;
(function (hawkularRest) {
    hawkularRest._module.provider('HawkularMetric', function () {
        // time (in ms) the notifications are shown
        this.host = 'localhost';
        this.port = 8080;
        this.setHost = function (host) {
            this.host = host;
            return this;
        };
        this.setPort = function (port) {
            this.port = port;
            return this;
        };
        this.$get = ['$resource', function ($resource) {
            var prefix = 'http://' + this.host + ':' + this.port;
            var factory = {};
            factory['Tenant'] = $resource(prefix + '/rhq-metrics/tenants', {});
            factory['Metric'] = $resource(prefix + '/rhq-metrics/:tenantId/metrics', {
                tenantId: '@tenantId'
            }, {
                queryNum: {
                    method: 'GET',
                    isArray: true,
                    params: { type: 'num' }
                },
                queryAvail: {
                    method: 'GET',
                    isArray: true,
                    params: { type: 'avail' }
                },
                queryLog: {
                    method: 'GET',
                    isArray: true,
                    params: { type: 'log' }
                }
            });
            factory['NumericMetric'] = $resource(prefix + '/rhq-metrics/:tenantId/metrics/numeric', {
                tenantId: '@tenantId'
            });
            factory['NumericMetricData'] = $resource(prefix + '/rhq-metrics/:tenantId/metrics/numeric/:numericId/data', {
                tenantId: '@tenantId',
                numericId: '@numericId'
            });
            factory['NumericMetricMeta'] = $resource(prefix + '/rhq-metrics/:tenantId/metrics/numeric/:numericId/meta', {
                tenantId: '@tenantId',
                numericId: '@numericId'
            }, {
                update: 'PUT'
            });
            factory['NumericMetricMultiple'] = $resource(prefix + '/rhq-metrics/:tenantId/metrics/numeric/data', {
                tenantId: '@tenantId',
                numericId: '@numericId'
            });
            factory['AvailabilityMetric'] = $resource(prefix + '/rhq-metrics/:tenantId/metrics/availability', {
                tenantId: '@tenantId'
            });
            factory['AvailabilityMetricData'] = $resource(prefix + '/rhq-metrics/:tenantId/metrics/availability/:availabilityId/data', {
                tenantId: '@tenantId',
                availabilityId: '@availabilityId'
            });
            factory['AvailabilityMetricMultiple'] = $resource(prefix + '/rhq-metrics/:tenantId/metrics/availability/data', {
                tenantId: '@tenantId'
            });
            return factory;
        }];
    });
})(hawkularRest || (hawkularRest = {}));
