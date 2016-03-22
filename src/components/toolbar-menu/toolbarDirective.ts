///<reference path="../../tsd.d.ts"/>

import ToolbarController from './toolbarController';

export default class Toolbar implements ng.IDirective {
    public controller: any = ToolbarController;
    public replace: boolean = true;
    public controllerAs: string = 'vm';
    public template = require<string>('./toolbar-menu.html');
    public bindToController: any = {
      toolbarItems: '='
    };

    public static Factory = () => {
        let directive: ng.IDirectiveFactory = () => new Toolbar();
        directive.$inject = [];
        return directive;
    };
}
