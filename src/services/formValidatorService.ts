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
export interface IValidationResponse {
  isValid: boolean;
  errorMsg: string;
  formObject: any;
}

export interface IFormValidatorService {
  validateObject(dataObject: any): ng.IPromise<IValidationResponse>;
  saveObject(dataObject: any): ng.IPromise<IValidationResponse>;
}

export interface IValidatorService extends IFormValidatorService {
  $http: any;
  MiQDataAccessService: any;
}

export default class FormValidatorService implements IValidatorService {
  public $http: any;
  public MiQDataAccessService: any;
  public endpoints = {
    validate : '/validate',
    create: '/create'
  };

  public validateObject(dataObject: any): ng.IPromise<IValidationResponse> {
    return this.httpPost(this.MiQDataAccessService.getUrlPrefix() + this.endpoints.validate, dataObject);
  }

  public saveObject(dataObject: any): ng.IPromise<IValidationResponse> {
    return this.httpPost(this.MiQDataAccessService.getUrlPrefix() + this.endpoints.create, dataObject);
  }

  private httpPost(url: string, dataObject: any): ng.IPromise<IValidationResponse> {
    return this.$http.post(url, dataObject).then( (validationData: any) => {
      return {
        isValid: validationData.data.result,
        errorMsg: validationData.data.details,
        formObject: validationData.data.ems_object
      };
    });
  }

  /*@ngInject*/
  public $get($http: any, MiQDataAccessService: any) : IFormValidatorService {
    this.$http = $http;
    this.MiQDataAccessService = MiQDataAccessService;
    return {
      validateObject: (data) => this.validateObject(data),
      saveObject: (data) => this.saveObject(data)
    };
  }
}
