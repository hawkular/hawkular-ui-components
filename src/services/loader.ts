import Greeter from './greeterService';
import DataTableService from './dataTableService';

export default (module: ng.IModule) => {
    module.provider('MiqGreeter', Greeter);
    module.service('MiQDataTableService', DataTableService);
}
