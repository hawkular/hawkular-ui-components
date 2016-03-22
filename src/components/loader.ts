import toolbarMenuLoader from './toolbar-menu/loader';
import dataTableLoader from './data-table/loader';

export default (module: ng.IModule) => {
    toolbarMenuLoader(module);
    dataTableLoader(module);
}
