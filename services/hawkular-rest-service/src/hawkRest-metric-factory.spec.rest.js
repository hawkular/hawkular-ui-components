describe('Provider: Hawkular live REST', function() {

  var HawkularMetric;
  var httpReal;

  beforeEach(module('hawkular.rest', 'httpReal'));

  beforeEach(inject(function(_HawkularMetric_, _httpReal_) {
    HawkularMetric = _HawkularMetric_;
    httpReal = _httpReal_;
  }));

  describe('Tenants: ', function() {

    describe('creating a tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var tenant = {
          id: 'com.acme.sk',
          retentions: {
            numeric: 300,
            availability: 80
          }
        };

        result = HawkularMetric.Tenant.save(tenant);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        result = HawkularMetric.Tenant.query();
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get previously created tenant only', function() {
        expect(result.$resolved).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe('com.acme.sk');
      });
    });

    describe('creating another tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var tenant = {
          id: 'com.acme.sk2',
          retentions: {
            numeric: 300,
            availability: 80
          }
        };

        result = HawkularMetric.Tenant.save(tenant);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        result = HawkularMetric.Tenant.query();
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get two previously created tenants', function() {
        expect(result.$resolved).toBe(true);
        expect(result.length).toBe(2);
      });
    });
  });

  describe('Metrics: ', function() {

    /*
     Numeric
     */

    describe('creating a numeric metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var metric = {
          "name": "mymetric",
          "tags": {
            "attribute1": "value1",
            "attribute2": "value2"
          }
        };

        result = HawkularMetric.NumericMetric.save({ tenantId: 'com.acme.sk' }, metric);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a numeric metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        result = HawkularMetric.Metric.queryNum({ tenantId: 'com.acme.sk' });
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get previously created tenant only', function() {
        expect(result.$resolved).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].name).toBe('mymetric');
      });
    });

    describe('creating a numeric data for single metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {"timestamp": 1416857688195, "value": 2.1},
          {"timestamp": 1436857688195, "value": 2.2},
          {"timestamp": 1456857688195, "value": 2.3}
        ];

        result = HawkularMetric.NumericMetricData.save({ tenantId: 'com.acme.sk', numericId: 'mymetric' }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('updating a numeric meta for single metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = {
          "attr1": "value 1",
          "attr2": "value 2"
        };

        result = HawkularMetric.NumericMetricMeta.update({ tenantId: 'com.acme.sk', numericId: 'mymetric' }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('creating data for multiple numeric metrics', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {
            "name": "appsrv1.request_time",
            "data": [
              {"timestamp": 1416857688195, "value": 2.1},
              {"timestamp": 1436857688195, "value": 2.2}
            ]
          },
          {
            "name": "appsrv1.response_time",
            "data": [
              {"timestamp": 1416857688195, "value": 2.1},
              {"timestamp": 1436857688195, "value": 2.2}
            ]
          }
        ];

        result = HawkularMetric.NumericMetricMultiple.save({ tenantId: 'com.acme.sk' }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    /*
     Availability
     */

    describe('creating a availability metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var metric = {
          "name": "myavail",
          "tags": {
            "attribute1": "value1",
            "attribute2": "value2"
          }
        };

        result = HawkularMetric.AvailabilityMetric.save({ tenantId: 'com.acme.sk' }, metric);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a availability metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        result = HawkularMetric.Metric.queryAvail({ tenantId: 'com.acme.sk' });
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get previously saved metric only', function() {
        expect(result.$resolved).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].name).toBe('myavail');
      });
    });

    describe('creating a availability data for single metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {"timestamp": 1416857688195, "value": "down"},
          {"timestamp": 1416857688195, "value": "up"}
        ];

        result = HawkularMetric.AvailabilityMetricData.save({ tenantId: 'com.acme.sk', availabilityId: 'myavail' }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('creating data for multiple availability metrics', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {
            "name": "appsrv1",
            "data": [
              {"timestamp": 1416857688195, "value": "up"},
              {"timestamp": 1436857688195, "value": "up"}
            ]
          },
          {
            "name": "appsrv2",
            "data": [
              {"timestamp": 1416857688195, "value": "down"},
              {"timestamp": 1436857688195, "value": "up"}
            ]
          }
        ];

        result = HawkularMetric.AvailabilityMetricMultiple.save({ tenantId: 'com.acme.sk' }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });
});
