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

///<reference path="../tsd.d.ts"/>
export default class ValidateCredentialsController {
  public modelHolder: any;
  public modelName: string;
  public validateAction: (args: {validateData: any}) => void;

  public onValidate() {
    this.validateAction({validateData: this.modelHolder});
  }

  public getValidateClass() {
    return {
      disabled: !this.isActive()
    };
  }

  public isActive() {
    if (this.modelHolder) {
      return ValidateCredentialsController.notEmpty(this.modelHolder[this.modelName + '_userid']) &&
        ValidateCredentialsController.notEmpty(this.modelHolder[this.modelName + '_password']) &&
        ValidateCredentialsController.notEmpty(this.modelHolder[this.modelName + '_verify']);
    } else {
      return false;
    }
  }

  private static notEmpty(item) {
    return item !== undefined && item !== '';
  }
}
