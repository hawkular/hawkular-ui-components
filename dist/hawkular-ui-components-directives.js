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


var Sidebar;
(function (Sidebar) {
    Sidebar.pluginName = "sidebar";
    Sidebar.log = Logger.get(Sidebar.pluginName);
    Sidebar.templatePath = "plugins/sidebar/html/sidebar.html";
})(Sidebar || (Sidebar = {}));

var Sidebar;
(function (Sidebar) {
    Sidebar._module = angular.module(Sidebar.pluginName, []);
    Sidebar._module.directive('hawkularSidebar', function () {
        return new Sidebar.SidebarDirective();
    });
    hawtioPluginLoader.addModule(Sidebar.pluginName);
})(Sidebar || (Sidebar = {}));

var Sidebar;
(function (Sidebar) {
    var log = Logger.get("Sidebar");
    var SidebarDirective = (function () {
        function SidebarDirective() {
            this.restrict = 'E';
            this.transclude = false;
            this.replace = false;
            this.templateUrl = Sidebar.templatePath;
        }
        return SidebarDirective;
    })();
    Sidebar.SidebarDirective = SidebarDirective;
    Sidebar.SidebarController = Sidebar._module.controller("Sidebar.SidebarController", ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        $scope.getClass = function (path) {
            return $location.path().indexOf(path) === 0 ? 'active' : '';
        };
    }]);
})(Sidebar || (Sidebar = {}));

var Topbar;
(function (Topbar) {
    Topbar.pluginName = "topbar";
    Topbar.log = Logger.get(Topbar.pluginName);
    Topbar.templatePath = "plugins/topbar/html/topbar.html";
    Topbar.globalTenantId = "test";
})(Topbar || (Topbar = {}));

var Topbar;
(function (Topbar) {
    Topbar._module = angular.module(Topbar.pluginName, ['ngResource', 'hawkular.services']);
    Topbar._module.directive('hawkularTopbar', function () {
        return new Topbar.TopbarDirective();
    });
    hawtioPluginLoader.addModule(Topbar.pluginName);
})(Topbar || (Topbar = {}));

var Topbar;
(function (Topbar) {
    var log = Logger.get("Topbar");
    var TopbarDirective = (function () {
        function TopbarDirective() {
            this.restrict = 'E';
            this.transclude = false;
            this.replace = false;
            this.templateUrl = Topbar.templatePath;
        }
        return TopbarDirective;
    })();
    Topbar.TopbarDirective = TopbarDirective;
    Topbar.TopbarController = Topbar._module.controller("Topbar.TopbarController", ['$scope', '$rootScope', '$location', 'DataResource', 'DataRange', 'HawkularInventory', function ($scope, $rootScope, $location, DataResource, DataRange, HawkularInventory) {
        $scope.range = 'week';
        $scope.getDate = function () {
            $scope.rangeDates = DataRange.getFormattedTimeRange();
        };
        $scope.setRange = function (range) {
            DataRange.setCustomRange(range);
            $scope.getDate();
            $scope.range = Object.keys(range)[0];
        };
        $scope.rangeNames = {
            'hour': 'Last Hour',
            'hours': 'Last 12 Hours',
            'day': 'Last Day',
            'week': 'Last Week',
            'month': 'Last Month',
            'year': 'Last Year'
        };
        $scope.updateResources = function () {
            DataResource.updateResources().then(function (data) {
                $scope.resources = data;
            });
        };
        $scope.getSelection = function () {
            return {
                resource: DataResource.getSelectedResource(),
                start: DataRange.getStartDate(),
                end: DataRange.getEndDate()
            };
        };
        $scope.setSelection = function (resourceId) {
            DataResource.setSelectedResource(resourceId);
        };
        $scope.updateResources();
        $scope.getSelection();
        $scope.getDate();
    }]);
})(Topbar || (Topbar = {}));

