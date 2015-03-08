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

    export interface IQuickAlertController {
        toggleQuickAlert():void
        saveQuickAlert():void
    }

    export class QuickAlertController implements IQuickAlertController {
        public static  $inject = ['$scope', 'HawkularAlert'];

        constructor(private $scope:any,
                    private HawkularAlert:any) {
            this.$scope.showQuickAlert = false;
            this.$scope.quickTrigger = {
                operator: 'LT',
                threshold: 0
            };
            this.allNotifiers();
            console.log('Notifiers: ' + this.$scope.notifiers);
        }

        toggleQuickAlert():void {
            this.$scope.showQuickAlert = !this.$scope.showQuickAlert;
        }

        private allNotifiers():void {
            this.$scope.notifiers = [];
            this.HawkularAlert.Notifier.query(
                (result) => {
                    this.$scope.notifiers = result;
                }, (error) => {
                    if (error.data.errorMsg) {
                        toastr.error(error.data.errorMsg);
                    } else {
                        toastr.error('Error loading Alerts Notifiers: ' + error);
                    }
                }
            );
        }

        saveQuickAlert():void {
            if (sharedMetricId !== '.status.duration' && sharedMetricId !== '.status.code') {
                var newTrigger:any = {};
                newTrigger.id = sharedMetricId + 'ResponseTime' + '-' + this.$scope.quickTrigger.operator + '-' + this.$scope.quickTrigger.threshold;
                newTrigger.name = newTrigger.id;
                newTrigger.description = 'Created on ' + new Date();
                newTrigger.match = 'ALL';
                newTrigger.enabled = true;
                newTrigger.notifiers = this.$scope.quickTrigger.notifiers;

                var newDampening:any = {
                    triggerId: newTrigger.id,
                    type: 'RELAXED_COUNT',
                    evalTrueSetting: 1,
                    evalTotalSetting: 1,
                    evalTimeSetting: 0
                };

                this.HawkularAlert.Trigger.save(newTrigger,
                    (trigger) => {
                        newDampening.triggerId = trigger.id;
                        this.HawkularAlert.Dampening.save(newDampening,
                            (dampening) => {
                                var newThresholdCondition = {
                                    triggerId: newDampening.triggerId,
                                    dataId: sharedMetricId,
                                    conditionSetSize: 1,
                                    conditionSetIndex: 1,
                                    operator: this.$scope.quickTrigger.operator,
                                    threshold: this.$scope.quickTrigger.threshold
                                };
                                this.HawkularAlert['ThresholdCondition'].save(newThresholdCondition,
                                    () => {
                                        this.HawkularAlert.Alert.reload(
                                            (errorReload) => {
                                                if (errorReload.data.errorMsg) {
                                                    toastr.error(errorReload.data.errorMsg);
                                                } else {
                                                    toastr.error('Error reloading alerts' + errorReload);
                                                }
                                            });
                                        toastr.success('Alert Created!');
                                        this.toggleQuickAlert();
                                    },
                                    (errorCondition) => {
                                        if (errorCondition.data.errorMsg) {
                                            toastr.error(errorCondition.data.errorMsg);
                                        } else {
                                            toastr.error('Error loading Saving Trigger Condition' + errorCondition);
                                        }
                                    });
                            }, (errorDampening) => {
                                if (errorDampening.data.errorMsg) {
                                    toastr.error(errorDampening.data.errorMsg);
                                } else {
                                    toastr.error('Error loading Saving Trigger Dampening ' + errorDampening);
                                }
                            }
                        );
                    }, (error) => {
                        if (error.data.errorMsg) {
                            toastr.error(error.data.errorMsg);
                        } else {
                            toastr.error('Error loading Saving Trigger ' + error);
                        }
                    }
                );
            } else {
                toastr.warning('No metric selected');
            }

        }

    }

    _module.controller('QuickAlertController', QuickAlertController);
}

