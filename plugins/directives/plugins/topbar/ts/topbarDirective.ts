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

/// <reference path="topbarPlugin.ts"/>
module Topbar {

  var log:Logging.Logger = Logger.get("Topbar");

  export class TopbarDirective {

    public restrict = 'E';
    public transclude = false;
    public replace = false;

    public templateUrl = templatePath;
  }

  export var TopbarController = _module.controller("Topbar.TopbarController",
    ['$scope', '$rootScope', '$location', '$routeParams', 'DataResource', 'DataRange', 'HawkularInventory', ($scope, $rootScope, $location, $routeParams, DataResource, DataRange, HawkularInventory) => {

    $scope.range = 'week';

    $scope.getDate = function() {
      $scope.rangeDates = DataRange.getFormattedTimeRange();
    };

    $scope.setRange = function(range) {
      DataRange.setCustomRange(range);
      $scope.getDate();
      $scope.range = Object.keys(range)[0];
    };

    $scope.rangeNames = {
      'hour': 'Last Hour',
      'hours': 'Last 12 Hours',
      'day': 'Last Day',
      'week': 'Last Week',
      'month': 'Last Month',
      'year': 'Last Year'
    };

    $scope.updateResources = function() {
      DataResource.updateResources();
    };

    $scope.$watch(function() { return $location.path(); }, function(value) {
      $rootScope.hideSidebar = ($location.path().indexOf('/metrics/addUrl') === 0);
    });

    $scope.$watch(function() { return $routeParams.resourceId; }, function(value) {
      if (value) {
        $scope.selectedResource = HawkularInventory.Resource.get({tenantId: globalTenantId, resourceId: value});
      }
    });

    $scope.setSelection = function(resourceId) {
      $location.path($location.path().replace($routeParams.resourceId, resourceId.id));
    };

    /// Initialize
    $scope.updateResources();

  }]);
}
