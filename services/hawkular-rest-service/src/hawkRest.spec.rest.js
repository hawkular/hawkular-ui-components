// Module needed for the test-suite to be able to do actual (non-mock) REST calls
angular.module('httpReal', ['ng'])
  .config(['$provide', function($provide) {
    $provide.decorator('$httpBackend', function() {
      return angular.injector(['ng']).get('$httpBackend');
    });
  }])
  .service('httpReal', ['$rootScope', function($rootScope) {
    this.submit = function() {
      $rootScope.$digest();
    };
  }]);

var TIMEOUT = 30000;

var errorFn = function(error){
  var msg = 'ngResource error: ' + (error && error.data && error.data.errorMsg ? error.data.errorMsg : JSON.stringify(error));
  return(msg);
};
