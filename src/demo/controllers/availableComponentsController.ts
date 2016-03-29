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

export interface IAvailComponent {
  name: string;
  title: string;
  location: string;
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
  public constructor(public name: string, public title: string, public location: string) {}
}

export default class AvailableComponentsController {
  public availableComponents: IAvailableGroup[];
  /* @ngInject */
  public constructor() {
    this.initGroups();
    this.initComponents();
  }

  private initGroups() {
  }

  private initComponents() {
    this.availableComponents = [
      new AvailableGroup('data-table', 'Data Table components', '/data-table', [
        new AvailableComponent('basic', 'Table without pagination', '/basic'),
        new AvailableComponent('with-pagination', 'Table with pagination', '/with-pagination')
      ]),
      new AvailableGroup('toolbar-menu', 'Toolbar menu components', '/toolbar-menu', [
        new AvailableComponent('basic', 'Basic toolbar menu', '/basic')
      ])
    ];
  }
}
