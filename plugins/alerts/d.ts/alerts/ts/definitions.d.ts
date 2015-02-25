/// <reference path="alertsPlugin.d.ts" />
declare module HawkularAlerts {
    interface IDefinitionsController {
        allDefinitions(): void;
        newDefinition(): void;
        saveDefinition(): void;
        viewDefinition(id: string): void;
        deleteDefinition(id: string): void;
        closeAlertMsg(index: number): void;
        newCondition(): void;
        changeConditionType(): void;
        viewCondition(conditionId: string): void;
        saveCondition(): void;
        deleteCondition(conditionId: string, className: string): void;
        cancelCondition(): void;
        saveDampening(): void;
        reloadDefinitions(): void;
    }
    class DefinitionsController implements IDefinitionsController {
        private $scope;
        private $window;
        private $log;
        private HawkularAlert;
        static $inject: string[];
        constructor($scope: any, $window: any, $log: ng.ILogService, HawkularAlert: any);
        allDefinitions(): void;
        newDefinition(): void;
        saveDefinition(): void;
        viewDefinition(id: string): void;
        deleteDefinition(id: string): void;
        closeAlertMsg(index: number): void;
        private addAlertMsg(reason);
        private allNotifiers();
        private allConditions(triggerId);
        private getDampening(triggerId);
        saveDampening(): void;
        private deleteDampening(triggerId);
        viewDampening(triggerId: string): void;
        private getDescription(className, condition);
        private getOperator(opCode);
        newCondition(): void;
        changeConditionType(): void;
        viewCondition(condition: any): void;
        saveCondition(): void;
        deleteCondition(conditionId: string, className: string): void;
        cancelCondition(): void;
        reloadDefinitions(): void;
        private prepareCondition(className, condition);
    }
}
