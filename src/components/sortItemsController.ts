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
  /* @ngInject */
  public constructor(private $scope: any,
                     private rx: any) {
    this.initOptions();
    this.fillFields();
  }

  private initOptions() {
    this.options = {
      fields: [],
      onSortChange: (sortId, isAscending) => this.handleSort(sortId, isAscending)
    };
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
  public handleSort(sortId, isAscending) {
    const itemIndex = _.findIndex(this.headers, {text: sortId.title});
    this.items.sort( (item1, item2) => {
      let compValue = 0;
      if (sortId.sortType === 'numeric') {
        compValue = item1.cells[itemIndex] - item2[itemIndex];
      } else {
        compValue = item1.cells[itemIndex].text.localeCompare(item2.cells[itemIndex].text);
      }
      return (isAscending) ? compValue : compValue * -1;
    });
  }
}