var Topbar;
(function (Topbar) {
    var DataRange = (function () {
        function DataRange() {
            this.endTimestamp = moment().valueOf();
            this.startTimestamp = moment(this.endTimestamp).subtract({ days: 7 }).valueOf();
        }
        DataRange.prototype.setCustomRange = function (rangeValue, customEndTimestamp) {
            this.endTimestamp = customEndTimestamp || moment().valueOf();
            this.startTimestamp = moment(this.endTimestamp).subtract(rangeValue).valueOf();
        };
        DataRange.prototype.getStartDate = function () {
            return new Date(this.startTimestamp);
        };
        DataRange.prototype.getEndDate = function () {
            return new Date(this.endTimestamp);
        };
        DataRange.prototype.getFormattedTimeRange = function () {
            var diff = this.endTimestamp - this.startTimestamp;
            var momStart = moment(this.startTimestamp);
            var momEnd = moment(this.endTimestamp);
            if (diff < 24 * 60 * 60 * 1000) {
                return momStart.format('D MMM YYYY') + ' ' + momStart.format('HH:mm') + ' - ' + (momStart.day() !== momEnd.day() ? momEnd.format('D MMM YYYY ') : '') + momEnd.format('HH:mm');
            }
            else {
                return momStart.format('D MMM YYYY') + ' - ' + momEnd.format('D MMM YYYY');
            }
        };
        return DataRange;
    })();
    Topbar.DataRange = DataRange;
    Topbar._module.service('DataRange', DataRange);
    var DataResource = (function () {
        function DataResource(HawkularInventory) {
            this.HawkularInventory = HawkularInventory;
            this.hkInventory = HawkularInventory;
            this.updateResources();
        }
        DataResource.prototype.updateResources = function () {
            var _this = this;
            return this.hkInventory.Resource.query({ tenantId: Topbar.globalTenantId }).$promise.then(function (resources) {
                _this.globalResourceList = resources;
                if (!_this.selectedResource) {
                    _this.selectedResource = resources[resources.length - 1];
                }
                return resources;
            });
        };
        DataResource.prototype.getSelectedResource = function () {
            return this.selectedResource;
        };
        DataResource.prototype.getResources = function () {
            return this.globalResourceList;
        };
        DataResource.prototype.setSelectedResource = function (resource) {
            this.selectedResource = resource;
        };
        DataResource.$inject = ['HawkularInventory'];
        return DataResource;
    })();
    Topbar.DataResource = DataResource;
    Topbar._module.service('DataResource', DataResource);
})(Topbar || (Topbar = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLmpzIiwiL1VzZXJzL2FtbWVuZG9uY2EvRHJvcGJveC93b3JrL3dvcmtzcGFjZS9yZWRoYXQvaGF3a3VsYXItdWktY29tcG9uZW50cy9zaWRlYmFyL3RzL3NpZGViYXJHbG9iYWxzLnRzIiwiL1VzZXJzL2FtbWVuZG9uY2EvRHJvcGJveC93b3JrL3dvcmtzcGFjZS9yZWRoYXQvaGF3a3VsYXItdWktY29tcG9uZW50cy9zaWRlYmFyL3RzL3NpZGViYXJQbHVnaW4udHMiLCIvVXNlcnMvYW1tZW5kb25jYS9Ecm9wYm94L3dvcmsvd29ya3NwYWNlL3JlZGhhdC9oYXdrdWxhci11aS1jb21wb25lbnRzL3NpZGViYXIvdHMvc2lkZWJhckRpcmVjdGl2ZS50cyIsIi9Vc2Vycy9hbW1lbmRvbmNhL0Ryb3Bib3gvd29yay93b3Jrc3BhY2UvcmVkaGF0L2hhd2t1bGFyLXVpLWNvbXBvbmVudHMvdG9wYmFyL3RzL3RvcGJhckdsb2JhbHMudHMiLCIvVXNlcnMvYW1tZW5kb25jYS9Ecm9wYm94L3dvcmsvd29ya3NwYWNlL3JlZGhhdC9oYXdrdWxhci11aS1jb21wb25lbnRzL3RvcGJhci90cy90b3BiYXJQbHVnaW4udHMiLCIvVXNlcnMvYW1tZW5kb25jYS9Ecm9wYm94L3dvcmsvd29ya3NwYWNlL3JlZGhhdC9oYXdrdWxhci11aS1jb21wb25lbnRzL3RvcGJhci90cy90b3BiYXJEaXJlY3RpdmUudHMiLCIvVXNlcnMvYW1tZW5kb25jYS9Ecm9wYm94L3dvcmsvd29ya3NwYWNlL3JlZGhhdC9oYXdrdWxhci11aS1jb21wb25lbnRzL3RvcGJhci90cy90b3BiYXJTZXJ2aWNlcy50cyJdLCJuYW1lcyI6WyJTaWRlYmFyIiwiU2lkZWJhci5TaWRlYmFyRGlyZWN0aXZlIiwiU2lkZWJhci5TaWRlYmFyRGlyZWN0aXZlLmNvbnN0cnVjdG9yIiwiVG9wYmFyIiwiVG9wYmFyLlRvcGJhckRpcmVjdGl2ZSIsIlRvcGJhci5Ub3BiYXJEaXJlY3RpdmUuY29uc3RydWN0b3IiLCJUb3BiYXIuRGF0YVJhbmdlIiwiVG9wYmFyLkRhdGFSYW5nZS5jb25zdHJ1Y3RvciIsIlRvcGJhci5EYXRhUmFuZ2Uuc2V0Q3VzdG9tUmFuZ2UiLCJUb3BiYXIuRGF0YVJhbmdlLmdldFN0YXJ0RGF0ZSIsIlRvcGJhci5EYXRhUmFuZ2UuZ2V0RW5kRGF0ZSIsIlRvcGJhci5EYXRhUmFuZ2UuZ2V0Rm9ybWF0dGVkVGltZVJhbmdlIiwiVG9wYmFyLkRhdGFSZXNvdXJjZSIsIlRvcGJhci5EYXRhUmVzb3VyY2UuY29uc3RydWN0b3IiLCJUb3BiYXIuRGF0YVJlc291cmNlLnVwZGF0ZVJlc291cmNlcyIsIlRvcGJhci5EYXRhUmVzb3VyY2UuZ2V0U2VsZWN0ZWRSZXNvdXJjZSIsIlRvcGJhci5EYXRhUmVzb3VyY2UuZ2V0UmVzb3VyY2VzIiwiVG9wYmFyLkRhdGFSZXNvdXJjZS5zZXRTZWxlY3RlZFJlc291cmNlIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDZUEsSUFBTyxPQUFPLENBUWI7QUFSRCxXQUFPLE9BQU8sRUFBQyxDQUFDO0lBRUhBLGtCQUFVQSxHQUFHQSxTQUFTQSxDQUFDQTtJQUV2QkEsV0FBR0EsR0FBa0JBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLGtCQUFVQSxDQUFDQSxDQUFDQTtJQUU1Q0Esb0JBQVlBLEdBQUdBLG1DQUFtQ0EsQ0FBQ0E7QUFFaEVBLENBQUNBLEVBUk0sT0FBTyxLQUFQLE9BQU8sUUFRYjs7QUNQRCxJQUFPLE9BQU8sQ0FTYjtBQVRELFdBQU8sT0FBTyxFQUFDLENBQUM7SUFFSEEsZUFBT0EsR0FBR0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0Esa0JBQVVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO0lBRXBEQSxlQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxpQkFBaUJBLEVBQUVBO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3hDLENBQUMsQ0FBQ0EsQ0FBQ0E7SUFFSEEsa0JBQWtCQSxDQUFDQSxTQUFTQSxDQUFDQSxrQkFBVUEsQ0FBQ0EsQ0FBQ0E7QUFDM0NBLENBQUNBLEVBVE0sT0FBTyxLQUFQLE9BQU8sUUFTYjs7QUNWRCxJQUFPLE9BQU8sQ0FvQmI7QUFwQkQsV0FBTyxPQUFPLEVBQUMsQ0FBQztJQUVkQSxJQUFJQSxHQUFHQSxHQUFrQkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7SUFFL0NBLElBQWFBLGdCQUFnQkE7UUFBN0JDLFNBQWFBLGdCQUFnQkE7WUFFcEJDLGFBQVFBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ2ZBLGVBQVVBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ25CQSxZQUFPQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUVoQkEsZ0JBQVdBLEdBQUdBLG9CQUFZQSxDQUFDQTtRQUNwQ0EsQ0FBQ0E7UUFBREQsdUJBQUNBO0lBQURBLENBUEFELEFBT0NDLElBQUFEO0lBUFlBLHdCQUFnQkEsR0FBaEJBLGdCQU9aQSxDQUFBQTtJQUVVQSx5QkFBaUJBLEdBQUdBLGVBQU9BLENBQUNBLFVBQVVBLENBQUNBLDJCQUEyQkEsRUFDM0VBLENBQUNBLFFBQVFBLEVBQUVBLFlBQVlBLEVBQUVBLFdBQVdBLEVBQUVBLFVBQUNBLE1BQU1BLEVBQUVBLFVBQVVBLEVBQUVBLFNBQVNBO1FBRXBFQSxNQUFNQSxDQUFDQSxRQUFRQSxHQUFHQSxVQUFVQSxJQUFJQTtZQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUM5RCxDQUFDLENBQUNBO0lBQ0pBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0FBQ05BLENBQUNBLEVBcEJNLE9BQU8sS0FBUCxPQUFPLFFBb0JiOztBQ3BCRCxJQUFPLE1BQU0sQ0FVWjtBQVZELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFFRkcsaUJBQVVBLEdBQUdBLFFBQVFBLENBQUNBO0lBRXRCQSxVQUFHQSxHQUFrQkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsaUJBQVVBLENBQUNBLENBQUNBO0lBRTVDQSxtQkFBWUEsR0FBR0EsaUNBQWlDQSxDQUFDQTtJQUVqREEscUJBQWNBLEdBQUdBLE1BQU1BLENBQUNBO0FBRXJDQSxDQUFDQSxFQVZNLE1BQU0sS0FBTixNQUFNLFFBVVo7O0FDVEQsSUFBTyxNQUFNLENBU1o7QUFURCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBRUZBLGNBQU9BLEdBQUdBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLGlCQUFVQSxFQUFFQSxDQUFDQSxZQUFZQSxFQUFFQSxtQkFBbUJBLENBQUNBLENBQUNBLENBQUNBO0lBRXJGQSxjQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxnQkFBZ0JBLEVBQUVBO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN0QyxDQUFDLENBQUNBLENBQUNBO0lBRUhBLGtCQUFrQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsaUJBQVVBLENBQUNBLENBQUNBO0FBQzNDQSxDQUFDQSxFQVRNLE1BQU0sS0FBTixNQUFNLFFBU1o7O0FDVkQsSUFBTyxNQUFNLENBNkRaO0FBN0RELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFFYkEsSUFBSUEsR0FBR0EsR0FBa0JBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO0lBRTlDQSxJQUFhQSxlQUFlQTtRQUE1QkMsU0FBYUEsZUFBZUE7WUFFbkJDLGFBQVFBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ2ZBLGVBQVVBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ25CQSxZQUFPQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUVoQkEsZ0JBQVdBLEdBQUdBLG1CQUFZQSxDQUFDQTtRQUNwQ0EsQ0FBQ0E7UUFBREQsc0JBQUNBO0lBQURBLENBUEFELEFBT0NDLElBQUFEO0lBUFlBLHNCQUFlQSxHQUFmQSxlQU9aQSxDQUFBQTtJQUVVQSx1QkFBZ0JBLEdBQUdBLGNBQU9BLENBQUNBLFVBQVVBLENBQUNBLHlCQUF5QkEsRUFDeEVBLENBQUNBLFFBQVFBLEVBQUVBLFlBQVlBLEVBQUVBLFdBQVdBLEVBQUVBLGNBQWNBLEVBQUVBLFdBQVdBLEVBQUVBLG1CQUFtQkEsRUFBRUEsVUFBQ0EsTUFBTUEsRUFBRUEsVUFBVUEsRUFBRUEsU0FBU0EsRUFBRUEsWUFBWUEsRUFBRUEsU0FBU0EsRUFBRUEsaUJBQWlCQTtRQUVsS0EsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFFdEJBLE1BQU1BLENBQUNBLE9BQU9BLEdBQUdBO1lBQ2YsTUFBTSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN4RCxDQUFDLENBQUNBO1FBRUZBLE1BQU1BLENBQUNBLFFBQVFBLEdBQUdBLFVBQVNBLEtBQUtBO1lBQzlCLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUNBO1FBRUZBLE1BQU1BLENBQUNBLFVBQVVBLEdBQUdBO1lBQ2xCQSxNQUFNQSxFQUFFQSxXQUFXQTtZQUNuQkEsT0FBT0EsRUFBRUEsZUFBZUE7WUFDeEJBLEtBQUtBLEVBQUVBLFVBQVVBO1lBQ2pCQSxNQUFNQSxFQUFFQSxXQUFXQTtZQUNuQkEsT0FBT0EsRUFBRUEsWUFBWUE7WUFDckJBLE1BQU1BLEVBQUVBLFdBQVdBO1NBQ3BCQSxDQUFDQTtRQUVGQSxNQUFNQSxDQUFDQSxlQUFlQSxHQUFHQTtZQUN2QixZQUFZLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVMsSUFBSTtnQkFDL0MsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUNBO1FBRUZBLE1BQU1BLENBQUNBLFlBQVlBLEdBQUdBO1lBQ3BCLE1BQU0sQ0FBQztnQkFDTCxRQUFRLEVBQUUsWUFBWSxDQUFDLG1CQUFtQixFQUFFO2dCQUM1QyxLQUFLLEVBQUUsU0FBUyxDQUFDLFlBQVksRUFBRTtnQkFDL0IsR0FBRyxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUU7YUFDNUIsQ0FBQztRQUNKLENBQUMsQ0FBQ0E7UUFFRkEsTUFBTUEsQ0FBQ0EsWUFBWUEsR0FBR0EsVUFBU0EsVUFBVUE7WUFDdkMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQ0E7UUFHRkEsTUFBTUEsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7UUFDekJBLE1BQU1BLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1FBQ3RCQSxNQUFNQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtJQUVuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDTkEsQ0FBQ0EsRUE3RE0sTUFBTSxLQUFOLE1BQU0sUUE2RFo7O0FDNURELElBQU8sTUFBTSxDQWlGWjtBQWpGRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBRWJBLElBQWFBLFNBQVNBO1FBS3BCRyxTQUxXQSxTQUFTQTtZQU9sQkMsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsTUFBTUEsRUFBRUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7WUFDdkNBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLEVBQUNBLElBQUlBLEVBQUVBLENBQUNBLEVBQUNBLENBQUNBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO1FBQ2hGQSxDQUFDQTtRQUVNRCxrQ0FBY0EsR0FBckJBLFVBQXNCQSxVQUFrQkEsRUFBRUEsa0JBQTBCQTtZQUNsRUUsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0Esa0JBQWtCQSxJQUFJQSxNQUFNQSxFQUFFQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtZQUM3REEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7UUFDakZBLENBQUNBO1FBRU1GLGdDQUFZQSxHQUFuQkE7WUFDRUcsTUFBTUEsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7UUFDdkNBLENBQUNBO1FBRU1ILDhCQUFVQSxHQUFqQkE7WUFDRUksTUFBTUEsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFDckNBLENBQUNBO1FBRU1KLHlDQUFxQkEsR0FBNUJBO1lBQ0VLLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO1lBQ25EQSxJQUFJQSxRQUFRQSxHQUFHQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtZQUMzQ0EsSUFBSUEsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7WUFFdkNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvQkEsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsS0FBS0EsR0FBR0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsTUFBTUEsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsR0FBSUEsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFDbExBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNOQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQSxHQUFHQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtZQUM3RUEsQ0FBQ0E7UUFDSEEsQ0FBQ0E7UUFDSEwsZ0JBQUNBO0lBQURBLENBbkNBSCxBQW1DQ0csSUFBQUg7SUFuQ1lBLGdCQUFTQSxHQUFUQSxTQW1DWkEsQ0FBQUE7SUFFREEsY0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0E7SUFFeENBLElBQWFBLFlBQVlBO1FBU3ZCUyxTQVRXQSxZQUFZQSxDQVNIQSxpQkFBcUJBO1lBQXJCQyxzQkFBaUJBLEdBQWpCQSxpQkFBaUJBLENBQUlBO1lBQ3ZDQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxpQkFBaUJBLENBQUNBO1lBQ3JDQSxJQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtRQUN6QkEsQ0FBQ0E7UUFFTUQsc0NBQWVBLEdBQXRCQTtZQUFBRSxpQkFTQ0E7WUFSQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBQ0EsUUFBUUEsRUFBRUEscUJBQWNBLEVBQUNBLENBQUNBLENBQUNBLFFBQVFBLENBQ3pFQSxJQUFJQSxDQUFDQSxVQUFDQSxTQUFTQTtnQkFDYkEsS0FBSUEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxTQUFTQSxDQUFDQTtnQkFDcENBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNCQSxLQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUMxREEsQ0FBQ0E7Z0JBQ0RBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBO1lBQ25CQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNQQSxDQUFDQTtRQUVNRiwwQ0FBbUJBLEdBQTFCQTtZQUNFRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBO1FBQy9CQSxDQUFDQTtRQUVNSCxtQ0FBWUEsR0FBbkJBO1lBQ0VJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0E7UUFDakNBLENBQUNBO1FBRU1KLDBDQUFtQkEsR0FBMUJBLFVBQTJCQSxRQUFnQkE7WUFDekNLLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDbkNBLENBQUNBO1FBakNhTCxvQkFBT0EsR0FBR0EsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxDQUFDQTtRQWtDaERBLG1CQUFDQTtJQUFEQSxDQXBDQVQsQUFvQ0NTLElBQUFUO0lBcENZQSxtQkFBWUEsR0FBWkEsWUFvQ1pBLENBQUFBO0lBRURBLGNBQU9BLENBQUNBLE9BQU9BLENBQUNBLGNBQWNBLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBO0FBRWhEQSxDQUFDQSxFQWpGTSxNQUFNLEtBQU4sTUFBTSxRQWlGWiIsImZpbGUiOiJjb21waWxlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9pbmNsdWRlcy50c1wiLz5cbm1vZHVsZSBTaWRlYmFyIHtcblxuICBleHBvcnQgdmFyIHBsdWdpbk5hbWUgPSBcInNpZGViYXJcIjtcblxuICBleHBvcnQgdmFyIGxvZzpMb2dnaW5nLkxvZ2dlciA9IExvZ2dlci5nZXQocGx1Z2luTmFtZSk7XG5cbiAgZXhwb3J0IHZhciB0ZW1wbGF0ZVBhdGggPSBcInBsdWdpbnMvc2lkZWJhci9odG1sL3NpZGViYXIuaHRtbFwiO1xuXG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInNpZGViYXJHbG9iYWxzLnRzXCIvPlxubW9kdWxlIFNpZGViYXIge1xuXG4gIGV4cG9ydCB2YXIgX21vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKHBsdWdpbk5hbWUsIFtdKTtcblxuICBfbW9kdWxlLmRpcmVjdGl2ZSgnaGF3a3VsYXJTaWRlYmFyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgU2lkZWJhci5TaWRlYmFyRGlyZWN0aXZlKCk7XG4gIH0pO1xuXG4gIGhhd3Rpb1BsdWdpbkxvYWRlci5hZGRNb2R1bGUocGx1Z2luTmFtZSk7XG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInNpZGViYXJQbHVnaW4udHNcIi8+XG5tb2R1bGUgU2lkZWJhciB7XG5cbiAgdmFyIGxvZzpMb2dnaW5nLkxvZ2dlciA9IExvZ2dlci5nZXQoXCJTaWRlYmFyXCIpO1xuXG4gIGV4cG9ydCBjbGFzcyBTaWRlYmFyRGlyZWN0aXZlIHtcblxuICAgIHB1YmxpYyByZXN0cmljdCA9ICdFJztcbiAgICBwdWJsaWMgdHJhbnNjbHVkZSA9IGZhbHNlO1xuICAgIHB1YmxpYyByZXBsYWNlID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgdGVtcGxhdGVVcmwgPSB0ZW1wbGF0ZVBhdGg7XG4gIH1cblxuICBleHBvcnQgdmFyIFNpZGViYXJDb250cm9sbGVyID0gX21vZHVsZS5jb250cm9sbGVyKFwiU2lkZWJhci5TaWRlYmFyQ29udHJvbGxlclwiLFxuICAgIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJyAsKCRzY29wZSwgJHJvb3RTY29wZSwgJGxvY2F0aW9uKSA9PiB7XG5cbiAgICAkc2NvcGUuZ2V0Q2xhc3MgPSBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgcmV0dXJuICRsb2NhdGlvbi5wYXRoKCkuaW5kZXhPZihwYXRoKSA9PT0gMCA/ICdhY3RpdmUnIDogJyc7XG4gICAgfTtcbiAgfV0pO1xufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9pbmNsdWRlcy50c1wiLz5cbm1vZHVsZSBUb3BiYXIge1xuXG4gIGV4cG9ydCB2YXIgcGx1Z2luTmFtZSA9IFwidG9wYmFyXCI7XG5cbiAgZXhwb3J0IHZhciBsb2c6TG9nZ2luZy5Mb2dnZXIgPSBMb2dnZXIuZ2V0KHBsdWdpbk5hbWUpO1xuXG4gIGV4cG9ydCB2YXIgdGVtcGxhdGVQYXRoID0gXCJwbHVnaW5zL3RvcGJhci9odG1sL3RvcGJhci5odG1sXCI7XG5cbiAgZXhwb3J0IHZhciBnbG9iYWxUZW5hbnRJZCA9IFwidGVzdFwiO1xuXG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRvcGJhckdsb2JhbHMudHNcIi8+XG5tb2R1bGUgVG9wYmFyIHtcblxuICBleHBvcnQgdmFyIF9tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShwbHVnaW5OYW1lLCBbJ25nUmVzb3VyY2UnLCAnaGF3a3VsYXIuc2VydmljZXMnXSk7XG5cbiAgX21vZHVsZS5kaXJlY3RpdmUoJ2hhd2t1bGFyVG9wYmFyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgVG9wYmFyLlRvcGJhckRpcmVjdGl2ZSgpO1xuICB9KTtcblxuICBoYXd0aW9QbHVnaW5Mb2FkZXIuYWRkTW9kdWxlKHBsdWdpbk5hbWUpO1xufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0b3BiYXJQbHVnaW4udHNcIi8+XG5tb2R1bGUgVG9wYmFyIHtcblxuICB2YXIgbG9nOkxvZ2dpbmcuTG9nZ2VyID0gTG9nZ2VyLmdldChcIlRvcGJhclwiKTtcblxuICBleHBvcnQgY2xhc3MgVG9wYmFyRGlyZWN0aXZlIHtcblxuICAgIHB1YmxpYyByZXN0cmljdCA9ICdFJztcbiAgICBwdWJsaWMgdHJhbnNjbHVkZSA9IGZhbHNlO1xuICAgIHB1YmxpYyByZXBsYWNlID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgdGVtcGxhdGVVcmwgPSB0ZW1wbGF0ZVBhdGg7XG4gIH1cblxuICBleHBvcnQgdmFyIFRvcGJhckNvbnRyb2xsZXIgPSBfbW9kdWxlLmNvbnRyb2xsZXIoXCJUb3BiYXIuVG9wYmFyQ29udHJvbGxlclwiLFxuICAgIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJGxvY2F0aW9uJywgJ0RhdGFSZXNvdXJjZScsICdEYXRhUmFuZ2UnLCAnSGF3a3VsYXJJbnZlbnRvcnknLCAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkbG9jYXRpb24sIERhdGFSZXNvdXJjZSwgRGF0YVJhbmdlLCBIYXdrdWxhckludmVudG9yeSkgPT4ge1xuXG4gICAgJHNjb3BlLnJhbmdlID0gJ3dlZWsnO1xuXG4gICAgJHNjb3BlLmdldERhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICRzY29wZS5yYW5nZURhdGVzID0gRGF0YVJhbmdlLmdldEZvcm1hdHRlZFRpbWVSYW5nZSgpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2V0UmFuZ2UgPSBmdW5jdGlvbihyYW5nZSkge1xuICAgICAgRGF0YVJhbmdlLnNldEN1c3RvbVJhbmdlKHJhbmdlKTtcbiAgICAgICRzY29wZS5nZXREYXRlKCk7XG4gICAgICAkc2NvcGUucmFuZ2UgPSBPYmplY3Qua2V5cyhyYW5nZSlbMF07XG4gICAgfTtcblxuICAgICRzY29wZS5yYW5nZU5hbWVzID0ge1xuICAgICAgJ2hvdXInOiAnTGFzdCBIb3VyJyxcbiAgICAgICdob3Vycyc6ICdMYXN0IDEyIEhvdXJzJyxcbiAgICAgICdkYXknOiAnTGFzdCBEYXknLFxuICAgICAgJ3dlZWsnOiAnTGFzdCBXZWVrJyxcbiAgICAgICdtb250aCc6ICdMYXN0IE1vbnRoJyxcbiAgICAgICd5ZWFyJzogJ0xhc3QgWWVhcidcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVwZGF0ZVJlc291cmNlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgRGF0YVJlc291cmNlLnVwZGF0ZVJlc291cmNlcygpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAkc2NvcGUucmVzb3VyY2VzID0gZGF0YTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZ2V0U2VsZWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXNvdXJjZTogRGF0YVJlc291cmNlLmdldFNlbGVjdGVkUmVzb3VyY2UoKSxcbiAgICAgICAgc3RhcnQ6IERhdGFSYW5nZS5nZXRTdGFydERhdGUoKSxcbiAgICAgICAgZW5kOiBEYXRhUmFuZ2UuZ2V0RW5kRGF0ZSgpXG4gICAgICB9O1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2V0U2VsZWN0aW9uID0gZnVuY3Rpb24ocmVzb3VyY2VJZCkge1xuICAgICAgRGF0YVJlc291cmNlLnNldFNlbGVjdGVkUmVzb3VyY2UocmVzb3VyY2VJZCk7XG4gICAgfTtcblxuICAgIC8vLyBJbml0aWFsaXplXG4gICAgJHNjb3BlLnVwZGF0ZVJlc291cmNlcygpO1xuICAgICRzY29wZS5nZXRTZWxlY3Rpb24oKTtcbiAgICAkc2NvcGUuZ2V0RGF0ZSgpO1xuXG4gIH1dKTtcbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vaW5jbHVkZXMudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidG9wYmFyR2xvYmFscy50c1wiLz5cbm1vZHVsZSBUb3BiYXIge1xuXG4gIGV4cG9ydCBjbGFzcyBEYXRhUmFuZ2Uge1xuXG4gICAgc3RhcnRUaW1lc3RhbXA6IG51bWJlcjtcbiAgICBlbmRUaW1lc3RhbXA6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgLy8vIGRlZmF1bHRzIHRvIGxhc3QgNyBkYXlzXG4gICAgICB0aGlzLmVuZFRpbWVzdGFtcCA9IG1vbWVudCgpLnZhbHVlT2YoKTtcbiAgICAgIHRoaXMuc3RhcnRUaW1lc3RhbXAgPSBtb21lbnQodGhpcy5lbmRUaW1lc3RhbXApLnN1YnRyYWN0KHtkYXlzOiA3fSkudmFsdWVPZigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRDdXN0b21SYW5nZShyYW5nZVZhbHVlOiBPYmplY3QsIGN1c3RvbUVuZFRpbWVzdGFtcDogbnVtYmVyKSB7XG4gICAgICB0aGlzLmVuZFRpbWVzdGFtcCA9IGN1c3RvbUVuZFRpbWVzdGFtcCB8fCBtb21lbnQoKS52YWx1ZU9mKCk7XG4gICAgICB0aGlzLnN0YXJ0VGltZXN0YW1wID0gbW9tZW50KHRoaXMuZW5kVGltZXN0YW1wKS5zdWJ0cmFjdChyYW5nZVZhbHVlKS52YWx1ZU9mKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFN0YXJ0RGF0ZSgpOkRhdGUge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMuc3RhcnRUaW1lc3RhbXApO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRFbmREYXRlKCk6RGF0ZSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUodGhpcy5lbmRUaW1lc3RhbXApO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRGb3JtYXR0ZWRUaW1lUmFuZ2UoKTpzdHJpbmcge1xuICAgICAgdmFyIGRpZmYgPSB0aGlzLmVuZFRpbWVzdGFtcCAtIHRoaXMuc3RhcnRUaW1lc3RhbXA7XG4gICAgICB2YXIgbW9tU3RhcnQgPSBtb21lbnQodGhpcy5zdGFydFRpbWVzdGFtcCk7XG4gICAgICB2YXIgbW9tRW5kID0gbW9tZW50KHRoaXMuZW5kVGltZXN0YW1wKTtcblxuICAgICAgaWYgKGRpZmYgPCAyNCAqIDYwICogNjAgKiAxMDAwKSB7XG4gICAgICAgIHJldHVybiBtb21TdGFydC5mb3JtYXQoJ0QgTU1NIFlZWVknKSArICcgJyArIG1vbVN0YXJ0LmZvcm1hdCgnSEg6bW0nKSArICcgLSAnICsgKG1vbVN0YXJ0LmRheSgpICE9PSBtb21FbmQuZGF5KCkgPyBtb21FbmQuZm9ybWF0KCdEIE1NTSBZWVlZICcpICA6ICcnKSArIG1vbUVuZC5mb3JtYXQoJ0hIOm1tJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbW9tU3RhcnQuZm9ybWF0KCdEIE1NTSBZWVlZJykgKyAnIC0gJyArIG1vbUVuZC5mb3JtYXQoJ0QgTU1NIFlZWVknKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfbW9kdWxlLnNlcnZpY2UoJ0RhdGFSYW5nZScsIERhdGFSYW5nZSk7XG5cbiAgZXhwb3J0IGNsYXNzIERhdGFSZXNvdXJjZSB7XG5cbiAgICBwdWJsaWMgc3RhdGljICRpbmplY3QgPSBbJ0hhd2t1bGFySW52ZW50b3J5J107XG5cbiAgICBnbG9iYWxSZXNvdXJjZUxpc3Q6IGFueTtcbiAgICBzZWxlY3RlZFJlc291cmNlOiBTdHJpbmc7XG5cbiAgICBoa0ludmVudG9yeTogYW55O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBIYXdrdWxhckludmVudG9yeTphbnkpIHtcbiAgICAgIHRoaXMuaGtJbnZlbnRvcnkgPSBIYXdrdWxhckludmVudG9yeTtcbiAgICAgIHRoaXMudXBkYXRlUmVzb3VyY2VzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVJlc291cmNlcygpOmFueSB7XG4gICAgICByZXR1cm4gdGhpcy5oa0ludmVudG9yeS5SZXNvdXJjZS5xdWVyeSh7dGVuYW50SWQ6IGdsb2JhbFRlbmFudElkfSkuJHByb21pc2UuXG4gICAgICAgIHRoZW4oKHJlc291cmNlcyk9PiB7XG4gICAgICAgICAgdGhpcy5nbG9iYWxSZXNvdXJjZUxpc3QgPSByZXNvdXJjZXM7XG4gICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkUmVzb3VyY2UpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSZXNvdXJjZSA9IHJlc291cmNlc1tyZXNvdXJjZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXNvdXJjZXM7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTZWxlY3RlZFJlc291cmNlKCk6U3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkUmVzb3VyY2U7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFJlc291cmNlcygpOmFueSB7XG4gICAgICByZXR1cm4gdGhpcy5nbG9iYWxSZXNvdXJjZUxpc3Q7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFNlbGVjdGVkUmVzb3VyY2UocmVzb3VyY2U6IFN0cmluZyk6dm9pZCB7XG4gICAgICB0aGlzLnNlbGVjdGVkUmVzb3VyY2UgPSByZXNvdXJjZTtcbiAgICB9XG4gIH1cblxuICBfbW9kdWxlLnNlcnZpY2UoJ0RhdGFSZXNvdXJjZScsIERhdGFSZXNvdXJjZSk7XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
angular.module("hawkular-ui-components-directives-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/sidebar/html/sidebar.html","<div class=\"col-sm-3 col-md-2 sidebar-pf sidebar-pf-left sidebar-pf-dark sidebar-pf-big-icons\">\n\n  <ul class=\"nav nav-pills nav-stacked nav-dark nav-big-icons\">\n    <li ng-class=\"getClass(\'/metrics/responseTime\')\"><a href=\"/metrics/responseTime\"><i class=\"fa fa-line-chart\"></i>Response Time</a></li>\n    <li ng-class=\"getClass(\'/metrics/upDowntime\')\"><a href=\"/metrics/upDowntime\"><i class=\"fa fa-arrow-up\"></i>Up / Downtime</a></li>\n    <li ng-class=\"getClass(\'/metrics/alerts\')\"><a href=\"/metrics/alerts\"><i class=\"fa fa-flag\"></i>Alerts</a></li>\n  </ul>\n</div>");
$templateCache.put("plugins/topbar/html/topbar.html","<ul class=\"nav navbar-nav navbar-primary navbar-selector navbar-dark row\">\n  <li class=\"dropdown context col-sm-3 col-md-2\">\n    <a href=\"#\" class=\"dropdown-toggle additional-info\" data-toggle=\"dropdown\" ng-hide=\"resources.length === 0\">\n      {{getSelection().resource.id}}\n      <span>{{getSelection().resource.parameters.url}}</span>\n      <b class=\"caret\"></b>\n    </a>\n    <a href=\"/metrics/addUrl\" class=\"additional-info\" ng-show=\"resources.length === 0\">\n      No Resources Available\n      <span>Add a Resource</span>\n    </a>\n    <ul class=\"dropdown-menu\">\n      <li ng-class=\"{\'active\': getSelection().resource.id == resource.id}\" ng-repeat=\"resource in resources\">\n        <a href=\"\" ng-click=\"setSelection(resource)\">{{resource.id}}</a>\n      </li>\n      <li class=\"divider\"></li>\n      <li>\n        <a href=\"#\">Add Application...</a>\n      </li>\n    </ul>\n  </li>\n\n  <li class=\"pull-right date-range dropdown\">\n    <i class=\"fa fa-calendar\"></i>\n    <div class=\"input\" data-toggle=\"dropdown\">\n      {{rangeNames[range]}} <span class=\"additional-info\">({{rangeDates}})</span>\n    </div>\n\n    <div class=\"dropdown-menu infotip bottom-right\">\n      <div class=\"arrow\"></div>\n      <div class=\"dropdown-menu-content\">\n        <span class=\"label\">Last</span>\n        <div class=\"btn-group\">\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'hour\'}\" ng-click=\"setRange({hour: 1})\">1h</button>\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'hours\'}\" ng-click=\"setRange({hours: 12})\">12h</button>\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'day\'}\" ng-click=\"setRange({day: 1})\">Day</button>\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'week\'}\" ng-click=\"setRange({week: 1})\">Week</button>\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'month\'}\" ng-click=\"setRange({month: 1})\">Month</button>\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'year\'}\" ng-click=\"setRange({year: 1})\">Year</button>\n        </div>\n      </div>\n    </div>\n  </li>\n</ul>");}]); hawtioPluginLoader.addModule("hawkular-ui-components-directives-templates");