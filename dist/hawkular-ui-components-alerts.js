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

angular.module("hawkular-ui-components-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/index.html","<!DOCTYPE html>\n<html>\n\n  <head>\n    <title>hawkular-alerts</title>\n    <base href=\'/\'></base>\n    <meta charset=\"UTF8\">\n\n\n    <link rel=\"stylesheet\" href=\"libs/bootstrap/dist/css/bootstrap.css\" />\n    <link rel=\"stylesheet\" href=\"libs/patternfly/dist/css/patternfly.css\" />\n\n    <!-- bower:css -->\n    <!-- endbower -->\n\n    <!-- ES6/ES6 shim -->\n    <!--[if IE 8]>\n    <script src=\"libs/es5-dom-shim/__COMIPLE/a.ie8.js\"></script>\n    <![endif]-->\n    <script src=\"libs/es5-dom-shim/__COMPILE/a.js\"></script>\n\n    <!-- bower:js -->\n    <script src=\"libs/jquery/dist/jquery.js\"></script>\n    <script src=\"libs/angular/angular.js\"></script>\n    <script src=\"libs/angular-sanitize/angular-sanitize.js\"></script>\n    <script src=\"libs/js-logger/src/logger.js\"></script>\n    <script src=\"libs/hawtio-core/hawtio-core.js\"></script>\n    <script src=\"libs/lodash/dist/lodash.compat.js\"></script>\n    <script src=\"libs/angular-route/angular-route.js\"></script>\n    <script src=\"libs/hawtio-core-navigation/dist/hawtio-core-navigation.js\"></script>\n    <script src=\"libs/uri.js/src/URI.js\"></script>\n    <script src=\"libs/uri.js/src/IPv6.js\"></script>\n    <script src=\"libs/uri.js/src/SecondLevelDomains.js\"></script>\n    <script src=\"libs/uri.js/src/punycode.js\"></script>\n    <script src=\"libs/uri.js/src/URITemplate.js\"></script>\n    <script src=\"libs/uri.js/src/jquery.URI.js\"></script>\n    <script src=\"libs/uri.js/src/URI.min.js\"></script>\n    <script src=\"libs/uri.js/src/jquery.URI.min.js\"></script>\n    <script src=\"libs/uri.js/src/URI.fragmentQuery.js\"></script>\n    <script src=\"libs/uri.js/src/URI.fragmentURI.js\"></script>\n    <script src=\"libs/hawtio-utilities/dist/sugar.js\"></script>\n    <script src=\"libs/hawtio-utilities/dist/angular-file-upload.js\"></script>\n    <script src=\"libs/hawtio-utilities/dist/hawtio-utilities.js\"></script>\n    <!-- endbower -->\n\n    <script src=\"libs/bootstrap/dist/js/bootstrap.js\"></script>\n    <script src=\"libs/patternfly/dist/js/patternfly.js\"></script>\n\n  </head>\n\n  <body>\n    <nav class=\"navbar navbar-default navbar-pf\" role=\"navigation\">\n      <ul class=\"nav navbar-nav navbar-primary\" hawtio-main-nav></ul>\n      <ul class=\"nav navbar-nav\" hawtio-sub-tabs></ul>\n    </nav>\n\n    <div id=\"main\" class=\"container-fluid ng-cloak\" ng-controller=\"HawtioNav.ViewController\">\n      <div ng-include src=\"viewPartial\"></div>\n    </div>\n\n    <!-- add any scripts under dist/ here -->\n    <script src=\"dist/hawkular-alerts.js\"></script>\n\n  </body>\n</html>\n");}]); hawtioPluginLoader.addModule("hawkular-ui-components-templates");