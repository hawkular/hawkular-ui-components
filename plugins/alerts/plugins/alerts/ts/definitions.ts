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

/// <reference path="alertsPlugin.ts"/>
module HawkularAlerts {

    export interface IDefinitionsController {
        allDefinitions():void;
        newDefinition():void;
        saveDefinition():void;
        viewDefinition(id: string):void;
        deleteDefinition(id: string):void;
        closeAlertMsg(index: number):void;
        newCondition():void;
        changeConditionType():void;
        viewCondition(conditionId: string):void;
        saveCondition():void;
        deleteCondition(conditionId: string, className: string):void;
        cancelCondition():void;
        saveDampening():void;
        reloadDefinitions():void;
    };

    export class DefinitionsController implements IDefinitionsController {
        public static  $inject = ['$scope', '$window', '$log', 'HawkularAlert'];

        constructor(private $scope:any,
                    private $window:any,
                    private $log:ng.ILogService,
                    private HawkularAlert:any) {

            $scope.status = 'all';
            $scope.msgs = [];
            this.allDefinitions();
            this.allNotifiers();
        }

        allDefinitions():void {
            this.$scope.status = 'all';
            this.$scope.triggers = this.HawkularAlert.Trigger.query();
        }

        newDefinition():void {
            this.$scope.status = 'new';
            this.$scope.trigger = { match: "ALL", enabled: true};
            this.$scope.dampening = { type: 'RELAXED_COUNT',
                                        evalTrueSetting: 1,
                                        evalTotalSetting: 1,
                                        evalTimeSetting: 0};
            this.$scope.statusDampening = {status: 'new'};
            this.allNotifiers();
        }

        saveDefinition():void {
            this.$scope.msgs = [];
            if (this.$scope.status === 'new') {
                this.HawkularAlert.Trigger.save(this.$scope.trigger,
                    (trigger) => {
                        this.$scope.dampening.triggerId = trigger.id;
                        this.HawkularAlert.Dampening.save(this.$scope.dampening,
                            (dampening) => {
                                this.viewDefinition(dampening.triggerId);
                            }, (reasonDampening) => {
                                this.addAlertMsg(reasonDampening);
                            }
                        );
                    }, (reason) => {
                        this.addAlertMsg(reason);
                    }
                );
            } if (this.$scope.status === 'edit') {
                this.HawkularAlert.Trigger.put({triggerId: this.$scope.trigger.id}, this.$scope.trigger,
                    () => {
                        this.HawkularAlert.Dampening.put(this.$scope.dampening,
                            () => {
                                this.allDefinitions();
                            }, (reasonDampening) => {
                            this.addAlertMsg(reasonDampening);
                        }
                        );
                    }, (reason) => {
                        this.addAlertMsg(reason);
                    }
                );
            }
        }

        viewDefinition(id: string):void {
            this.$scope.status = 'edit';
            this.$scope.trigger = {};
            this.HawkularAlert.Trigger.get({triggerId: id},
                (response) => {
                    this.$scope.trigger = response;
                }, (reason) => {
                    this.addAlertMsg(reason);
                });
            this.allConditions(id);
            this.getDampening(id);
        }

        deleteDefinition(id: string):void {
            if (this.$window.confirm('Do you want to delete ' + id + ' ?')) {
                this.$scope.msgs = [];
                this.HawkularAlert.Trigger.delete({triggerId: id},
                    () => {
                        this.HawkularAlert.Dampening.delete({triggerId: id},
                            () => {
                                this.allDefinitions();
                            }, (reasonDampening) => {
                                this.addAlertMsg(reasonDampening);
                            }
                        );
                    }, (reason) => {
                        this.addAlertMsg(reason);
                    }
                );
            }
        }

        closeAlertMsg(index: number):void {
            this.$scope.msgs.splice(index, 1);
        }

        private addAlertMsg(reason: any):void {
            var newAlert = {type: 'danger', msg: ''};
            if (reason.data.errorMsg) {
                newAlert.msg = reason.data.errorMsg;
            } else {
                newAlert.msg = reason.statusText;
            }
            this.$scope.msgs.push(newAlert);
        }

        private allNotifiers():void {
            this.$scope.notifiers = [];
            this.HawkularAlert.Notifier.query(
                (result) => {
                    this.$scope.notifiers = result;
                }, (reason) => {
                    this.addAlertMsg(reason);
                }
            );
        }

