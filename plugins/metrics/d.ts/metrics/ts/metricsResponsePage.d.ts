/// <reference path="metricsPlugin.d.ts" />
/// <reference path="../../includes.d.ts" />
declare module HawkularMetrics {
    interface IContextChartDataPoint {
        timestamp: number;
        value: number;
        avg: number;
        empty: boolean;
    }
    interface IChartDataPoint extends IContextChartDataPoint {
        date: Date;
        min: number;
        max: number;
    }
    interface IDateTimeRangeDropDown {
        range: string;
        rangeInSeconds: number;
    }
    class MetricsViewController {
        private $scope;
        private $rootScope;
        private $interval;
        private $log;
        private HawkularMetric;
        private HawkularInventory;
        startTimeStamp: Date;
        endTimeStamp: Date;
        dateRange: string;
        static $inject: string[];
        constructor($scope: any, $rootScope: ng.IRootScopeService, $interval: ng.IIntervalService, $log: ng.ILogService, HawkularMetric: any, HawkularInventory: any, startTimeStamp: Date, endTimeStamp: Date, dateRange: string);
        private bucketedDataPoints;
        private contextDataPoints;
        private chartData;
        private isResponseTab;
        private autoRefreshPromise;
        currentUrl: any;
        dateTimeRanges: IDateTimeRangeDropDown[];
        private onCreate();
        setupResourceList(): void;
        cancelAutoRefresh(): void;
        autoRefresh(intervalInSeconds: number): void;
        private noDataFoundForId(id);
        private static calculatePreviousTimeRange(startDate, endDate);
        showPreviousTimeRange(): void;
        private static calculateNextTimeRange(startDate, endDate);
        showNextTimeRange(): void;
        hasNext(): boolean;
        refreshChartDataNow(metricId: string, startTime?: Date): void;
        refreshHistoricalChartData(metricId: string, startDate: Date, endDate: Date): void;
        getMetricId(): string;
        private getResourceDurationMetricId();
        private getResourceCodeMetricId();
        refreshHistoricalChartDataForTimestamp(metricId: string, startTime?: number, endTime?: number): void;
        private formatBucketedChartOutput(response);
    }
}
