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
export default class DataTableController {
  public showHeader: boolean;
  public limitedData: any[];
  public data: any;
  public columns: any;
  public sortType: any = -1;
  public sortReverse: boolean = true;
  public onRowClick: (args: {$event: JQueryEventObject, rowData: any}) => void;
  public onItemSelected: () => void;
  public perPage: number;
  public resCurPage: number;
  public noFooter: boolean = false;
  public defaultAction: any;
  public selectable: boolean = true;
  public onSort: (args: {sortId: any, isAscending: boolean}) => void;

  /* @ngInject */
  public constructor(public MiQDataTableService: any,
                     public observeOnScope: any,
                     public $scope: any) {
    observeOnScope($scope, () => {
      return this.data
    }).subscribe(() => {
      this.setPage(0);
    });

    observeOnScope($scope, () => {
      return this.perPage
    }).subscribe(() => {
      this.setPage(0);
    });
  }

  public static get assetUrl() {
    return '/assets/';
  }

  public isFilteredBy(column) {
    const sortIndexAndAsc = this.MiQDataTableService.getSortedIndexAndAscending();
    if (sortIndexAndAsc) {
      this.sortReverse = !sortIndexAndAsc.isAscending;
      return column === _.find(this.columns, {text: sortIndexAndAsc.sortIndex.title});
    }
    return false;
  }

  public getSortClass(column) {
    if (this.isFilteredBy(column)) {
      return {
        'fa-sort-asc': this.sortReverse,
        'fa-sort-desc': !this.sortReverse
      }
    }
  }

  public getColumnClass(column: any): any {
    return {
      narrow: column.is_narrow,
      miqTextLeft: column.align === 'left',
      miqTextRight: column.align === 'right'
    };
  }

  public onSortClick(column: any): void {
    if (column.sort) {
      this.onSort({sortId: {title: column.text, id: column.text.toLocaleLowerCase()}, isAscending: this.sortReverse});
      this.setPage(this.resCurPage);
    }
  }

  public isCheckbox(row, columnKey): boolean {
    return row.cells[columnKey].hasOwnProperty('is_checkbox') && row.cells[columnKey]['is_checkbox'];
  }

  public isIconOrImage(row, columnKey): boolean {
    return DataTableController.isImage(row, columnKey) ||
      DataTableController.isIcon(row, columnKey);
  }

  public static isIcon(row, columnKey): boolean {
    return row.cells[columnKey].hasOwnProperty('icon') && row.cells[columnKey]['icon'] !== null;
  }

  public static isImage(row, columnKey): boolean {
    return row.cells[columnKey].hasOwnProperty('image') && row.cells[columnKey]['image'] !== null;
  }

  public buildImageUrl(row, columnKey) {
    const imagePath = DataTableController.isIcon(row, columnKey) ?
      row.cells[columnKey]['icon'] : row.cells[columnKey]['image'];
    return DataTableController.assetUrl + imagePath;
  }

  public setPage(page) {
    this.resCurPage = page;
    this.limitedData = this.data.slice(this.perPage * this.resCurPage, this.perPage * (this.resCurPage + 1));
  }

  public getSortTypeAsText() {
    const selectedFilter: any = _.find(this.columns, {col_idx: this.sortType});
    if (selectedFilter) {
      return selectedFilter.text;
    }
  }

  public onCheckAll(isChecked: any) {
    _.each(this.data, (oneItem: any) => {
      oneItem.selecteItem(isChecked);
    });
    this.onItemSelected();
  }

  public onRowSelected($event, isSelected, item) {
    $event.stopPropagation();
    item.selecteItem(isSelected);
    this.onItemSelected();
  }
}
