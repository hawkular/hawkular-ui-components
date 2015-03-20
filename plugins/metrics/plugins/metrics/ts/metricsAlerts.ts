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

/// <reference path="metricsPlugin.ts"/>
/// <reference path="../../includes.ts"/>

module HawkularMetrics {

  export interface IMetricsAlertController {

  }

  export class MetricsAlertController implements IMetricsAlertController {
    public static  $inject = ['$scope', 'HawkularAlert', '$log', '$q'];

    constructor(private $scope:any,
                private HawkularAlert:any,
                private $log: ng.ILogService,
                private $q: ng.IQService,
                private alertList: any) {

      this.$log.debug('querying data');
      this.alertList = [];

      this.HawkularAlert.Alert.query().$promise.then((data) => {
        this.$log.debug('querying data finished');
        this.alertList = data;
      }, (error) => {
        this.$log.debug('querying data error', error);
      });
    }
  }

  _module.controller('MetricsAlertController', MetricsAlertController);
}

