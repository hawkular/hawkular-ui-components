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
interface IToolbarViewBindings {
  toolbarViews: any;
  onItemClick: (args: {item: any}) => void;
}
class ToolbarViewController implements IToolbarViewBindings {
  public toolbarViews: any;
  public onItemClick: (args: {item: any}) => void;
}

export default class ToolbarView {
  public replace: boolean = false;
  public template = require<string>('./toolbar-view.html');
  public controller: any = ToolbarViewController;
  public controllerAs: string = 'vm';
  public bindings: any = {
    toolbarViews: '<',
    onItemClick: '&'
  };
}
