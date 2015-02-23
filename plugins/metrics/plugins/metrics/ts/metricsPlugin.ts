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

/// <reference path="../../includes.ts"/>
/// <reference path="metricsGlobals.ts"/>

module HawkularMetrics {

    export var _module = angular.module(HawkularMetrics.pluginName, ['ngResource','hawkularCharts', 'hawkular.services']);

    var metricsTab:any;

    _module.config(['$httpProvider','$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($httpProvider, $locationProvider, $routeProvider:ng.route.IRouteProvider, navBuilder:HawtioMainNav.BuilderFactory) => {

        /// enable CORS
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        metricsTab = navBuilder.create()
            .id(HawkularMetrics.pluginName)
            .title(() => "Metrics")
            .href(() => "/metrics")
            .subPath("Add Url", "addUrl", navBuilder.join(HawkularMetrics.templatePath, 'add-url.html'))
            .subPath("Metrics Selection", "metricsSelection", navBuilder.join(HawkularMetrics.templatePath, 'metrics-selection.html'))
            .subPath("Overview", "overview", navBuilder.join(HawkularMetrics.templatePath, 'overview.html'))
            .subPath("Metrics View", "metricsView", navBuilder.join(HawkularMetrics.templatePath, 'metrics-view.html'))
            .build();

        navBuilder.configureRouting($routeProvider, metricsTab);

        $locationProvider.html5Mode(true);
    }]);

    _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
        HawtioNav.add(metricsTab);
        log.debug("loaded Metrics Plugin");
    }]);

    _module.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });


    hawtioPluginLoader.addModule(HawkularMetrics.pluginName);
}
