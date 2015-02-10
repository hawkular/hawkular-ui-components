describe('Factory: hawkMetric', function() {

  var hawkMetric,
      $httpBackend,
      prefix = 'http://localhost:8080';

  beforeEach(module('hawkular.rest'));

  beforeEach(inject(function(_HawkularRest_, _$httpBackend_) {
    HawkularRest = _HawkularRest_;
    $httpBackend = _$httpBackend_;
  }));

  it('should create a tenant', function() {
    var tenantId = 'myTenantId';

    $httpBackend.expectPOST(prefix + '/rhq-metrics/tenants')
      .respond(200);
    var result = HawkularRest.Tenant.create({tenantId: tenantId});

    $httpBackend.flush();

    expect(result.$resolved).toBe(true);
  });

  it('should create a metric', function() {
    var tenantId = 'myTenantId';

    $httpBackend.expectGET(prefix + '/rhq-metrics/' + tenantId + '/metrics')
      .respond([{
        name: 'mock.metric',
        metadata: {
          units: 'bytes',
          env: 'test'
        },
        dataRetention: 96
      }]);
    var result = HawkularRest.Metric.query({tenantId: tenantId});

    $httpBackend.flush();

    expect(result[0].name).toEqual('mock.metric');
  });

});
