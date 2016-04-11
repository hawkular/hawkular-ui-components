///
/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///    http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

///<reference path="../../tsd.d.ts"/>
import {INotificationAlert} from '../../services/notificationService';

export default class NotificationSectionController {
  public limit: any;
  public timer: any;
  public activeNotifications: INotificationAlert[] = [];
  public showInfo: boolean;
  /* @ngInject */
  constructor(private MiQNotificationService: any, private $timeout: any, private $scope: any) {
    MiQNotificationService.notificationSubject.subscribe(
      (data: INotificationAlert) => this.onSuccess(data),
      (error) => this.onError(error)
    );
  }

  public onSuccess(data: INotificationAlert) {
    this.activeNotifications.push(data);
    this.$timeout(() => {
      this.$scope.$digest();
    });
    console.log(this);
    //if (this.timer) {
    //  this.removeItemAfterTimer(data);
    //}
  }

  public removeItemAfterTimer(item) {
    this.$timeout(() => {
      const indexToRemove = _.findIndex(this.activeNotifications, item);
      if (indexToRemove !== -1) {
        this.activeNotifications.splice(indexToRemove, 1);
      }
    }, this.timer);
  }

  public onError(err) {
    console.log('On error ', err);
  }

  public onDismiss(key) {
    this.activeNotifications.splice(key, 1);
  }
}
