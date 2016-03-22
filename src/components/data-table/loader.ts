import DataTable from './dataTableDirective';
import DataTablePagination from './dataTablePaginationDirective';

export default (module: ng.IModule) => {
    module.directive('miqDataTable', DataTable.Factory());
    module.directive('miqDataTablePagination', DataTablePagination.Factory());
}
