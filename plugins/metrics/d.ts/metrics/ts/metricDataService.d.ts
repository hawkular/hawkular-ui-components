declare module HawkularMetrics {
    class MetricDataService {
        private $q;
        private $rootScope;
        private $http;
        private $log;
        static $inject: string[];
        constructor($q: ng.IQService, $rootScope: ng.IRootScopeService, $http: ng.IHttpService, $log: ng.ILogService);
        getBaseUrl(): string;
        getAllMetrics(): ng.IPromise<{}>;
        getMetricsForTimeRange(id: string, startDate: Date, endDate: Date, buckets: number): ng.IPromise<any>;
    }
}
