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
/// <reference path="alertsManager.ts"/>
/// <reference path="errorManager.ts"/>

module HawkularMetrics {

  export class MetricsAlertController {
    public static  $inject = ['$scope', 'HawkularAlert', 'HawkularAlertsManager', 'HawkularErrorManager', '$log', '$q', '$rootScope', '$routeParams', '$modal'];

    private metricId: string;
    public alertList: any  = [];
    public openSetup: any;

    constructor(private $scope:any,
                private HawkularAlert:any,
                private HawkularAlertsManager: HawkularMetrics.IHawkularAlertsManager,
                private HawkularErrorManager: HawkularMetrics.IHawkularErrorManager,
                private $log: ng.ILogService,
                private $q: ng.IQService,
                private $rootScope: any,
                private $routeParams: any,
                private $modal: any) {

      this.$log.debug('querying data');
      this.$log.debug('$routeParams', $routeParams);

      this.openSetup = () => {
        console.log('opening modal');
        var modalInstance = $modal.open({
          templateUrl: 'plugins/metrics/html/alerts-setup.html',
          controller: 'MetricsAlertSetupController as mas'
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      this.metricId = $routeParams.resourceId;

      $scope.alertsTimeOffset = $routeParams.timeOffset;
      // If the end time is not specified in URL use current time as end time
      $scope.alertsTimeEnd = $routeParams.endTime ? $routeParams.endTime : (new Date()).getTime();
      $scope.alertsTimeStart = $scope.alertsTimeEnd - $scope.alertsTimeOffset;

      $scope.timeFilter = function(value): boolean {

        // If no time offset is specified we will return all alerts
        if (!$scope.alertsTimeOffset) {
          return true;
        }

        return !!((value.start > $scope.alertsTimeStart) && (value.start < $scope.alertsTimeEnd));
      };

      HawkularAlertsManager.queryConsoleAlerts(this.metricId).then((data)=> {
        this.$log.debug('data', data);
        this.alertList = data;
      }, (error) => { return this.HawkularErrorManager.errorHandler(error, 'Error fetching alerts.'); });
    }
  }

  _module.controller('MetricsAlertController', MetricsAlertController);

  export class MetricsAlertSetupController {
    public static  $inject = ['$scope', 'HawkularAlert', 'HawkularAlertsManager', 'HawkularErrorManager', '$log', '$q', '$rootScope', '$routeParams', '$modalInstance'];

    private metricId: string;
    private trigger_thres: any;
    private trigger_thres_damp: any;
    private trigger_thres_cond: any;
    private trigger_avail: any;
    private trigger_avail_damp: any;

    public saveProgress: boolean = false;
    public responseDuration: number;
    public downtimeDuration: number;
    public responseUnit: number = 60000;
    public downtimeUnit: number = 1;

    public scope: any;

    public timeUnits = [
      {value: 1, label: 'miliseconds'},
      {value: 1000, label: 'seconds'},
      {value: 60000, label: 'minutes'},
      {value: 360000, label: 'hours'}
    ];

    public timeUnitsDict = {
      '1': 'miliseconds',
      '1000': 'seconds',
      '60000': 'minutes',
      '360000': 'hours'
    };

    constructor(public $scope:any,
                private HawkularAlert:any,
                private HawkularAlertsManager: HawkularMetrics.IHawkularAlertsManager,
                private HawkularErrorManager: HawkularMetrics.IHawkularErrorManager,
                private $log: ng.ILogService,
                private $q: ng.IQService,
                private $rootScope: any,
                private $routeParams: any,
                private $modalInstance: any) {

      this.$log.debug('querying data');
      this.$log.debug('$routeParams',$routeParams.resourceId);

      // Get the data about Threshold Trigger
      HawkularAlertsManager.getTrigger($routeParams.resourceId + '_trigger_thres').then((data)=> {
        this.trigger_thres = data;
        this.$log.debug('this.trigger_thres', this.trigger_thres);
        return HawkularAlert.Dampening.query({triggerId: $routeParams.resourceId + '_trigger_thres'}).$promise;
      }, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error fetching threshold trigger.');
      }).then((data)=> {
        this.trigger_thres_damp = data;
        this.responseDuration = data[0].evalTimeSetting;
        this.$log.debug('this.trigger_thres_damp', this.trigger_thres_damp);
        return HawkularAlert.Condition.query({triggerId: $routeParams.resourceId + '_trigger_thres'}).$promise;
      }, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error fetching threshold trigger dampening.');
      }).then((data)=> {
        this.trigger_thres_cond = data;
        this.$log.debug('this.trigger_thres_cond', this.trigger_thres_cond);
      }, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error fetching threshold trigger condition.');
      });

      // Get the data about Availability Trigger
      HawkularAlertsManager.getTrigger($routeParams.resourceId + '_trigger_avail').then((data)=> {
        this.trigger_avail = data;
        this.$log.debug('this.trigger_avail', this.trigger_avail);
        return HawkularAlert.Dampening.query({triggerId: $routeParams.resourceId + '_trigger_avail'}).$promise;
      }, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error fetching availability trigger.');
      }).then((data)=> {
        this.trigger_avail_damp = data;
        this.downtimeDuration = data[0].evalTimeSetting;
        this.$log.debug('this.trigger_avail_damp', this.trigger_avail_damp);
      }, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error fetching availability trigger dampening.');
      });

      this.metricId = $routeParams.resourceId;
      this.$log.debug('this.metricId', this.metricId);
    }

    public changeResponseTimeUnits():void {
      this.trigger_thres_damp[0].evalTimeSetting = this.responseDuration * this.responseUnit;
    }

    public changeDowntimeTimeUnits():void {
      this.trigger_avail_damp[0].evalTimeSetting = this.downtimeDuration * this.downtimeUnit;
    }

    public cancel(): void {
      this.$modalInstance.dismiss('cancel');
    }

    public save(): void {
      this.$log.debug('Saving Alert Settings');

      this.saveProgress = true;
      // Check if email action exists
      this.HawkularAlertsManager.addEmailAction(this.trigger_thres.actions[0]).then(()=> {
        return this.HawkularAlertsManager.updateTrigger(this.trigger_thres.id, this.trigger_thres);
      }, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error saving email action.');
      }).then(() => {
        this.trigger_avail.actions = this.trigger_thres.actions;
        return this.HawkularAlertsManager.updateTrigger(this.trigger_avail.id, this.trigger_avail);
      }, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error updating threshold trigger.');
      }).then(()=> {
        return this.HawkularAlertsManager.updateDampening(this.trigger_thres.id, this.trigger_thres_damp[0].dampeningId, this.trigger_thres_damp[0]);
      }, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error updating availability trigger.');
      }).then(()=> {
        return this.HawkularAlertsManager.updateDampening(this.trigger_avail.id, this.trigger_avail_damp[0].dampeningId, this.trigger_avail_damp[0]);
      }, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error updating threshold trigger dampening.');
      }).then(()=> {
        return this.HawkularAlertsManager.updateCondition(this.trigger_thres.id, this.trigger_thres_cond[0].conditionId, this.trigger_thres_cond[0]);
      }, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error updating availability dampening.');
      }).then(angular.noop, (error)=> {
        return this.HawkularErrorManager.errorHandler(error, 'Error updating availability condition.');
      }).finally(()=> {
        this.saveProgress = false;
      });
    }
  }

  _module.controller('MetricsAlertSetupController', MetricsAlertSetupController);
}

