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
  loadingItem?: any;
}

export default class NotificationService {
  public static get bodyTag(): string {return '<body>';};
  public static get closeBodyTag(): string {return '</body>';};

  public notificationSubject: Rx.Subject<INotificationAlert>;

  /* @ngInject */
  constructor(private rx: any) {
    this.notificationSubject = new this.rx.Subject();
  }

  public sendNext(data: INotificationAlert): INotificationAlert {
    this.notificationSubject.onNext(data);
    return data;
  }

  public sendDanger(data: any): INotificationAlert {
    data.type = 'danger';
    return this.sendNext(data);
  }

  public sendWarning(data: any): INotificationAlert {
    data.type = 'warning';
    return this.sendNext(data);
  }

  public sendSuccess(data: any): INotificationAlert {
    data.type = 'success';
    return this.sendNext(data);
  }

  public sendInfo(data: any): INotificationAlert {
    data.type = 'info';
    return this.sendNext(data);
  }

  public sendLoading(data: any): INotificationAlert {
    data.type = 'loading';
    return this.sendNext(data);
  }

  public dismissibleMessage(body: string, header?: string, loadingItem?: INotificationAlert) {
    return {
      body: NotificationService.checkForBody(body),
      dismissible: true,
      header: header,
      loadingItem: loadingItem
    };
  }

  private static checkForBody(msg: string): string {
    if (msg && msg !== '') {
      const bodyIndex = msg.indexOf(NotificationService.bodyTag);
      if (bodyIndex !== -1 ) {
        return msg.substring(
          bodyIndex + NotificationService.bodyTag.length, msg.indexOf(NotificationService.closeBodyTag)
        );
      }
    }
    return msg;
  }
}
