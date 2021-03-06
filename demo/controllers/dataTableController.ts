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

export default class DataTableController {
  public tableData: any;
  public perPage;
  public emptyData: any;
  public defaultAction: any;
  /* @ngInject */
  constructor(public MiQDataTableService: any, private MiQEndpointsService: any) {
    this.setEndpoints();
    this.defaultAction = {
      title: 'Create new record',
      actionFunction: () => {
        alert('You have tried creating new record');
      }
    };
    this.fetchData().then( (data) => {
      this.tableData = data;
    });
    this.perPage = {
      title: '5',
      enabled: true,
      items: [
        {title: '5', value: 5, enabled: true},
        {title: '10', value: 10, enabled: true},
        {title: '20', value: 20, enabled: true},
        {title: '100', value: 100, enabled: true},
        {title: 'All', value: -1, enabled: true}
      ]
    };
  }

  private setEndpoints() {
    this.MiQEndpointsService.rootPoint = '/data';
    this.MiQEndpointsService.endpoints.listDataTable = '/data-table.json';
  }

  public onPerPage(item) {
    this.perPage.title = item.title;
    this.MiQDataTableService.setPerPage(item.value);
  }

  public fetchData() {
    return this.MiQDataTableService.retrieveRowsAndColumnsFromUrl();
  }

  public onRowClick($event, rowData) {
    console.log(rowData);
  }

  public onRowSelected() {
    console.log(this.tableData);
  }

  public toggleData(isChecked) {
    if (isChecked) {
      this.fetchData().then( (data) => {
        this.tableData = {
          cols: data.cols,
          rows: []
        };
      });
    } else {
      this.fetchData().then( (data) => {
        this.tableData = data;
      });
    }
  }
}
