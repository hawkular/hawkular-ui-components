/// <reference path="../libs/hawtio-utilities/defs.d.ts"/>

/// <reference path="../../includes.ts"/>
var Inventory;
(function (Inventory) {
    Inventory.pluginName = "inventory";
    Inventory.log = Logger.get(Inventory.pluginName);
    Inventory.templatePath = "plugins/inventory/html";
})(Inventory || (Inventory = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="inventoryGlobals.ts"/>
var Inventory;
(function (Inventory) {
    Inventory._module = angular.module(Inventory.pluginName, []);
    var tab = undefined;
    Inventory._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, builder) {
        tab = builder.create().id(Inventory.pluginName).title(function () { return "Inventory"; }).href(function () { return "/inventory"; }).subPath("Inventory List", "Inventory", builder.join(Inventory.templatePath, 'inventory.html')).build();
        builder.configureRouting($routeProvider, tab);
        $locationProvider.html5Mode(true);
    }]);
    Inventory._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(tab);
    }]);
    hawtioPluginLoader.addModule(Inventory.pluginName);
})(Inventory || (Inventory = {}));

/// <reference path="inventoryPlugin.ts"/>
var Inventory;
(function (Inventory) {
    Inventory.InventoryController = Inventory._module.controller("Inventory.InventoryController", ['$scope', function ($scope) {
        $scope.inventory = [
            { resourceId: "cpu0.rh1001", resourceName: "CPU0 on RH1001" },
            { resourceId: "cpu2.rh1001", resourceName: "CPU2 on RH1001" },
            { resourceId: "cpu1.rh1001", resourceName: "CP10 on RH1001" }
        ];
    }]);
})(Inventory || (Inventory = {}));

angular.module("hawkular-inventory-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/inventory/html/inventory.html","<div class=\"row\">\n    <div class=\"col-md-12\" ng-controller=\"Inventory.InventoryController\">\n        <h1>Inventory List</h1>\n        <ul class=\"list-group\" ng-repeat=\"inventoryItem in inventory\">\n            <li class=\"list-group-item\">{{inventoryItem.resourceName}}</li>\n        </ul>\n    </div>\n</div>\n\n");}]); hawtioPluginLoader.addModule("hawkular-inventory-templates");