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

/// <reference path="../../includes.ts"/>
/// <reference path="topbarGlobals.ts"/>
module Topbar {

  export class DataRange {

    startTimestamp: number;
    endTimestamp: number;

    constructor() {
      /// defaults to last 7 days
      this.endTimestamp = moment().valueOf();
      this.startTimestamp = moment(this.endTimestamp).subtract({days: 7}).valueOf();
    }

    public setCustomRange(rangeValue: Object, customEndTimestamp: number) {
      this.endTimestamp = customEndTimestamp || moment().valueOf();
      this.startTimestamp = moment(this.endTimestamp).subtract(rangeValue).valueOf();
    }

    public getStartDate():Date {
      return new Date(this.startTimestamp);
    }

    public getEndDate():Date {
      return new Date(this.endTimestamp);
    }

    public getFormattedTimeRange():string {
      var diff = this.endTimestamp - this.startTimestamp;
      var momStart = moment(this.startTimestamp);
      var momEnd = moment(this.endTimestamp);

      if (diff < 24 * 60 * 60 * 1000) {
        return momStart.format('D MMM YYYY') + ' ' + momStart.format('HH:mm') + ' - ' + (momStart.day() !== momEnd.day() ? momEnd.format('D MMM YYYY ')  : '') + momEnd.format('HH:mm');
      } else {
        return momStart.format('D MMM YYYY') + ' - ' + momEnd.format('D MMM YYYY');
      }
    }
  }

  _module.service('DataRange', DataRange);

  export class HawkularNav {

    public static $inject = ['$rootScope', '$routeParams', 'HawkularInventory'];

    constructor(private $rootScope: any, private $routeParams: any, private HawkularInventory: any) {
      $rootScope.hkParams = $routeParams || [];

      HawkularInventory.Resource.query({tenantId: globalTenantId}, (resourceList) => {
        $rootScope.hkResources = resourceList;
        for (var i = 0; i < resourceList.length; i++) {
          if(resourceList[i].id === $rootScope.hkParams.resourceId) {
            $rootScope.selectedResource = resourceList[i];
          }
        }
      });

      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.hkParams = current.params;
        HawkularInventory.Resource.query({tenantId: globalTenantId}, (resourceList) => {
          $rootScope.hkResources = resourceList;
          for (var i = 0; i < resourceList.length; i++) {
            if(resourceList[i].id === $rootScope.hkParams.resourceId) {
              $rootScope.selectedResource = resourceList[i];
            }
          }
        });
      }, this);
    }
  }

  _module.service('HawkularNav', HawkularNav);

}
