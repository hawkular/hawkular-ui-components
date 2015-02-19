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

    export interface INotifiersController {
        allNotifiers(): void;
        newNotifier(): void;
        viewNotifier(notifierId: string):void;
        saveNotifier():void;
        deleteNotifier(notifierId: string):void;
        closeAlertMsg(index: number):void;
    };

    export class NotifiersController implements INotifiersController {
        public static  $inject = ['$scope', '$interval', '$log', 'HawkularAlert'];

        constructor(private $scope:any,
                    private $interval:ng.IIntervalService,
                    private $log:ng.ILogService,
                    private HawkularAlert:any) {

            $scope.status = 'all';
            $scope.msgs = [];
            $scope.notifiers = [];
            $scope.notifierTypes = [];
            this.allNotifiers();
        }

        public allNotifiers(): void {
            this.$scope.status = 'all';
            this.$scope.notifiers = [];
            this.HawkularAlert.Notifier.query(
                (notifiers) => {
                    for (var i = 0; i < notifiers.length; i++) {
                        this.HawkularAlert.Notifier.get({notifierId: notifiers[i]},
                            (notifier) => {
                                var newNotifier = {notifierId: '',
                                                    notifierType: notifier.NotifierType,
                                                    description: notifier.description };
                                if (notifier.NotifierID) {
                                    newNotifier.notifierId = notifier.NotifierID;
                                }
                                if (notifier.NotifierId) {
                                    newNotifier.notifierId = notifier.NotifierId;
                                }
                                this.$scope.notifiers.push(newNotifier);
                            }, (reasonNotifier) => {
                                this.addAlertMsg(reasonNotifier);
                            });
                    }
                }, (reason) => {
                    this.addAlertMsg(reason);
                });
        }

        public newNotifier():void {
            this.$scope.status = 'new';
            this.$scope.notifier = {};
            this.$scope.notifierTypes = [];
            this.HawkularAlert.NotifierType.query(
                (notifierTypes) => {
                    for (var i = 0; i < notifierTypes.length; i++) {
                        if (i === 0) {
                            this.$scope.notifier.notifierType = notifierTypes[0];
                        }
                        this.$scope.notifierTypes.push(notifierTypes[i]);
                    }
                }
            );
        }

        public viewNotifier(notifierId: string): void {
            this.$scope.status = 'edit';
            this.$scope.notifier = {};
            this.$scope.notifierTypes = [];
            this.HawkularAlert.Notifier.get({notifierId: notifierId},
                (notifier) => {
                    this.$scope.notifier = {notifierId: '',
                                            notifierType: notifier.NotifierType,
                                            description: notifier.description};
                    if (notifier.NotifierID) {
                        this.$scope.notifier.notifierId = notifier.NotifierID;
                    }
                    if (notifier.NotifierId) {
                        this.$scope.notifier.notifierId = notifier.NotifierId;
                    }
                }, (reason) => {
                    this.addAlertMsg(reason);
                });
            this.HawkularAlert.NotifierType.query(
                (notifierTypes) => {
                    for (var i = 0; i < notifierTypes.length; i++) {
                        this.$scope.notifierTypes.push(notifierTypes[i]);
                    }
                }
            );

        }

        public saveNotifier():void {
            var newNotifier = {
                NotifierId: this.$scope.notifier.notifierId,
                NotifierType: this.$scope.notifier.notifierType,
                description: this.$scope.notifier.description
            };
            if (this.$scope.status === 'new') {
                this.HawkularAlert.Notifier.save(newNotifier,
                    () => {
                        this.allNotifiers();
                    }, (reason) => {
                        this.addAlertMsg(reason);
                    });
            } else {
                this.HawkularAlert.Notifier.put({notifierId: newNotifier.NotifierId}, newNotifier,
                    () => {
                        this.allNotifiers();
                    }, (reason) => {
                        this.addAlertMsg(reason);
                    });
            }

        }

        public deleteNotifier(notifierId: string): void {
            this.HawkularAlert.Notifier.delete({notifierId: notifierId},
                () => {
                    this.allNotifiers();
                },
                (reason) => {
                    this.addAlertMsg(reason);
                });
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

        public closeAlertMsg(index: number):void {
            this.$scope.msgs.splice(index, 1);
        }

    };

    _module.controller('HawkularAlerts.NotifiersController', NotifiersController);
}
