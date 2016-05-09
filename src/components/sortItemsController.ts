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
export default class SortItemsController {
  public options: any;
  public headers: any[];
  public items: any[];
  public onSort: (args: {sortId: any, isAscending: boolean}) => void;
  /* @ngInject*/
  public constructor(public MiQDataTableService: any,
                     public observeOnScope: any,
                     public $scope: any) {
    observeOnScope($scope, () => {
      return this.headers;
    }).subscribe(() => {
      this.fillFields();
    });
    this.initOptions();
  }

  private initOptions() {
    const sortIndexAndAsc = this.MiQDataTableService.getSortedIndexAndAscending();
    this.options = {
      fields: [],
      onSortChange: (sortId: any, isAscending: boolean) => this.onSort({sortId: sortId, isAscending: isAscending})
    };
    if (sortIndexAndAsc && sortIndexAndAsc.sortIndex.hasOwnProperty('id')) {
      this.options.currentField = sortIndexAndAsc.sortIndex;
      this.options.isAscending = sortIndexAndAsc.isAscending;
    }
  }

  private fillFields() {
    _.each(this.headers, (oneCol) => {
      if (!oneCol.hasOwnProperty('is_narrow') && oneCol.hasOwnProperty('text')) {
        this.options.fields.push({
          id: oneCol.text.toLowerCase(),
          title:  oneCol.text,
          sortType: oneCol.sort === 'str' ? 'alpha' : 'numeric'
        });
      }
    });
  }
}
