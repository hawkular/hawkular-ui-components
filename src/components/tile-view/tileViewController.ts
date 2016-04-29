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

import DataTableController from './../data-table/dataTablecontroller';

export default class TileViewcontroller {
  public perPage: number;
  public items: any[];
  public headers: any[];
  public options: any;
  public onTileSelect;
  public onTileClick: (args: {$event: any, rowData: any}) => void;
  public loadMoreItems: () => void;
  public hasLoader: boolean;
  /* @ngInject */
  constructor(public observeOnScope: any,
              public $scope: any) {
    observeOnScope($scope, () => {
      return this.items;
    }).subscribe((changedItems) => {
      this.options.selectedItems = this.filterSelected();
    });
    this.initOptions();
  }

  private initOptions(): void {
    this.options = {
      selectionMatchProp: 'id',
      selectItems: true,
      multiSelect: true,
      showSelectBox: false,
      onClick: _.bind(this.handleClick, this),
      selectedItems: this.filterSelected(),
    };
  }

  public filterSelected(): any[] {
    return this.items.filter((oneItem: any) => {
      return oneItem.selected;
    });
  }

  public handleClick(item: any, event: any): void {
    if (event.target instanceof HTMLImageElement || event.target.tagName.toLowerCase() === 'a') {
      event.preventDefault();
      this.onTileClick({$event: event, rowData: item});
    } else {
      item.selecteItem(!item.selected);
      this.options.selectedItems = this.filterSelected();
      this.onTileSelect();
    }
  }
}
