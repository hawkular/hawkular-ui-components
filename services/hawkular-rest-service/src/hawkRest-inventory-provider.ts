/**
 * @ngdoc provider
 * @name hawkular.rest.HawkularInventory
 * @description
 * # HawkularInventory
 * Provider in the hawkular.rest.
 */

module hawkularRest {

  _module.provider('HawkularInventory', function() {
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

      factory['Resource'] = $resource(prefix + '/hawkular/inventory/:tenantId/resources/:resourceId', {
          tenantId : '@tenantId',
          resourceId : '@resourceId'
      });

      factory['Metric'] = $resource(prefix + '/hawkular/inventory/:tenantId/resources/:resourceId/metric/:metricId', {
        tenantId : '@tenantId',
        resourceId: '@resourceId',
        metricId: '@metricId'
      });

      return factory;
    }];

  });
}
