///<reference path="../../tsd.d.ts"/>

export default class ToolbarButton implements ng.IDirective {
    public replace: boolean = true;
    public template = require<string>('./toolbar-button.html');
    public scope: any = {
        toolbarButton: '='
    };

    public static Factory = () => {
        let directive: ng.IDirectiveFactory = () => new ToolbarButton();
        directive.$inject = [];
        return directive;
    };
}
