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

export interface IAvailComponent {
  name: string;
  title: string;
  location: string;
  template: string;
  controller: string;
}

export interface IAvailableGroup {
  name: string;
  title: string;
  location: string;
  components: IAvailComponent[];
}

export class AvailableGroup implements IAvailableGroup {
  public constructor(public name: string,
                     public title: string,
                     public location: string,
                     public components: IAvailComponent[]) {}
}

export class AvailableComponent implements IAvailComponent {
  public constructor(public name: string,
                     public title: string,
                     public location: string,
                     public template: string,
                     public controller: string) {}
}
export default class AvailableComponentsService {
  public availableComponents: IAvailableGroup[];

  public constructor() {
    this.initComponents();
  }

  private initComponents() {
      this.availableComponents = [
      new AvailableGroup('common-components', 'Common Components', '/common-components', [
        new AvailableComponent('validate-credentials',
          'Validate Credentials',
          '/validate-credentials',
          require<string>('./../views/validate-credentials.html'),
          'demoValidateCredentials as vm'),
        new AvailableComponent('action-buttons',
          'Action Buttons',
          '/action-buttons',
          require<string>('./../views/action-buttons.html'),
          'demoActionButtons as vm'),
        new AvailableComponent('notifications',
          'Notifications',
          '/notifications',
          require<string>('./../views/notification.html'),
          'basicNotification as vm')
      ]),
      new AvailableGroup('tile-view', 'Tile Views Components', '/tile-view', [
        new AvailableComponent('small',
          'Small Tile View',
          '/small',
          require<string>('./../views/tile-view/small-tile.html'),
          'demoDataTable as vm'),
        new AvailableComponent('normal',
          'Normal Tile View with Data',
          '/basic',
          require<string>('./../views/tile-view/tile-view.html'),
          'demoDataTable as vm')
        ]),
      new AvailableGroup('data-table', 'Data Table Components', '/data-table', [
        new AvailableComponent('basic',
          'Data Table with Options',
          '/basic',
          require<string>('./../views/data-table/basic.html'),
          'demoDataTable as vm')
      ]),
      new AvailableGroup('toolbar-menu', 'Toolbar Menu Components', '/toolbar-menu', [
        new AvailableComponent('basic', '' +
          'Basic Toolbar Menu',
          '/basic',
          require<string>('./../views/toolbar-menu/basic.html'),
          'demoToolbarMenu as vm')
      ])
    ];
  }
}
