/// <reference path="../../includes.ts"/>
/// <reference path="inventoryGlobals.ts"/>
module Inventory {

    export var _module = angular.module(Inventory.pluginName, []);

    var tab = undefined;

    _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider:ng.route.IRouteProvider, builder:HawtioMainNav.BuilderFactory) => {
        tab = builder.create()
            .id(Inventory.pluginName)
            .title(() => "Inventory")
            .href(() => "/inventory")
            .subPath("Inventory List", "Inventory", builder.join(Inventory.templatePath, 'inventory.html'))
            .build();
        builder.configureRouting($routeProvider, tab);
        $locationProvider.html5Mode(true);
    }]);

    _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
        HawtioNav.add(tab);
    }]);


    hawtioPluginLoader.addModule(Inventory.pluginName);
}
