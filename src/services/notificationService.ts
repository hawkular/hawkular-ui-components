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

///<reference path="../tsd.d.ts"/>
export interface INotificationAlert {
  type: string;
  body?: string;
  header?: string;
  dismissible?: boolean;
  noTimeout?: boolean;
}

export default class NotificationService {
  public notificationSubject: Rx.Subject<INotificationAlert>;

  /* @ngInject */
  constructor(private rx: any) {
    this.notificationSubject = new this.rx.Subject();
  }

  public sendNext(data: INotificationAlert) {
    this.notificationSubject.onNext(data);
  }

  public sendDanger(data: any){
    data.type = 'danger';
    this.notificationSubject.onNext(data);
  }

  public sendWarning(data: any){
    data.type = 'warning';
    this.notificationSubject.onNext(data);
  }
  public sendSuccess(data: any){
    data.type = 'success';
    this.notificationSubject.onNext(data);
  }
  public sendInfo(data: any){
    data.type = 'info';
    this.notificationSubject.onNext(data);
  }

  public dismissibleMessage(body: string, header?: string) {
    return {
      body: body,
      dismissible: true,
      header: header
    }
  }
}
