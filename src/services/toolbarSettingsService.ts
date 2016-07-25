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

interface IToolbarSettings {
  items: any[];
  dataViews: any[];
}

interface IRequestData {
  lastAction: string;
  id?: number;
  display?: string;
  gtl_type?: string;
}

export default class ToolbarSettingsService {
  private countSelected: number = 0;
  public items: any[];
  public dataViews: any[];

  /*@ngInject*/
  constructor(private $http: any, private MiQEndpointsService: any) {}

  /**
   *
   * @param isClicked
   */
  public checkboxClicked(isClicked) {
    isClicked ? this.countSelected++ : this.countSelected--;
    _.chain(this.items)
      .flatten()
      .each((item: any) => {
        if (item) {
          this.enableToolbarItemByCountSelected(item);
          _.each(item.items, (oneButton) => {
            this.enableToolbarItemByCountSelected(oneButton);
          });
        }
      })
      .value();
  }

  public generateToolbarObject(toolbarObject) {
    this.items = toolbarObject;
    this.dataViews = this.filterViews();
    return {
      items: this.items,
      dataViews: this.dataViews
    };
  }

  /**
   *
   * @returns {ng.IPromise<IToolbarSettings>}
   * @param getData
   */
  public getSettings(getData: IRequestData): ng.IPromise<IToolbarSettings> {
    return this.httpGet(
      this.MiQEndpointsService.rootPoint + this.MiQEndpointsService.endpoints.toolbarSettings,
      getData
    ).then((items) => {
      this.items = items;
      this.dataViews = this.filterViews();
      return {
        items: items,
        dataViews: this.dataViews
      };
    });
  }

  /**
   *
   * @returns {any[]}
   */
  private filterViews(): any[] {
    return _.flatten(this.items).filter(function(item) {
      return item && item.id && item.id.indexOf('view_') === 0;
    });
  }

  /**
   *
   * @param url
   * @param dataObject
   * @returns {any}
   */
  private httpGet(url: string, dataObject: any): any {
    return this.$http.get(url, {params: dataObject})
      .then(dataResponse => dataResponse.data);
  }

  /**
   *
   * @param toolbarItem
   */
  private enableToolbarItemByCountSelected(toolbarItem: any): void {
    if (toolbarItem.onwhen) {
      if (toolbarItem.onwhen.slice(-1) === '+') {
        toolbarItem.enabled = this.countSelected >=  toolbarItem.onwhen.slice(0, toolbarItem.onwhen.length - 1);
      } else {
        toolbarItem.enabled = this.countSelected === parseInt(toolbarItem.onwhen, 10);
      }
    }
  }
}
