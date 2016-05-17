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
export interface IRowsColsResponse {
  rows: any[];
  cols: any[];
}

export interface IDataTableService {
  retrieveRowsAndColumnsFromUrl(): ng.IPromise<IRowsColsResponse>;
  sortItemsBy(sortBy: any, isAscending: boolean): any;
  getSortedIndexAndAscending(): any;
  setPerPage(perPage: number): void;
  loadMore(): void;
  removeItems(removeIds: any[]): any;
  dataTableService: any;
}

export default class DataTableService implements ng.IServiceProvider {
  private $http: any;
  private MiQDataAccessService: any;
  private rows: any[];
  private columns: any[];
  private sortId: any;
  private isAscending: boolean;
  public perPage: number = 5;
  public visibleCount: number = 0;
  public visibleItems: any[];
  public endpoints = {
    list : '/list'
  };

  public retrieveRowsAndColumnsFromUrl(): ng.IPromise<IRowsColsResponse> {
    return this.$http({
      method: 'GET',
      url: location.origin + this.MiQDataAccessService.getUrlPrefix() + this.endpoints.list
    }).then((responseData) => {
      this.columns = responseData.data.head;
      this.rows = responseData.data.rows;
      this.exposeData();
      return {
        rows: this.rows,
        cols: this.columns
      };
    });
  }

  public sortItemsBy(sortId: any, isAscending: boolean): any {
    this.sortId = sortId;
    this.isAscending = isAscending;
    const itemIndex = _.findIndex(this.columns, {text: sortId.title});
    this.rows.sort( (item1, item2) => {
      let compValue = 0;
      if (sortId.sortType === 'numeric') {
        compValue = item1.cells[itemIndex] - item2[itemIndex];
      } else if (item1.cells[itemIndex].hasOwnProperty('text')) {
        compValue = item1.cells[itemIndex].text.localeCompare(item2.cells[itemIndex].text);
      }
      return (isAscending) ? compValue : compValue * -1;
    });
  }

  public getSortedIndexAndAscending() {
    if (this.sortId) {
      return {
        sortIndex: this.sortId,
        isAscending: this.isAscending
      };
    }
  }

  public setPerPage(perPage: number) {
    this.perPage = perPage;
    this.visibleCount = perPage;
  }

  public loadMore() {
    this.visibleCount += this.perPage;
    this.visibleItems = this.rows.slice(0, (this.perPage !== -1 ? this.visibleCount : this.rows.length));
  }

  public removeItems(itemIds: any[]): any {
    this.rows = _.filter(this.rows, (item) => {
      return itemIds.indexOf(item.id) === -1;
    });
    this.visibleCount -= this.perPage;
    this.loadMore();
    return this.rows;
  }

  private exposeData() {
    this.filterSelectBox();
    this.bindHeadersToRows();
    this.exposeName();
    this.exposeIcon();
    this.makeSelectable();
    this.loadMore();
  }

  private makeSelectable() {
    _.each(this.rows, (row: any) => {
      row.selecteItem = (selected) => {
        row.selected = selected;
      };
    });
  }

  private exposeName() {
    _.each(this.rows, (row: any) => {
      row.nameItem = this.findNameItem(row.cells);
    });
  }

  private bindHeadersToRows() {
    _.each(this.rows, (row) => {
      row['headers'] = this.columns;
    });
  }

  private filterSelectBox() {
    _.each(this.rows, (row: any) => {
      row.cells = row.cells.filter(cell => !cell.hasOwnProperty('is_checkbox'));
    });
    this.columns.splice(0, 1);
  }

  private exposeIcon() {
    _.each(this.rows, (oneRow: any) => {
      oneRow.icon = DataTableService.findIconItem(oneRow.cells);
    });
  }

  private static findIconItem(cells: any): any {
    return _.find(cells, (row) => {
      return row.hasOwnProperty('image') || row.hasOwnProperty('icon');
    });
  }

  private findNameItem(cells: any): any {
    const nameIndex = _.findIndex(this.columns, {text: 'Name'});
    if (nameIndex !== -1) {
      return cells[nameIndex];
    }
  }

  /*@ngInject*/
  public $get($http: any, MiQDataAccessService: any, rx: any, $rootScope: any): IDataTableService {
    this.$http = $http;
    this.MiQDataAccessService = MiQDataAccessService;
    return {
      retrieveRowsAndColumnsFromUrl: () => this.retrieveRowsAndColumnsFromUrl(),
      sortItemsBy: (sortBy: any, isAscending: boolean) => {
        this.sortItemsBy(sortBy, isAscending);
        this.visibleCount -= this.perPage;
        this.loadMore();
      },
      getSortedIndexAndAscending: () => this.getSortedIndexAndAscending(),
      setPerPage: (perPage: number) => {
        this.setPerPage(perPage);
        this.visibleCount -= this.perPage;
        this.loadMore();
      },
      loadMore: () => this.loadMore(),
      removeItems: (itemIds: any[]) => this.removeItems(itemIds),
      dataTableService: this
    };
  }
}
