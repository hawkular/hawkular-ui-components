/// <reference path="metricsPlugin.d.ts" />
declare module HawkularMetrics {
    class AddUrlController {
        private $location;
        private $scope;
        private $log;
        private HawkularMetric;
        resourceUrl: string;
        static $inject: string[];
        private tenantId;
        constructor($location: ng.ILocationService, $scope: any, $log: ng.ILogService, HawkularMetric: any, resourceUrl: string);
        addUrl(url: string): void;
        registerFixedMetrics(tenantId: string): void;
    }
}
