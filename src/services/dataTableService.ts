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
      return {
        rows: responseData.data.rows,
        cols: responseData.data.head
      };
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
