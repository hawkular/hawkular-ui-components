/// <reference path="metricsPlugin.ts"/>

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

module HawkularMetrics {

    export class AddUrlController {
        public static  $inject = ['$scope', '$log'];

        constructor(private $scope:any,
                    private $log:ng.ILogService,
                    public resourceUrl:string) {
            $scope.vm = this;
            this.resourceUrl = '';

            $scope.$watch('vm.resourceUrl', (newValue)  => {
                if(angular.isDefined(newValue)){
                    this.$log.debug("Add New Resource Url: " + newValue);
                }
            });

        }

        addUrl(url:string):void {
            this.$log.debug("Adding Url to backend: "+ url);
        }

    }

    _module.controller('HawkularMetrics.AddUrlController', AddUrlController);

}
