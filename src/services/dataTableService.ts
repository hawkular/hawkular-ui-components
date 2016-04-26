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
}

export default class DataTableService implements ng.IServiceProvider {
  private $http: any;
  private MiQDataAccessService: any;
  public endpoints = {
    list : '/list'
  };
  public retrieveRowsAndColumnsFromUrl(): ng.IPromise<IRowsColsResponse> {
    return this.$http({
      method: 'GET',
      url: location.origin + this.MiQDataAccessService.getUrlPrefix() + this.endpoints.list
    }).then((responseData) => {
      DataTableService.mockData(responseData.data.rows);
      DataTableService.filterSelectBox(responseData.data.head, responseData.data.rows);
      DataTableService.bindHeadersToRows(responseData.data.head, responseData.data.rows);
      DataTableService.exposeName(responseData.data.head, responseData.data.rows);
      DataTableService.exposeIcon(responseData.data.rows);
      return {
        rows: responseData.data.rows,
        cols: responseData.data.head
      };
    });
  }

  private static exposeName(headers: any[], rows: any[]) {
    _.each(rows, (row: any) => {
      row.nameItem = DataTableService.findNameItem(row.cells, headers);
    });
  }

  private static bindHeadersToRows(headers: any[], rows: any[]) {
    _.each(rows, (row) => {
      row['headers'] = headers;
    });
  }

  private static filterSelectBox(headers: any[], rows: any[]) {
    _.each(rows, (row: any) => {
      row.cells = row.cells.filter(cell => !cell.hasOwnProperty('is_checkbox'));
    });
    headers.splice(0, 1);
  }

  private static exposeIcon(rows: any[]) {
    _.each(rows, (oneRow: any) => {
      oneRow.icon = DataTableService.findIconItem(oneRow.cells);
    });
  }

  private static findIconItem(cells: any): any {
    return _.find(cells, (row) => {
      return row.hasOwnProperty('image') || row.hasOwnProperty('icon');
    });
  }

  private static findNameItem(cells: any[], headers: any[]): any {
    const nameIndex = _.findIndex(headers, {text: 'Name'});
    if (nameIndex !== -1) {
      return cells[nameIndex];
    }
  }

  // TODO: Remove this method
  private static mockData(rows: any[]) {
    rows.push(_.cloneDeep(rows[0]));
    rows.push(_.cloneDeep(rows[0]));
    rows.push(_.cloneDeep(rows[0]));
    rows.push(_.cloneDeep(rows[0]));
    _.each(rows, (row: any, key: any) => {
      row.id += key;
      row.cells[2].text += row.id;
    });
  }

  /*@ngInject*/
  public $get($http: any, MiQDataAccessService: any): IDataTableService {
    this.$http = $http;
    this.MiQDataAccessService = MiQDataAccessService;
    return {
      retrieveRowsAndColumnsFromUrl: () => this.retrieveRowsAndColumnsFromUrl()
    };
  }
}
