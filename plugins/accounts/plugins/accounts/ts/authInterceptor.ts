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

    export class AuthInterceptorService {
        public static $inject = ['$q', 'Auth'];

        public static Factory($q:ng.IQService, Auth:HawkularAccounts.AuthService) {
            return new AuthInterceptorService($q, Auth);
        }

        constructor(private $q:ng.IQService, private Auth:HawkularAccounts.AuthService) {
        }

        request = (request) => {
            console.debug('Intercepting request');
            var BASE_URL = "http://localhost:8080/hawkular-";
            var addBearer, deferred;
            if (request.url.indexOf(BASE_URL) === -1) {
                console.debug('The requested URL is not part of the base URL. Base URL: ' + BASE_URL + ', requested URL: ' + request.url);
                return request;
            }
            addBearer = () => {
                return this.Auth.updateToken(5).success(() => {
                        var token = this.Auth.token();
                        console.debug('Adding bearer token to the request: ' + token);
                        request.headers.Authorization = 'Bearer ' + token;
                        deferred.notify();
                        return deferred.resolve(request);
                    }).error(() => {
                        console.log("Couldn't update token");
                    });
            };
            deferred = this.$q.defer();
            this.Auth.onReady(addBearer);
            return this.$q.when(deferred.promise);
        };

        responseError = (rejection) => {
            console.debug('Intercepting error response');
            if (rejection.status === 401) {
                // TODO: notify the user that the session is expired
                this.Auth.logout();
            }
            return this.$q.reject(rejection);
        };
    }

    _module.config(function($httpProvider) {
        console.debug('Adding AuthInterceptor');
        return $httpProvider.interceptors.push(HawkularAccounts.AuthInterceptorService.Factory);
    });
}
