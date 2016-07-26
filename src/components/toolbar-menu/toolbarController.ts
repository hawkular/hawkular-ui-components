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
export default class ToolbarController {
  public toolbarItems: any;
  public toolbarViews: any;
  /*@ngInject*/
  constructor(private $window: ng.IWindowService,
              private $location: ng.ILocationService,
              private $sce: ng.ISCEService) {
  }

  public onItemClick(item: any, $event: any) {
    if (item.hasOwnProperty('actionUrl')) {
      this.$location.path(item.actionUrl);
    } else if (item.hasOwnProperty('redirectUrl')) {
      this.$window.location = item.redirectUrl;
    } else if (item.hasOwnProperty('actionFunction')) {
      item.actionFunction();
    } else if (item.hasOwnProperty('eventFunction')) {
      item.eventFunction($event);
    }
  }

  public hasContent(toolbarItem): boolean {
    return toolbarItem && toolbarItem.filter((item) => {
      return item && (ToolbarController.isButtonOrSelect(item) || ToolbarController.isCustom(item));
    }).length !== 0;
  }

  public trustAsHtml(escapedString) {
    escapedString = ToolbarController.htmlDecode(escapedString).replace(/&quot;/g, '"');
    return this.$sce.trustAsHtml(escapedString);
  }

  private static htmlDecode(input): string {
    let e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
  }

  private static isCustom(item): boolean {
    return item.name && item.name === 'custom';
  }

  private static isButtonOrSelect(item): boolean {
    return item.type && ToolbarController.isButtonSelect(item) || ToolbarController.isButton(item);
  }

  private static isButtonSelect(item): boolean {
    return item.type === 'buttonSelect';
  }

  private static isButton(item): boolean {
    return item.type === 'button';
  }
}
