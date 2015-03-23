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

  export var _module = angular.module(HawkularMetrics.pluginName, ['ngResource', 'ui.select', 'hawkularCharts',
    'hawkular.services', 'ui.bootstrap', 'topbar', 'patternfly.select']);

  var metricsTab:any;

  _module.config(['$httpProvider', '$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($httpProvider, $locationProvider, $routeProvider:ng.route.IRouteProvider, navBuilder:HawtioMainNav.BuilderFactory) => {

    metricsTab = navBuilder.create()
      .id(HawkularMetrics.pluginName)
      .title(() => 'Metrics')
      .href(() => '/metrics')
      .subPath('Add Url', 'addUrl', navBuilder.join(HawkularMetrics.templatePath, 'add-url.html'))
      .subPath('Home', 'home', navBuilder.join(HawkularMetrics.templatePath, 'home.html'))
      .subPath('Response Time', 'responseTime', navBuilder.join(HawkularMetrics.templatePath, 'response-time.html'))
      .subPath('Up/Downtime', 'upDowntime', navBuilder.join(HawkularMetrics.templatePath, 'up-downtime.html'))
      .subPath('Alerts', 'alerts', navBuilder.join(HawkularMetrics.templatePath, 'alerts.html'))
      .build();

    navBuilder.configureRouting($routeProvider, metricsTab);

    $locationProvider.html5Mode(true);
  }]);

  _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
    HawtioNav.add(metricsTab);
    log.debug('loaded Metrics Plugin');
  }]);

  ///@todo: move this someplace common
  _module.directive('hkEnter', () => {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', (event) => {
        if (event.which === 13) {
          scope.$apply(() => {
            scope.$eval(attrs.hkEnter);
          });

          event.preventDefault();
        }
      });
    };
  });

  _module.config(["$routeProvider", ($routeProvider) => {
    $routeProvider.
        when('/metrics/responseTime', {templateUrl: 'plugins/metrics/html/response-time.html',
        resolve: {
          hkResourceList : function($filter, $location, $q, HawkularInventory) {
            var resPromise = HawkularInventory.Resource.query({tenantId: globalTenantId}).$promise;
            resPromise.then(function(hkResourceList){
              $location.path('/metrics/responseTime/' + hkResourceList[0].id);
            }, function(){
              $location.url('/error');
            });

            // Returning a promise which would never be resolved, so that the page would not render.
            // The page will be redirected before rendering based on the resource list loaded above.
            return $q.defer().promise;
          }
        }}).
        when('/metrics/responseTime/:resourceId/', {templateUrl: 'plugins/metrics/html/response-time.html'}).
        when('/metrics/responseTime/:resourceId/:rangeStart', {templateUrl: 'plugins/metrics/html/response-time.html'}).
        when('/metrics/responseTime/:resourceId/:rangeStart/:rangeEnd', {templateUrl: 'plugins/metrics/html/response-time.html'}).
        when('/metrics/availability/:resourceId', {templateUrl: 'plugins/metrics/html/response-time.html'}).
        when('/metrics/alerts/:resourceId', {templateUrl: 'plugins/metrics/html/alerts.html'});
  }]);

  hawtioPluginLoader.addModule(HawkularMetrics.pluginName);
}
