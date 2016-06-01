
///<reference path="../tsd.d.ts"/>
export interface  IProviderState {
  addProviderStates(states, statePrefix?): void;
  getProviderTypes(statePrefix): ng.IPromise<any[]>;
}

export default class NewProviderState implements ng.IServiceProvider {
  private $http: ng.IHttpService;
  private MiQDataAccessService: any;
  private $state: any;
  public $stateProvider: any;
  public endpoints = {
    types : '/types'
  };

  public addProviderStates(states) {
    _.each(states, (oneState: any) => {
      if (!this.$state.get(oneState.stateId)) {
        this.$stateProvider.state(oneState.stateId, {
          views: _.mapValues(oneState.views, (value) => {
            return {'templateUrl': value};
          })
        });
      }
    });
  }

  public getProviderTypes(statePrefix): ng.IPromise<any[]> {
    return this.httpGet(this.MiQDataAccessService.getUrlPrefix() + this.endpoints.types).then((typesData: any) => {
      _.each(typesData, (type) => {
        type.stateId = statePrefix + '.' + type.id;
      });
      return typesData;
    });
  }

  private httpGet(url, requestData?) {
    return this.$http.get(url, requestData).then((responseData) => {
      return responseData.data;
    });
  }

  /*@ngInject*/
  public $get($http: any, $state: any, MiQDataAccessService: any) : IProviderState {
    this.$http = $http;
    this.$state = $state;
    this.MiQDataAccessService = MiQDataAccessService;
    return {
      addProviderStates: (states) => this.addProviderStates(states),
      getProviderTypes: (statePrefix) => this.getProviderTypes(statePrefix)
    };
  }
}
