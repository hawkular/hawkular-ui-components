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
/// <reference path="accountsGlobals.ts"/>
module HawkularAccounts {
    export var _module = angular.module(HawkularAccounts.pluginName, []);
    var accountsTab:any = undefined;

    _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider:ng.route.IRouteProvider, builder:HawtioMainNav.BuilderFactory) => {
        accountsTab = builder.create()
            .id(HawkularAccounts.pluginName)
            .title(() => "Accounts")
            .href(() => "/accounts")
            .subPath("My account", "accounts", builder.join(HawkularAccounts.templatePath, 'accounts.html'))
            .subPath("Organizations", "organizations", builder.join(HawkularAccounts.templatePath, 'organizations.html'))
            .build();
        builder.configureRouting($routeProvider, accountsTab);

        $routeProvider.when('/accounts/organizations/new', {templateUrl: builder.join(HawkularAccounts.templatePath, 'organization_new.html')});
        $locationProvider.html5Mode(true);
    }]);

    _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
        //HawtioNav.add(accountsTab);
    }]);

    hawtioPluginLoader.addModule(HawkularAccounts.pluginName);
}
