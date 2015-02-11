/// <reference path="../../includes.ts"/>
/// <reference path="metricsGlobals.ts"/>

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

    export var _module = angular.module(HawkularMetrics.pluginName, ['rhqmCharts']);

    var metricsTab:any;

    _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider:ng.route.IRouteProvider, navBuilder:HawtioMainNav.BuilderFactory) => {

        metricsTab = navBuilder.create()
            .id(HawkularMetrics.pluginName)
            .title(() => "Metrics")
            .href(() => "/metrics")
            .subPath("Graphs", "graphs", navBuilder.join(HawkularMetrics.templatePath, 'graphs.html'))
            .subPath("Advanced", "advanced", navBuilder.join(HawkularMetrics.templatePath, 'advanced.html'))
            .subPath("Config", "config", navBuilder.join(HawkularMetrics.templatePath, 'config.html'))
            .build();

        navBuilder.configureRouting($routeProvider, metricsTab);

        $locationProvider.html5Mode(true);
    }]);

    _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
        HawtioNav.add(metricsTab);
        log.debug("loaded Metrics Plugin");
    }]);


    hawtioPluginLoader.addModule(HawkularMetrics.pluginName);
}
