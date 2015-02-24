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


var HawkularAlerts;
(function (HawkularAlerts) {
    HawkularAlerts.pluginName = "hawkular-alerts";
    HawkularAlerts.log = Logger.get(HawkularAlerts.pluginName);
    HawkularAlerts.templatePath = "plugins/alerts/html";
})(HawkularAlerts || (HawkularAlerts = {}));

var HawkularAlerts;
(function (HawkularAlerts) {
    HawkularAlerts._module = angular.module(HawkularAlerts.pluginName, []);
    var tab = undefined;
    HawkularAlerts._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, builder) {
        tab = builder.create().id(HawkularAlerts.pluginName).title(function () { return "Alerts"; }).href(function () { return "/alerts"; }).subPath("Alerts", "alerts", builder.join(HawkularAlerts.templatePath, 'alerts.html')).build();
        builder.configureRouting($routeProvider, tab);
        $locationProvider.html5Mode(true);
    }]);
    HawkularAlerts._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(tab);
    }]);
    hawtioPluginLoader.addModule(HawkularAlerts.pluginName);
})(HawkularAlerts || (HawkularAlerts = {}));

var HawkularAlerts;
(function (HawkularAlerts) {
    HawkularAlerts.AlertsController = HawkularAlerts._module.controller("HawkularAlerts.AlertsController", ['$scope', function ($scope) {
        $scope.alerts = [
            { name: "Out of Memory Alert", priority: 2 },
            { name: "Out of Disk Space", priority: 1 },
            { name: "CPU High", priority: 3 }
        ];
    }]);
})(HawkularAlerts || (HawkularAlerts = {}));

angular.module("hawkular-ui-components-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/alerts/html/alerts.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"HawkularAlerts.AlertsController\">\n    <h1>Alerts</h1>\n      <ul class=\"list-group\" ng-repeat=\"alert in alerts | orderBy:priority:true\">\n          <li class=\"list-group-item\">{{alert.name}}</li>\n      </ul>\n\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("hawkular-ui-components-templates");