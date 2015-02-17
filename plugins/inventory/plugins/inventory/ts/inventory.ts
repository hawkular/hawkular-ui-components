/// <reference path="inventoryPlugin.ts"/>
module Inventory {

  export var InventoryController = _module.controller("Inventory.InventoryController", ['$scope', '$rootScope', 'HawkularInventory', ($scope, $rootScope, hkInventory) => {

      $scope.queryResources = function() {
        if(this.tenantId) {
            this.resources = hkInventory.Resource.query({tenantId: this.tenantId, type: 'URL'}, function(data) {
                angular.forEach(data, function(value) {
                    value.metrics = hkInventory.Metric.query({tenantId: $scope.tenantId, resourceId: value.id});
                });
            });
        }
      }

      $scope.queryMetrics = function() {
        if(this.tenantId && this.resourceId) {
            this.metrics = hkInventory.Metric.query({tenantId: this.tenantId, resourceId: this.resourceId});
        }
      }

      $scope.showMetric = function(tenantId, resourceId, metricId) {
        var _tenantId = tenantId || this.tenantId;
        var _resourceId = resourceId || this.resourceId;
        var _metricId = metricId || this.metricId;
        if(_tenantId && _resourceId && _metricId) {
            $rootScope.metricData = hkInventory.Metric.query({tenantId: _tenantId, resourceId: _resourceId, metricId: _metricId});
            $rootScope.metricData.tenantId = _tenantId;
            $rootScope.metricData.resourceId = _resourceId;
            $rootScope.metricData.metricId = _metricId;
        }
      }

      $scope.closeChart = function() {
        delete $rootScope.metricData;
      }

  }]);

}
