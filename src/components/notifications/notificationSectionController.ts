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
  constructor(private MiQNotificationService: any,
              private $timeout: any,
              private $scope: any,
              private rx: any) {
    const disposable = MiQNotificationService.notificationSubject.subscribe(
      (data: INotificationAlert) => this.onNext(data),
      (error) => this.onError(error)
    );
    $scope.$eventToObservable('$destroy')
      .subscribe(() => disposable.dispose());
  }

  /**
   *
   * @param data
     */
  public onNext(data: INotificationAlert) {
    if (data.loadingItem) {
      this.disposeItem(data.loadingItem);
    }
    this.activeNotifications.unshift(data);

    //Work arround for safeApply on Scope
    this.rx.Observable.interval()
      .safeApply(this.$scope)
      .subscribe();

    if (this.timer) {
      this.removeItemAfterTimer(data);
    }
  }

  /**
   *
   * @param item
     */
  public removeItemAfterTimer(item) {
    this.rx.Observable.timer(this.timer)
      .subscribe(() => this.disposeItem(item));
  }

  /**
   *
   * @param err
     */
  public onError(err) {
    console.error('On error ', err);
  }

  private disposeItem(item) {
    const indexToRemove = _.findIndex(this.activeNotifications, item);
    if (indexToRemove !== -1) {
      this.onDismiss(indexToRemove);
    }
  }

  /**
   *
   * @param key
     */
  public onDismiss(key) {
    this.activeNotifications.splice(key, 1);
  }
}
