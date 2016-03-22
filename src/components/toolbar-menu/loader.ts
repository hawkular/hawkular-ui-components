import Toolbar from './toolbarDirective';
import ToolbarButton from './toolbarButtonDirective';
import ToolbarList from './toolbarListDirective';

export default (module: ng.IModule) => {
    module.directive('miqToolbarMenu', Toolbar.Factory());
    module.directive('miqToolbarButton', ToolbarButton.Factory());
    module.directive('miqToolbarList', ToolbarList.Factory());
}