        private allConditions(triggerId: string):void {
            this.$scope.conditions = [];
            this.$scope.statusCondition = { status: '', conditionId: ''};
            this.HawkularAlert.Trigger.conditions({triggerId: triggerId},
                (conditionsList) => {
                    var conditionClass:any = {};
                    for (var i = 0; i < conditionsList.length; i++) {
                        conditionClass[conditionsList[i].conditionId] = conditionsList[i].className;
                    }
                    for (i = 0; i < conditionsList.length; i++) {
                        var condition = conditionsList[i];
                        this.HawkularAlert[condition.className].get({conditionId: condition.conditionId},
                            (conditionByType) => {
                                var className = conditionClass[conditionByType.conditionId];
                                var newCondition = {
                                    conditionId: conditionByType.conditionId,
                                    className: className,
                                    condition: conditionByType,
                                    description: this.getDescription(className, conditionByType)
                                };
                                this.$scope.conditions.push(newCondition);
                            }, (reasonType) => {
                                this.addAlertMsg(reasonType);
                            });
                    }
                }, (reasonList) => {
                    this.addAlertMsg(reasonList);
                });
        }

        private getDampening(triggerId: string): void {
            this.$scope.dampening = {};
            this.$scope.statusDampening = { status: 'view'};

            this.HawkularAlert.Dampening.get({triggerId: triggerId},
                (dampening) => {
                    this.$scope.dampening = dampening;
                }, (reason) => {
                    this.$scope.dampening = { triggerId: triggerId,
                        type: 'RELAXED_COUNT',
                        evalTrueSetting: 1,
                        evalTotalSetting: 1,
                        evalTimeSetting: 0};
                    this.HawkularAlert.Dampening.save(this.$scope.dampening,
                        (reasonDampening) => {
                            this.addAlertMsg(reasonDampening);
                        }
                    );

                });
        }

        saveDampening(): void {
            this.HawkularAlert.Dampening.put(this.$scope.dampening,
                () => {
                   this.$scope.statusDampening.status = 'view';
                }, (reason) => {
                    this.addAlertMsg(reason);
                });
        }

        private deleteDampening(triggerId: string): void {
            this.HawkularAlert.Dampening.delete({triggerId: triggerId},
               (reason) => {
                    this.addAlertMsg(reason);
                }
            );
        }

        public viewDampening(triggerId: string): void {
            this.$scope.statusDampening = { status: 'edit'};
        }

        private getDescription(className: string, condition: any):string {
            var description = "";
            var op = "";
            if (className === 'AvailabilityCondition') {
                description = condition.dataId + " is " + condition.operator;
            } else if (className === 'CompareCondition') {
                op = this.getOperator(condition.operator);
                description = condition.data1Id + " " + op + " " +
                    "(" + condition.data2Multiplier + " * " + condition.data2Id + ")";
            } else if (className === 'StringCondition') {
                description = condition.dataId + " " + condition.operator + " '" +
                    condition.pattern + "' (A/a " + condition.ignoreCase + ")";
            } else if (className === 'ThresholdCondition') {
                op = this.getOperator(condition.operator);
                description = condition.dataId + " " + op + " " + condition.threshold;
            } else if (className === 'ThresholdRangeCondition') {
                var low = "[";
                var high = "]";
                if (condition.operatorLow !== 'INCLUSIVE') {
                    low = "(";
                }
                if (condition.operatorHigh !== 'INCLUSIVE') {
                    high = ")";
                }
                var inout = " in ";
                if (!condition.inRange) {
                    inout = " out ";
                }
                description = condition.dataId + inout + low + condition.thresholdLow + ", " +
                    condition.thresholdHigh + high;
            }
            return description;
        }

        private getOperator(opCode: string):string {
            var op = "";
            if (opCode === 'GT') {
                op = ">";
            } else if (opCode === 'GTE') {
                op = ">=";
            } else if (opCode === 'LT') {
                op = "<";
            } else if (opCode === 'LTE') {
                op = "<=";
            }
            return op;
        }

        newCondition():void {
            this.$scope.statusCondition = {status: 'new', conditionId: '', className: 'AvailabilityCondition'};
            this.$scope.editCondition = { triggerId: this.$scope.trigger.id, conditionSetSize: 1, conditionSetIndex: 1};
            this.$scope.classNames = ['AvailabilityCondition', 'CompareCondition', 'StringCondition',
                'ThresholdCondition', 'ThresholdRangeCondition'];
            this.changeConditionType();
        }

