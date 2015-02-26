/// <reference path="metricsPlugin.d.ts" />
declare module HawkularMetrics {
    class AddUrlController {
        private $location;
        private $scope;
        private $rootScope;
        private $log;
        private HawkularInventory;
        resourceUrl: string;
        static $inject: string[];
        private httpUriPart;
        constructor($location: ng.ILocationService, $scope: any, $rootScope: ng.IRootScopeService, $log: ng.ILogService, HawkularInventory: any, resourceUrl: string);
        addUrl(url: string): void;
    }
}
