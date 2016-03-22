///<reference path="../../tsd.d.ts"/>

export default class ToolbarList implements ng.IDirective {
    public replace: boolean = true;
    public template = require<string>('./toolbar-list.html');
    public scope: any = {
        toolbarList: '=',
        onItemClick: '&'
    };

    public static Factory = () => {
        let directive: ng.IDirectiveFactory = () => new ToolbarList();
        directive.$inject = [];
        return directive;
    };
}
