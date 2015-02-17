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
    interface IMetricsViewController {
        searchId: string;
        startTimeStamp: Date;
        endTimeStamp: Date;
        dateRange: string;
        showAvgLine: boolean;
        hideHighLowValues: boolean;
        showPreviousRangeDataOverlay: boolean;
        showContextZoom: boolean;
        showPreviousTimeRange(): void;
        showNextTimeRange(): void;
        hasNext(): boolean;
        refreshChartDataNow(startTime: Date): void;
        refreshHistoricalChartData(startDate: Date, endDate: Date): void;
        refreshHistoricalChartDataForTimestamp(startTime?: number, endTime?: number): void;
        overlayPreviousRangeData(): void;
        togglePreviousRangeDataOverlay(): void;
        toggleContextZoom(): void;
        refreshContextChart(): void;
    }
    class MetricsViewController implements IMetricsViewController {
        private $scope;
        private $rootScope;
        private $interval;
        private $log;
        private metricDataService;
        startTimeStamp: Date;
        endTimeStamp: Date;
        dateRange: string;
        static $inject: string[];
        searchId: string;
        showAvgLine: boolean;
        hideHighLowValues: boolean;
        showPreviousRangeDataOverlay: boolean;
        showContextZoom: boolean;
        constructor($scope: any, $rootScope: ng.IRootScopeService, $interval: ng.IIntervalService, $log: ng.ILogService, metricDataService: any, startTimeStamp: Date, endTimeStamp: Date, dateRange: string);
        private bucketedDataPoints;
        private contextDataPoints;
        private chartData;
        private noDataFoundForId(id);
        private static calculatePreviousTimeRange(startDate, endDate);
        showPreviousTimeRange(): void;
        private static calculateNextTimeRange(startDate, endDate);
        showNextTimeRange(): void;
        hasNext(): boolean;
        refreshChartDataNow(startTime?: Date): void;
        refreshHistoricalChartData(startDate: Date, endDate: Date): void;
        refreshHistoricalChartDataForTimestamp(startTime?: number, endTime?: number): void;
        private formatBucketedChartOutput(response);
        togglePreviousRangeDataOverlay(): void;
        overlayPreviousRangeData(): void;
        private formatPreviousBucketedOutput(response);
        toggleContextZoom(): void;
        refreshContextChart(): void;
        private formatContextOutput(response);
    }
}
