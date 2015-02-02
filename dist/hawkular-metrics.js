/// <reference path="../libs/hawtio-utilities/defs.d.ts"/>
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
var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics.pluginName = "hawkular-metrics";
    HawkularMetrics.log = Logger.get(HawkularMetrics.pluginName);
    HawkularMetrics.templatePath = "plugins/metrics/html";
})(HawkularMetrics || (HawkularMetrics = {}));

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
var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics._module = angular.module(HawkularMetrics.pluginName, []);
    var metricsTab;
    HawkularMetrics._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, navBuilder) {
        metricsTab = navBuilder.create().id(HawkularMetrics.pluginName).title(function () { return "Metrics"; }).href(function () { return "/metrics"; }).subPath("Config", "config", navBuilder.join(HawkularMetrics.templatePath, 'config.html')).subPath("Graphs", "graphs", navBuilder.join(HawkularMetrics.templatePath, 'graphs.html')).subPath("Advanced", "advanced", navBuilder.join(HawkularMetrics.templatePath, 'advanced.html')).build();
        navBuilder.configureRouting($routeProvider, metricsTab);
        $locationProvider.html5Mode(true);
    }]);
    HawkularMetrics._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(metricsTab);
        HawkularMetrics.log.debug("loaded");
        console.warn("loaded");
    }]);
    hawtioPluginLoader.addModule(HawkularMetrics.pluginName);
})(HawkularMetrics || (HawkularMetrics = {}));

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
var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics.AdvancedController = HawkularMetrics._module.controller("HawkularMetrics.AdvancedController", ['$scope', function ($scope) {
        $scope.advancedName = "Advanced Stuff";
    }]);
})(HawkularMetrics || (HawkularMetrics = {}));

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
var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics.ConfigController = HawkularMetrics._module.controller("HawkularMetrics.ConfigController", ['$scope', function ($scope) {
        $scope.configName = "My Configuration";
    }]);
})(HawkularMetrics || (HawkularMetrics = {}));

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
var HawkularMetrics;
(function (HawkularMetrics) {
    HawkularMetrics.MetricsController = HawkularMetrics._module.controller("HawkularMetrics.MetricsController", ['$scope', function ($scope) {
        $scope.searchId = "";
    }]);
})(HawkularMetrics || (HawkularMetrics = {}));

angular.module("hawkular-metrics-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/metrics/html/advanced.html","<div class=\"row\" ng-controller=\"HawkularMetrics.AdvancedController\">\n    <div class=\"col-md-12\">\n        <h1>Advanced Settings: {{advancedName}}</h1>\n       TBD\n    </div>\n</div>\n");
$templateCache.put("plugins/metrics/html/config.html","<div class=\"row\" ng-controller=\"HawkularMetrics.ConfigController\">\n    <div class=\"col-md-12\">\n        <h1>Metrics Graph Config</h1>\n        <h3>{{configName}}</h3>\n       TBD\n    </div>\n</div>\n");
$templateCache.put("plugins/metrics/html/graphs.html","<div class=\"row\" ng-controller=\"HawkularMetrics.MetricsController\">\n    <div class=\"col-md-12\">\n        <h1>Hawkular Metrics Graphs</h1>\n    </div>\n    <div class=\"col-md-8\" ng-controller=\"HawkularMetrics.MetricsController\">\n        <form class=\"form-horizontal\" name=\"chartForm\" role=\"form\" novalidate>\n\n            <div class=\"form-group\">\n                <label class=\"col-sm-2 control-label\">ID</label>\n\n                <div class=\"col-sm-5\">\n                    <input type=\"text\" class=\"form-control\" name=\"searchId\" ng-model=\"searchId\"\n                           placeholder=\"Enter Id...\" required ng-minlength=\"1\">\n                        <span class=\"error-message\"\n                              ng-show=\"chartForm.searchId.$dirty && chartForm.searchId.$error.required\"> * Required.</span>\n                    <span class=\"help-block\">Example: 100, apache3.cpu1  </span>\n                </div>\n            </div>\n        </form>\n    </div>\n</div>\n");}]); hawtioPluginLoader.addModule("hawkular-metrics-templates");