        changeConditionType():void {
            if (this.$scope.statusCondition.className === 'AvailabilityCondition') {
                this.$scope.editCondition.dataId = '';
                this.$scope.editCondition.operator = 'DOWN';
            } else if (this.$scope.statusCondition.className === 'CompareCondition') {
                this.$scope.editCondition.data1Id = '';
                this.$scope.editCondition.operator = 'LT';
                this.$scope.editCondition.data2Multiplier = 1.0;
                this.$scope.editCondition.data2Id = '';
            } else if (this.$scope.statusCondition.className === 'StringCondition') {
                this.$scope.editCondition.dataId = '';
                this.$scope.editCondition.operator = 'EQUAL';
                this.$scope.editCondition.pattern = '';
                this.$scope.editCondition.ignoreCase = false;
            } else if (this.$scope.statusCondition.className === 'ThresholdCondition') {
                this.$scope.editCondition.dataId = '';
                this.$scope.editCondition.operator = 'LT';
                this.$scope.editCondition.threshold = 0.0;
            } else if (this.$scope.statusCondition.className === 'ThresholdRangeCondition') {
                this.$scope.editCondition.dataId = '';
                this.$scope.editCondition.operatorLow = 'INCLUSIVE';
                this.$scope.editCondition.operatorHigh = 'INCLUSIVE';
                this.$scope.editCondition.thresholdLow = 0.0;
                this.$scope.editCondition.thresholdHigh = 0.0;
                this.$scope.editCondition.inRange = true;
            }
        }

        viewCondition(condition: any):void {
            this.$scope.statusCondition = {status: 'edit', conditionId: condition.conditionId, className: condition.className};
            this.$scope.editCondition = condition.condition;
        }

        saveCondition():void {
            if (this.$scope.statusCondition.status === 'new') {
                var updatedCondition = this.prepareCondition(this.$scope.statusCondition.className, this.$scope.editCondition);
                this.HawkularAlert[this.$scope.statusCondition.className].save(updatedCondition,
                    () => {
                        this.$scope.statusCondition = {status: ''};
                        this.viewDefinition(this.$scope.trigger.id);
                    }, (reason) => {
                        this.addAlertMsg(reason);
                    });
            } else {
                this.HawkularAlert[this.$scope.statusCondition.className].delete({conditionId: this.$scope.editCondition.conditionId},
                    () => {
                        var updatedCondition = this.prepareCondition(this.$scope.statusCondition.className, this.$scope.editCondition);
                        this.HawkularAlert[this.$scope.statusCondition.className].save(updatedCondition,
                            () => {
                                this.$scope.statusCondition = {status: ''};
                                this.viewDefinition(this.$scope.trigger.id);
                            }, (reason) => {
                                this.addAlertMsg(reason);
                            });
                    }, (reasonDelete) => {
                        this.addAlertMsg(reasonDelete);
                    }
                );

            }
        }

        deleteCondition(conditionId: string, className: string):void {
            if (this.$window.confirm('Do you want to delete ' + conditionId + ' ?')) {
                this.$log.debug('deleteCondition(' + conditionId + ')');
                this.$scope.msgs = [];
                this.HawkularAlert[className].delete({conditionId: conditionId},
                    () => {
                        this.$scope.statusCondition = {status: ''};
                        this.viewDefinition(this.$scope.trigger.id);
                    }, (reasonDelete) => {
                        this.addAlertMsg(reasonDelete);
                    }
                );

            }
        }

        cancelCondition():void {
            this.$scope.statusCondition = {status: ''};
        }

        reloadDefinitions():void {
            this.$log.info('reloadDefinitions()');
            this.HawkularAlert.Alert.reload();
        }

        /*
            Prepare a condition for save.
            Checks fields and conditionId.
         */
        private prepareCondition(className:string, condition:any):any {
            var updatedCondition:any = { };
            updatedCondition.triggerId = condition.triggerId;
            updatedCondition.conditionSetSize = condition.conditionSetSize;
            updatedCondition.conditionSetIndex = condition.conditionSetIndex;
            if (className === 'AvailabilityCondition') {
                updatedCondition.dataId = condition.dataId;
                updatedCondition.operator = condition.operator;
            } else if (className === 'CompareCondition') {
                updatedCondition.data1Id = condition.data1Id;
                updatedCondition.operator = condition.operator;
                updatedCondition.data2Multiplier = condition.data2Multiplier;
                updatedCondition.data2Id = condition.data2Id;
            } else if (className === 'StringCondition') {
                updatedCondition.dataId = condition.dataId;
                updatedCondition.operator = condition.operator;
                updatedCondition.pattern = condition.pattern;
                updatedCondition.ignoreCase = condition.ignoreCase;
            } else if (className === 'ThresholdCondition') {
                updatedCondition.dataId = condition.dataId;
                updatedCondition.operator = condition.operator;
                updatedCondition.threshold = condition.threshold;
            } else if (className === 'ThresholdRangeCondition') {
                updatedCondition.dataId = condition.dataId;
                updatedCondition.operatorLow = condition.operatorLow;
                updatedCondition.operatorHigh = condition.operatorHigh;
                updatedCondition.thresholdLow = condition.thresholdLow;
                updatedCondition.thresholdHigh = condition.thresholdHigh;
                updatedCondition.inRange = condition.inRange;
            }

            return updatedCondition;
        }
    };

    _module.controller('HawkularAlerts.DefinitionsController', DefinitionsController);
}
