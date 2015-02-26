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
    Inventory._module = angular.module(Inventory.pluginName, ['ngResource', 'hawkular.services', 'hawkularCharts']);
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
    Inventory.InventoryController = Inventory._module.controller("Inventory.InventoryController", ['$scope', '$rootScope', 'HawkularInventory', 'HawkularMetric', function ($scope, $rootScope, hkInventory, hkMetric) {
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
                hkMetric.NumericMetricData.get({ tenantId: _tenantId, numericId: _metricId, buckets: 60 }, function (data) {
                    $rootScope.metricData = data;
                });
            }
        };
        $scope.closeChart = function () {
            delete $rootScope.metricData;
        };
    }]);
})(Inventory || (Inventory = {}));

angular.module("hawkular-ui-components-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/inventory/html/inventory.html","<div ng-controller=\"Inventory.InventoryController\">\n\n    <hr>\n\n    <!-- Dropdown View -->\n    <div class=\"row\">\n        <div class=\" col-md-4\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                    <h3 class=\"panel-title\"><i class=\"fa fa-user\"></i> Tenant</h3>\n                </div>\n                <div class=\"panel-body\">\n                    <form role=\"form\" class=\"search-pf has-button\">\n                        <div class=\"form-group has-clear\">\n                            <div class=\"search-pf-input-group\">\n                                <label for=\"tenantId\" class=\"sr-only\">Tenant</label>\n                                <input id=\"tenantId\" type=\"search\" class=\"form-control\" placeholder=\"Tenant ID\" ng-model=\"tenantId\" autofocus>\n                                <button type=\"button\" class=\"clear\" aria-hidden=\"true\" ng-click=\"tenantId = \'\'\"><span class=\"pficon pficon-close\"></span></button>\n                            </div>\n                        </div>\n                        <div class=\"form-group\">\n                            <button class=\"btn btn-default\" type=\"button\" ng-click=\"queryResources()\"><span class=\"fa fa-search\"></span></button>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n        <div class=\" col-md-4\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                    <h3 class=\"panel-title\"><i class=\"fa fa-cube\"></i> Resource <span class=\"pull-right\" ng-show=\"tenantId && resources\"><a href=\"#\" ng-click=\"showTable = !showTable\"><span ng-hide=\"showTable\">Show</span><span ng-show=\"showTable\">Hide</span> all</a></span></h3>\n                </div>\n                <div class=\"panel-body\">\n                    <select class=\"form-control\" ng-options=\"resource.id as resource.parameters.url + \' (\' +resource.id + \')\' for resource in resources\" ng-model=\"resourceId\" ng-disabled=\"!tenantId || !resources\" ng-hide=\"resources.length === 0\" ng-change=\"queryMetrics()\"></select>\n                    <span ng-show=\"resources.length === 0\"><i class=\"fa fa-warning\"></i> No Resources Available</span>\n                </div>\n            </div>\n        </div>\n        <div class=\" col-md-4\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                    <h3 class=\"panel-title\"><i class=\"fa fa-line-chart\"></i> Metric</h3>\n                </div>\n                <div class=\"panel-body\">\n                    <select class=\"form-control\" ng-options=\"metric.name as metric.name for metric in metrics\" ng-model=\"metricId\" ng-disabled=\"!tenantId || !resourceId\" ng-hide=\"metrics.length === 0\"></select>\n                    <span ng-show=\"metrics.length === 0\"><i class=\"fa fa-warning\"></i> No Metrics Available</span>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col-md-offset-10\">\n            <a href=\"\" class=\"btn btn-primary btn-lg\" ng-click=\"showMetric()\"><i class=\"fa fa-line-chart\" ng-disabled=\"!metricId\"></i> Show Metric</a>\n        </div>\n    </div>\n\n    <!-- Table View -->\n    <div class=\"row\" ng-show=\"tenantId && showTable\">\n        <div class=\"col-md-12\">\n            <h1>Resources</h1>\n            <table class=\"table table-condensed\">\n                <thead>\n                    <th>Resource ID</th>\n                    <th>Resource Type</th>\n                    <th>Parameters</th>\n                    <th>Metrics</th>\n                </thead>\n                <tr ng-repeat=\"resource in resources\">\n                    <td>{{resource.id}}</td>\n                    <td>{{resource.type}}</td>\n                    <td>\n                        <dl class=\"dl-horizontal\" ng-repeat=\"(name, value) in resource.parameters\">\n                          <dt>{{name}}</dt>\n                          <dd>{{value}}</dd>\n                        </dl>\n                    </td>\n                    <td >\n                        <table>\n                            <tr ng-repeat=\"metric in resource.metrics\">\n                                <td>{{metric.name}} <button class=\"btn btn-primary btn-xs\" ng-click=\"showMetric(tenantId, resource.id, metric.name)\"> <i class=\"fa fa-area-chart\"></i> </button></td>\n                            </tr>\n                        </table>\n                    </td>\n                </tr>\n            </table>\n        </div>\n    </div>\n\n    <!-- Chart View -->\n    <div class=\"row\" ng-show=\"metricData\">\n        <hr>\n        <div class=\"col-md-12\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                    <h3 class=\"panel-title\">{{metricData.tenantId}} / {{metricData.name}} <span class=\"pull-right\" ng-click=\"closeChart()\"><i class=\"pficon pficon-close\"></i></span></h3>\n                </div>\n                <div class=\"panel-body\" style=\"height: 280px;\">\n                  <hawkular-chart data=\"{{metricData.data}}\" chart-type=\"bar\" chart-height=\"250\" chart-width=\"1000px\"></hawkular-chart>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");}]); hawtioPluginLoader.addModule("hawkular-ui-components-templates");