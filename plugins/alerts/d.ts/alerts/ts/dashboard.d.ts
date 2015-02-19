/// <reference path="alertsPlugin.d.ts" />
declare module HawkularAlerts {
    interface IDashboardController {
        showRefreshForm(): void;
        hideRefreshForm(): void;
        updateRefresh(): void;
    }
    class DashboardController implements IDashboardController {
        private $scope;
        private $interval;
        private $log;
        private HawkularAlert;
        static $inject: string[];
        private stopInterval;
        private g;
        constructor($scope: any, $interval: ng.IIntervalService, $log: ng.ILogService, HawkularAlert: any);
        showRefreshForm(): void;
        hideRefreshForm(): void;
        updateRefresh(): void;
        closeAlertMsg(index: number): void;
        private getAlerts();
        private cancelRefresh();
        private addAlertMsg(reason);
    }
    class Graph {
        private static _instance;
        private _initialized;
        private _chartPlaceholder;
        private _width;
        private _margin;
        private _startTime;
        private _endTime;
        private _color;
        private _data;
        private _seriesIndexes;
        private _storage;
        private _graph;
        private _element;
        private _scaleDomain;
        constructor();
        static getInstance(): Graph;
        init(dashboardId: string, width: number, margin: any, startTime: number, endTime: number, hoverCallBack: Function): void;
        addEvent(event: any): void;
        getEvent(name: any, date: any): any;
    }
}
