/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.

/// <reference path="accountsPlugin.ts"/>
/**
 * Attention: this class will probably be replaced by the proper hawt.io Keycloak integration.
 * While it's not done, we are doing the integration by ourselves.
 */
module HawkularAccounts {

    export class AuthService {
        public static $inject = ['$rootScope', '$window'];
        constructor(private $rootScope:ng.IRootScopeService, private $window:ng.IWindowService) {
          this.onReady(() => {
            this.$rootScope['username'] = this.keycloak().idTokenParsed.name;
          });
        }

        private keycloak():any {
            return this.$window['keycloak'];
        }

        onReady(callback):any {
            if (this.$window['keycloakReady'] === true) {
                callback();
            } else {
              this.keycloak().onReady = () => {
                this.$window['keycloakReady'] = true;
                callback();
              };
            }
        }

        logout():void {
            return this.keycloak().logout();
        }

        updateToken(periodicity:number):any {
            return this.keycloak().updateToken(periodicity);
        }

        token():string {
            return this.keycloak().token;
        }

        isAuthenticated():boolean {
            return this.keycloak() && this.keycloak().authenticated;
        }
    }

    _module.service('Auth', AuthService);
}
