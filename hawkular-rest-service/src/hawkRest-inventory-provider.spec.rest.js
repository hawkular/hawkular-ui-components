describe('Provider: Hawkular live REST', function() {

  var HawkularInventory;
  var res;
  var httpReal;
  var $http;

  beforeEach(module('hawkular.rest', 'httpReal'));

  beforeEach(inject(function(_HawkularInventory_, _$resource_, _httpReal_, _$http_) {
    HawkularInventory = _HawkularInventory_;
    res = _$resource_;
    httpReal = _httpReal_;
    $http = _$http_;
  }));

  describe('Resources: ', function() {

    describe('creating a resource', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {
        var resource = {
          type: 'URL',
          id: 'x1422733176502',
          parameters: {
            url: 'http://hawkular.org'
          }
        };

        result = HawkularInventory.Resource.save(resource);
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
