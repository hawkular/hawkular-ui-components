/// <reference path="alertsPlugin.d.ts" />
declare module HawkularAlerts {
    interface INotifiersController {
        allNotifiers(): void;
        newNotifier(): void;
        viewNotifier(notifierId: string): void;
        saveNotifier(): void;
        deleteNotifier(notifierId: string): void;
        closeAlertMsg(index: number): void;
    }
    class NotifiersController implements INotifiersController {
        private $scope;
        private $interval;
        private $log;
        private HawkularAlert;
        static $inject: string[];
        constructor($scope: any, $interval: ng.IIntervalService, $log: ng.ILogService, HawkularAlert: any);
        allNotifiers(): void;
        newNotifier(): void;
        viewNotifier(notifierId: string): void;
        saveNotifier(): void;
        deleteNotifier(notifierId: string): void;
        private addAlertMsg(reason);
        closeAlertMsg(index: number): void;
    }
}
