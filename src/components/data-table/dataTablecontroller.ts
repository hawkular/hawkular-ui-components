///<reference path="../../tsd.d.ts"/>
export default class DataTableController {
    public data: any;
    public columns: any;
    public sortType: any = -1;
    public sortReverse: boolean;
    public onRowClick: (args: {$event: JQueryEventObject, rowData: any}) => void;
    public onItemSelected: () => void;
    public resPerPage: number = 10;
    public resCurPage: number = 0;

    public static get assetUrl() {return '/assets/';}

    public isFilteredBy(key): boolean {
        return this.sortType === key;
    }

    public getColumnClass(column: any): any {
        return {
            narrow: column.is_narrow,
            miqTextLeft : column.align === 'left',
            miqTextRight : column.align === 'right'
        };
    }

    public onSortClick(column: any): void {
        this.sortType = column.col_idx;
        this.sortReverse = !this.sortReverse;
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
    }

    public getSortTypeAsText() {
        const selectedFilter: any = _.find(this.columns, {col_idx: this.sortType});
        if (selectedFilter) {
            return selectedFilter.text;
        }
    }

    public onCheckAll(isChecked: any) {
        _.each(this.data, (oneItem: any) => {
            oneItem.selected = isChecked;
        });
        this.onItemSelected();
    }

    public onRowSelected($event) {
        $event.stopPropagation();
        console.log(this);
        this.onItemSelected();
    }
}
