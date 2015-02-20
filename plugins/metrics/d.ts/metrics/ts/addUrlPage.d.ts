/// <reference path="metricsPlugin.d.ts" />
declare module HawkularMetrics {
    class AddUrlController {
        private $location;
        private $scope;
        private $log;
        private HawkularInventory;
        resourceUrl: string;
        static $inject: string[];
        tenantId: string;
        constructor($location: ng.ILocationService, $scope: any, $log: ng.ILogService, HawkularInventory: any, resourceUrl: string);
        addUrl(resourceId: string): void;
    }
}
