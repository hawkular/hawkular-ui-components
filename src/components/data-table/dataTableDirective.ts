///<reference path="../../tsd.d.ts"/>
import DataTableController from './dataTablecontroller';

export default class DataTable implements ng.IDirective {
    public replace: boolean = true;
    public template = require<string>('./data-table.html');
    public controller: any = DataTableController;
    public controllerAs: string = 'vm';
    public scope: any = {};
    public bindToController: any = {
        onRowClick: '&',
        onItemSelected: '&',
        data: '=',
        columns: '='
    };

    public static Factory = () => {
        let directive: ng.IDirectiveFactory = () => new DataTable();
        directive.$inject = [];
        return directive;
    };
}
