/**
 * @ngdoc provider
 * @name hawkular.rest.HawkularMetric
 * @description
 * # HawkularRest
 * Provider in the hawkular.rest.
 */

module hawkularRest {

  _module.provider('HawkularMetric', function() {
    // time (in ms) the notifications are shown

    this.host = 'localhost';
    this.port = 8080;

    this.setHost = function(host){
      this.host = host;
      return this;
    };

    this.setPort = function(port){
      this.port = port;
      return this;
    };

    this.$get = ['$resource', function($resource) {

      var prefix = 'http://' + this.host + ':' + this.port;
      var factory = {};

      factory['Tenant'] = $resource(prefix + '/hawkular-metrics/tenants', {});

      factory['Metric'] = $resource(prefix + '/hawkular-metrics/:tenantId/metrics', {
        tenantId : '@tenantId'
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

      factory['NumericMetric'] = $resource(prefix + '/hawkular-metrics/:tenantId/metrics/numeric', {
        tenantId : '@tenantId'
      });

      factory['NumericMetricData'] = $resource(prefix + '/hawkular-metrics/:tenantId/metrics/numeric/:numericId/data', {
        tenantId : '@tenantId',
        numericId : '@numericId'
      });

      factory['NumericMetricMeta'] = $resource(prefix + '/hawkular-metrics/:tenantId/metrics/numeric/:numericId/meta', {
        tenantId : '@tenantId',
        numericId : '@numericId'
      }, {
        update: 'PUT'
      });

      factory['NumericMetricMultiple'] = $resource(prefix + '/hawkular-metrics/:tenantId/metrics/numeric/data', {
        tenantId : '@tenantId',
        numericId : '@numericId'
      });

      factory['AvailabilityMetric'] = $resource(prefix + '/hawkular-metrics/:tenantId/metrics/availability', {
        tenantId : '@tenantId'
      });

      factory['AvailabilityMetricData'] = $resource(prefix + '/hawkular-metrics/:tenantId/metrics/availability/:availabilityId/data', {
        tenantId : '@tenantId',
        availabilityId : '@availabilityId'
      });

      factory['AvailabilityMetricMultiple'] = $resource(prefix + '/hawkular-metrics/:tenantId/metrics/availability/data', {
        tenantId : '@tenantId'
      });

      return factory;
    }];

  });
}
