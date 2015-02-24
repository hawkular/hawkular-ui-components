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


var Inventory;
(function (Inventory) {
    Inventory.pluginName = "inventory";
    Inventory.log = Logger.get(Inventory.pluginName);
    Inventory.templatePath = "plugins/inventory/html";
})(Inventory || (Inventory = {}));

var Inventory;
(function (Inventory) {
    Inventory._module = angular.module(Inventory.pluginName, ['ngResource', 'hawkular.services']);
    var tab = undefined;
    Inventory._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', 'HawkularInventoryProvider', function ($locationProvider, $routeProvider, builder, HawkularInventoryProvider) {
        tab = builder.create().id(Inventory.pluginName).title(function () { return "Inventory"; }).href(function () { return "/inventory"; }).subPath("Inventory List", "Inventory", builder.join(Inventory.templatePath, 'inventory.html')).build();
        builder.configureRouting($routeProvider, tab);
        $locationProvider.html5Mode(true);
    }]);
    Inventory._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(tab);
    }]);
    hawtioPluginLoader.addModule(Inventory.pluginName);
})(Inventory || (Inventory = {}));

var Inventory;
(function (Inventory) {
    Inventory.InventoryController = Inventory._module.controller("Inventory.InventoryController", ['$scope', '$rootScope', 'HawkularInventory', function ($scope, $rootScope, hkInventory) {
        $scope.queryResources = function () {
            if (this.tenantId) {
                this.resources = hkInventory.Resource.query({ tenantId: this.tenantId, type: 'URL' }, function (data) {
                    angular.forEach(data, function (value) {
                        value.metrics = hkInventory.Metric.query({ tenantId: $scope.tenantId, resourceId: value.id });
                    });
                });
            }
        };
        $scope.queryMetrics = function () {
            if (this.tenantId && this.resourceId) {
                this.metrics = hkInventory.Metric.query({ tenantId: this.tenantId, resourceId: this.resourceId });
            }
        };
        $scope.showMetric = function (tenantId, resourceId, metricId) {
            var _tenantId = tenantId || this.tenantId;
            var _resourceId = resourceId || this.resourceId;
            var _metricId = metricId || this.metricId;
            if (_tenantId && _resourceId && _metricId) {
                $rootScope.metricData = hkInventory.Metric.query({ tenantId: _tenantId, resourceId: _resourceId, metricId: _metricId });
                $rootScope.metricData.tenantId = _tenantId;
                $rootScope.metricData.resourceId = _resourceId;
                $rootScope.metricData.metricId = _metricId;
            }
        };
        $scope.closeChart = function () {
            delete $rootScope.metricData;
        };
    }]);
})(Inventory || (Inventory = {}));

angular.module("hawkular-ui-components-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/index.html","<!DOCTYPE html>\n<html>\n\n  <head>\n    <title>hawkular-inventory</title>\n    <base href=\'/\'></base>\n    <meta charset=\"UTF8\">\n\n\n    <link rel=\"stylesheet\" href=\"libs/bootstrap/dist/css/bootstrap.css\" />\n    <link rel=\"stylesheet\" href=\"libs/patternfly/dist/css/patternfly.css\" />\n\n    <!-- bower:css -->\n    <!-- endbower -->\n\n    <!-- ES6/ES6 shim -->\n    <!--[if IE 8]>\n    <script src=\"libs/es5-dom-shim/__COMIPLE/a.ie8.js\"></script>\n    <![endif]-->\n    <script src=\"libs/es5-dom-shim/__COMPILE/a.js\"></script>\n\n    <!-- bower:js -->\n    <script src=\"libs/jquery/dist/jquery.js\"></script>\n    <script src=\"libs/angular/angular.js\"></script>\n    <script src=\"libs/angular-sanitize/angular-sanitize.js\"></script>\n    <script src=\"libs/js-logger/src/logger.js\"></script>\n    <script src=\"libs/hawtio-core/hawtio-core.js\"></script>\n    <script src=\"libs/lodash/dist/lodash.compat.js\"></script>\n    <script src=\"libs/angular-route/angular-route.js\"></script>\n    <script src=\"libs/hawtio-core-navigation/dist/hawtio-core-navigation.js\"></script>\n    <script src=\"libs/uri.js/src/URI.js\"></script>\n    <script src=\"libs/uri.js/src/IPv6.js\"></script>\n    <script src=\"libs/uri.js/src/SecondLevelDomains.js\"></script>\n    <script src=\"libs/uri.js/src/punycode.js\"></script>\n    <script src=\"libs/uri.js/src/URITemplate.js\"></script>\n    <script src=\"libs/uri.js/src/jquery.URI.js\"></script>\n    <script src=\"libs/uri.js/src/URI.min.js\"></script>\n    <script src=\"libs/uri.js/src/jquery.URI.min.js\"></script>\n    <script src=\"libs/uri.js/src/URI.fragmentQuery.js\"></script>\n    <script src=\"libs/uri.js/src/URI.fragmentURI.js\"></script>\n    <script src=\"libs/hawtio-utilities/dist/sugar.js\"></script>\n    <script src=\"libs/hawtio-utilities/dist/angular-file-upload.js\"></script>\n    <script src=\"libs/hawtio-utilities/dist/hawtio-utilities.js\"></script>\n    <!-- endbower -->\n\n    <script src=\"libs/bootstrap/dist/js/bootstrap.js\"></script>\n    <script src=\"libs/patternfly/dist/js/patternfly.js\"></script>\n    <script src=\"libs/angular-resource/angular-resource.js\"></script>\n    <script src=\"libs/hawkular-ui-services/dist/hawkular-ui-service.js\"></script>\n\n  </head>\n\n  <body>\n    <nav class=\"navbar navbar-default navbar-pf\" role=\"navigation\">\n      <ul class=\"nav navbar-nav navbar-primary\" hawtio-main-nav></ul>\n      <ul class=\"nav navbar-nav\" hawtio-sub-tabs></ul>\n    </nav>\n\n    <div id=\"main\" class=\"container-fluid ng-cloak\" ng-controller=\"HawtioNav.ViewController\">\n      <div ng-include src=\"viewPartial\"></div>\n    </div>\n\n    <!-- add any scripts under dist/ here -->\n    <script src=\"dist/hawkular-inventory.js\"></script>\n\n  </body>\n</html>\n");}]); hawtioPluginLoader.addModule("hawkular-ui-components-templates");