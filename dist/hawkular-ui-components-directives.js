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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLmpzIiwiL2hvbWUvamtyZW1zZXIvd29ya3NwYWNlL2hhd2t1bGFyL2hhd2t1bGFyLXVpLWNvbXBvbmVudHMvc2lkZWJhci90cy9zaWRlYmFyR2xvYmFscy50cyIsIi9ob21lL2prcmVtc2VyL3dvcmtzcGFjZS9oYXdrdWxhci9oYXdrdWxhci11aS1jb21wb25lbnRzL3NpZGViYXIvdHMvc2lkZWJhclBsdWdpbi50cyIsIi9ob21lL2prcmVtc2VyL3dvcmtzcGFjZS9oYXdrdWxhci9oYXdrdWxhci11aS1jb21wb25lbnRzL3NpZGViYXIvdHMvc2lkZWJhckRpcmVjdGl2ZS50cyIsIi9ob21lL2prcmVtc2VyL3dvcmtzcGFjZS9oYXdrdWxhci9oYXdrdWxhci11aS1jb21wb25lbnRzL3RvcGJhci90cy90b3BiYXJHbG9iYWxzLnRzIiwiL2hvbWUvamtyZW1zZXIvd29ya3NwYWNlL2hhd2t1bGFyL2hhd2t1bGFyLXVpLWNvbXBvbmVudHMvdG9wYmFyL3RzL3RvcGJhclBsdWdpbi50cyIsIi9ob21lL2prcmVtc2VyL3dvcmtzcGFjZS9oYXdrdWxhci9oYXdrdWxhci11aS1jb21wb25lbnRzL3RvcGJhci90cy90b3BiYXJEaXJlY3RpdmUudHMiLCIvaG9tZS9qa3JlbXNlci93b3Jrc3BhY2UvaGF3a3VsYXIvaGF3a3VsYXItdWktY29tcG9uZW50cy90b3BiYXIvdHMvdG9wYmFyU2VydmljZXMudHMiXSwibmFtZXMiOlsiU2lkZWJhciIsIlNpZGViYXIuU2lkZWJhckRpcmVjdGl2ZSIsIlNpZGViYXIuU2lkZWJhckRpcmVjdGl2ZS5jb25zdHJ1Y3RvciIsIlRvcGJhciIsIlRvcGJhci5Ub3BiYXJEaXJlY3RpdmUiLCJUb3BiYXIuVG9wYmFyRGlyZWN0aXZlLmNvbnN0cnVjdG9yIiwiVG9wYmFyLkRhdGFSYW5nZSIsIlRvcGJhci5EYXRhUmFuZ2UuY29uc3RydWN0b3IiLCJUb3BiYXIuRGF0YVJhbmdlLnNldEN1c3RvbVJhbmdlIiwiVG9wYmFyLkRhdGFSYW5nZS5nZXRTdGFydERhdGUiLCJUb3BiYXIuRGF0YVJhbmdlLmdldEVuZERhdGUiLCJUb3BiYXIuRGF0YVJhbmdlLmdldEZvcm1hdHRlZFRpbWVSYW5nZSIsIlRvcGJhci5EYXRhUmVzb3VyY2UiLCJUb3BiYXIuRGF0YVJlc291cmNlLmNvbnN0cnVjdG9yIiwiVG9wYmFyLkRhdGFSZXNvdXJjZS51cGRhdGVSZXNvdXJjZXMiLCJUb3BiYXIuRGF0YVJlc291cmNlLmdldFNlbGVjdGVkUmVzb3VyY2UiLCJUb3BiYXIuRGF0YVJlc291cmNlLmdldFJlc291cmNlcyIsIlRvcGJhci5EYXRhUmVzb3VyY2Uuc2V0U2VsZWN0ZWRSZXNvdXJjZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQ2VBLElBQU8sT0FBTyxDQVFiO0FBUkQsV0FBTyxPQUFPLEVBQUMsQ0FBQztJQUVIQSxrQkFBVUEsR0FBR0EsU0FBU0EsQ0FBQ0E7SUFFdkJBLFdBQUdBLEdBQWtCQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxrQkFBVUEsQ0FBQ0EsQ0FBQ0E7SUFFNUNBLG9CQUFZQSxHQUFHQSxtQ0FBbUNBLENBQUNBO0FBRWhFQSxDQUFDQSxFQVJNLE9BQU8sS0FBUCxPQUFPLFFBUWI7O0FDUEQsSUFBTyxPQUFPLENBU2I7QUFURCxXQUFPLE9BQU8sRUFBQyxDQUFDO0lBRUhBLGVBQU9BLEdBQUdBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLGtCQUFVQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUVwREEsZUFBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQTtRQUNuQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUN4QyxDQUFDLENBQUNBLENBQUNBO0lBRUhBLGtCQUFrQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0Esa0JBQVVBLENBQUNBLENBQUNBO0FBQzNDQSxDQUFDQSxFQVRNLE9BQU8sS0FBUCxPQUFPLFFBU2I7O0FDVkQsSUFBTyxPQUFPLENBb0JiO0FBcEJELFdBQU8sT0FB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TUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtRQUMvQkEsQ0FBQ0E7UUFFTUgsbUNBQVlBLEdBQW5CQTtZQUNFSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBO1FBQ2pDQSxDQUFDQTtRQUVNSiwwQ0FBbUJBLEdBQTFCQSxVQUEyQkEsUUFBZ0JBO1lBQ3pDSyxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ25DQSxDQUFDQTtRQWpDYUwsb0JBQU9BLEdBQUdBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0E7UUFrQ2hEQSxtQkFBQ0E7SUFBREEsQ0FwQ0FULEFBb0NDUyxJQUFBVDtJQXBDWUEsbUJBQVlBLEdBQVpBLFlBb0NaQSxDQUFBQTtJQUVEQSxjQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxjQUFjQSxFQUFFQSxZQUFZQSxDQUFDQSxDQUFDQTtBQUVoREEsQ0FBQ0EsRUFqRk0sTUFBTSxLQUFOLE1BQU0sUUFpRloiLCJmaWxlIjoiY29tcGlsZWQuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vaW5jbHVkZXMudHNcIi8+XG5tb2R1bGUgU2lkZWJhciB7XG5cbiAgZXhwb3J0IHZhciBwbHVnaW5OYW1lID0gXCJzaWRlYmFyXCI7XG5cbiAgZXhwb3J0IHZhciBsb2c6TG9nZ2luZy5Mb2dnZXIgPSBMb2dnZXIuZ2V0KHBsdWdpbk5hbWUpO1xuXG4gIGV4cG9ydCB2YXIgdGVtcGxhdGVQYXRoID0gXCJwbHVnaW5zL3NpZGViYXIvaHRtbC9zaWRlYmFyLmh0bWxcIjtcblxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9pbmNsdWRlcy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzaWRlYmFyR2xvYmFscy50c1wiLz5cbm1vZHVsZSBTaWRlYmFyIHtcblxuICBleHBvcnQgdmFyIF9tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShwbHVnaW5OYW1lLCBbXSk7XG5cbiAgX21vZHVsZS5kaXJlY3RpdmUoJ2hhd2t1bGFyU2lkZWJhcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFNpZGViYXIuU2lkZWJhckRpcmVjdGl2ZSgpO1xuICB9KTtcblxuICBoYXd0aW9QbHVnaW5Mb2FkZXIuYWRkTW9kdWxlKHBsdWdpbk5hbWUpO1xufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzaWRlYmFyUGx1Z2luLnRzXCIvPlxubW9kdWxlIFNpZGViYXIge1xuXG4gIHZhciBsb2c6TG9nZ2luZy5Mb2dnZXIgPSBMb2dnZXIuZ2V0KFwiU2lkZWJhclwiKTtcblxuICBleHBvcnQgY2xhc3MgU2lkZWJhckRpcmVjdGl2ZSB7XG5cbiAgICBwdWJsaWMgcmVzdHJpY3QgPSAnRSc7XG4gICAgcHVibGljIHRyYW5zY2x1ZGUgPSBmYWxzZTtcbiAgICBwdWJsaWMgcmVwbGFjZSA9IGZhbHNlO1xuXG4gICAgcHVibGljIHRlbXBsYXRlVXJsID0gdGVtcGxhdGVQYXRoO1xuICB9XG5cbiAgZXhwb3J0IHZhciBTaWRlYmFyQ29udHJvbGxlciA9IF9tb2R1bGUuY29udHJvbGxlcihcIlNpZGViYXIuU2lkZWJhckNvbnRyb2xsZXJcIixcbiAgICBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicgLCgkc2NvcGUsICRyb290U2NvcGUsICRsb2NhdGlvbikgPT4ge1xuXG4gICAgJHNjb3BlLmdldENsYXNzID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgIHJldHVybiAkbG9jYXRpb24ucGF0aCgpLmluZGV4T2YocGF0aCkgPT09IDAgPyAnYWN0aXZlJyA6ICcnO1xuICAgIH07XG4gIH1dKTtcbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vaW5jbHVkZXMudHNcIi8+XG5tb2R1bGUgVG9wYmFyIHtcblxuICBleHBvcnQgdmFyIHBsdWdpbk5hbWUgPSBcInRvcGJhclwiO1xuXG4gIGV4cG9ydCB2YXIgbG9nOkxvZ2dpbmcuTG9nZ2VyID0gTG9nZ2VyLmdldChwbHVnaW5OYW1lKTtcblxuICBleHBvcnQgdmFyIHRlbXBsYXRlUGF0aCA9IFwicGx1Z2lucy90b3BiYXIvaHRtbC90b3BiYXIuaHRtbFwiO1xuXG4gIGV4cG9ydCB2YXIgZ2xvYmFsVGVuYW50SWQgPSBcInRlc3RcIjtcblxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9pbmNsdWRlcy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0b3BiYXJHbG9iYWxzLnRzXCIvPlxubW9kdWxlIFRvcGJhciB7XG5cbiAgZXhwb3J0IHZhciBfbW9kdWxlID0gYW5ndWxhci5tb2R1bGUocGx1Z2luTmFtZSwgWyduZ1Jlc291cmNlJywgJ2hhd2t1bGFyLnNlcnZpY2VzJ10pO1xuXG4gIF9tb2R1bGUuZGlyZWN0aXZlKCdoYXdrdWxhclRvcGJhcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFRvcGJhci5Ub3BiYXJEaXJlY3RpdmUoKTtcbiAgfSk7XG5cbiAgaGF3dGlvUGx1Z2luTG9hZGVyLmFkZE1vZHVsZShwbHVnaW5OYW1lKTtcbn1cbiIsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidG9wYmFyUGx1Z2luLnRzXCIvPlxubW9kdWxlIFRvcGJhciB7XG5cbiAgdmFyIGxvZzpMb2dnaW5nLkxvZ2dlciA9IExvZ2dlci5nZXQoXCJUb3BiYXJcIik7XG5cbiAgZXhwb3J0IGNsYXNzIFRvcGJhckRpcmVjdGl2ZSB7XG5cbiAgICBwdWJsaWMgcmVzdHJpY3QgPSAnRSc7XG4gICAgcHVibGljIHRyYW5zY2x1ZGUgPSBmYWxzZTtcbiAgICBwdWJsaWMgcmVwbGFjZSA9IGZhbHNlO1xuXG4gICAgcHVibGljIHRlbXBsYXRlVXJsID0gdGVtcGxhdGVQYXRoO1xuICB9XG5cbiAgZXhwb3J0IHZhciBUb3BiYXJDb250cm9sbGVyID0gX21vZHVsZS5jb250cm9sbGVyKFwiVG9wYmFyLlRvcGJhckNvbnRyb2xsZXJcIixcbiAgICBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyRsb2NhdGlvbicsICdEYXRhUmVzb3VyY2UnLCAnRGF0YVJhbmdlJywgJ0hhd2t1bGFySW52ZW50b3J5JywgKCRzY29wZSwgJHJvb3RTY29wZSwgJGxvY2F0aW9uLCBEYXRhUmVzb3VyY2UsIERhdGFSYW5nZSwgSGF3a3VsYXJJbnZlbnRvcnkpID0+IHtcblxuICAgICRzY29wZS5yYW5nZSA9ICd3ZWVrJztcblxuICAgICRzY29wZS5nZXREYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUucmFuZ2VEYXRlcyA9IERhdGFSYW5nZS5nZXRGb3JtYXR0ZWRUaW1lUmFuZ2UoKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNldFJhbmdlID0gZnVuY3Rpb24ocmFuZ2UpIHtcbiAgICAgIERhdGFSYW5nZS5zZXRDdXN0b21SYW5nZShyYW5nZSk7XG4gICAgICAkc2NvcGUuZ2V0RGF0ZSgpO1xuICAgICAgJHNjb3BlLnJhbmdlID0gT2JqZWN0LmtleXMocmFuZ2UpWzBdO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2VOYW1lcyA9IHtcbiAgICAgICdob3VyJzogJ0xhc3QgSG91cicsXG4gICAgICAnaG91cnMnOiAnTGFzdCAxMiBIb3VycycsXG4gICAgICAnZGF5JzogJ0xhc3QgRGF5JyxcbiAgICAgICd3ZWVrJzogJ0xhc3QgV2VlaycsXG4gICAgICAnbW9udGgnOiAnTGFzdCBNb250aCcsXG4gICAgICAneWVhcic6ICdMYXN0IFllYXInXG4gICAgfTtcblxuICAgICRzY29wZS51cGRhdGVSZXNvdXJjZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIERhdGFSZXNvdXJjZS51cGRhdGVSZXNvdXJjZXMoKS50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJHNjb3BlLnJlc291cmNlcyA9IGRhdGE7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmdldFNlbGVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzb3VyY2U6IERhdGFSZXNvdXJjZS5nZXRTZWxlY3RlZFJlc291cmNlKCksXG4gICAgICAgIHN0YXJ0OiBEYXRhUmFuZ2UuZ2V0U3RhcnREYXRlKCksXG4gICAgICAgIGVuZDogRGF0YVJhbmdlLmdldEVuZERhdGUoKVxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNldFNlbGVjdGlvbiA9IGZ1bmN0aW9uKHJlc291cmNlSWQpIHtcbiAgICAgIERhdGFSZXNvdXJjZS5zZXRTZWxlY3RlZFJlc291cmNlKHJlc291cmNlSWQpO1xuICAgIH07XG5cbiAgICAvLy8gSW5pdGlhbGl6ZVxuICAgICRzY29wZS51cGRhdGVSZXNvdXJjZXMoKTtcbiAgICAkc2NvcGUuZ2V0U2VsZWN0aW9uKCk7XG4gICAgJHNjb3BlLmdldERhdGUoKTtcblxuICB9XSk7XG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRvcGJhckdsb2JhbHMudHNcIi8+XG5tb2R1bGUgVG9wYmFyIHtcblxuICBleHBvcnQgY2xhc3MgRGF0YVJhbmdlIHtcblxuICAgIHN0YXJ0VGltZXN0YW1wOiBudW1iZXI7XG4gICAgZW5kVGltZXN0YW1wOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIC8vLyBkZWZhdWx0cyB0byBsYXN0IDcgZGF5c1xuICAgICAgdGhpcy5lbmRUaW1lc3RhbXAgPSBtb21lbnQoKS52YWx1ZU9mKCk7XG4gICAgICB0aGlzLnN0YXJ0VGltZXN0YW1wID0gbW9tZW50KHRoaXMuZW5kVGltZXN0YW1wKS5zdWJ0cmFjdCh7ZGF5czogN30pLnZhbHVlT2YoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q3VzdG9tUmFuZ2UocmFuZ2VWYWx1ZTogT2JqZWN0LCBjdXN0b21FbmRUaW1lc3RhbXA6IG51bWJlcikge1xuICAgICAgdGhpcy5lbmRUaW1lc3RhbXAgPSBjdXN0b21FbmRUaW1lc3RhbXAgfHwgbW9tZW50KCkudmFsdWVPZigpO1xuICAgICAgdGhpcy5zdGFydFRpbWVzdGFtcCA9IG1vbWVudCh0aGlzLmVuZFRpbWVzdGFtcCkuc3VidHJhY3QocmFuZ2VWYWx1ZSkudmFsdWVPZigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTdGFydERhdGUoKTpEYXRlIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLnN0YXJ0VGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RW5kRGF0ZSgpOkRhdGUge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMuZW5kVGltZXN0YW1wKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Rm9ybWF0dGVkVGltZVJhbmdlKCk6c3RyaW5nIHtcbiAgICAgIHZhciBkaWZmID0gdGhpcy5lbmRUaW1lc3RhbXAgLSB0aGlzLnN0YXJ0VGltZXN0YW1wO1xuICAgICAgdmFyIG1vbVN0YXJ0ID0gbW9tZW50KHRoaXMuc3RhcnRUaW1lc3RhbXApO1xuICAgICAgdmFyIG1vbUVuZCA9IG1vbWVudCh0aGlzLmVuZFRpbWVzdGFtcCk7XG5cbiAgICAgIGlmIChkaWZmIDwgMjQgKiA2MCAqIDYwICogMTAwMCkge1xuICAgICAgICByZXR1cm4gbW9tU3RhcnQuZm9ybWF0KCdEIE1NTSBZWVlZJykgKyAnICcgKyBtb21TdGFydC5mb3JtYXQoJ0hIOm1tJykgKyAnIC0gJyArIChtb21TdGFydC5kYXkoKSAhPT0gbW9tRW5kLmRheSgpID8gbW9tRW5kLmZvcm1hdCgnRCBNTU0gWVlZWSAnKSAgOiAnJykgKyBtb21FbmQuZm9ybWF0KCdISDptbScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG1vbVN0YXJ0LmZvcm1hdCgnRCBNTU0gWVlZWScpICsgJyAtICcgKyBtb21FbmQuZm9ybWF0KCdEIE1NTSBZWVlZJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX21vZHVsZS5zZXJ2aWNlKCdEYXRhUmFuZ2UnLCBEYXRhUmFuZ2UpO1xuXG4gIGV4cG9ydCBjbGFzcyBEYXRhUmVzb3VyY2Uge1xuXG4gICAgcHVibGljIHN0YXRpYyAkaW5qZWN0ID0gWydIYXdrdWxhckludmVudG9yeSddO1xuXG4gICAgZ2xvYmFsUmVzb3VyY2VMaXN0OiBhbnk7XG4gICAgc2VsZWN0ZWRSZXNvdXJjZTogU3RyaW5nO1xuXG4gICAgaGtJbnZlbnRvcnk6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgSGF3a3VsYXJJbnZlbnRvcnk6YW55KSB7XG4gICAgICB0aGlzLmhrSW52ZW50b3J5ID0gSGF3a3VsYXJJbnZlbnRvcnk7XG4gICAgICB0aGlzLnVwZGF0ZVJlc291cmNlcygpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVSZXNvdXJjZXMoKTphbnkge1xuICAgICAgcmV0dXJuIHRoaXMuaGtJbnZlbnRvcnkuUmVzb3VyY2UucXVlcnkoe3RlbmFudElkOiBnbG9iYWxUZW5hbnRJZH0pLiRwcm9taXNlLlxuICAgICAgICB0aGVuKChyZXNvdXJjZXMpPT4ge1xuICAgICAgICAgIHRoaXMuZ2xvYmFsUmVzb3VyY2VMaXN0ID0gcmVzb3VyY2VzO1xuICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RlZFJlc291cmNlKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUmVzb3VyY2UgPSByZXNvdXJjZXNbcmVzb3VyY2VzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzb3VyY2VzO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U2VsZWN0ZWRSZXNvdXJjZSgpOlN0cmluZyB7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFJlc291cmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRSZXNvdXJjZXMoKTphbnkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2xvYmFsUmVzb3VyY2VMaXN0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRTZWxlY3RlZFJlc291cmNlKHJlc291cmNlOiBTdHJpbmcpOnZvaWQge1xuICAgICAgdGhpcy5zZWxlY3RlZFJlc291cmNlID0gcmVzb3VyY2U7XG4gICAgfVxuICB9XG5cbiAgX21vZHVsZS5zZXJ2aWNlKCdEYXRhUmVzb3VyY2UnLCBEYXRhUmVzb3VyY2UpO1xuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
angular.module("hawkular-ui-components-directives-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/sidebar/html/sidebar.html","<div class=\"col-sm-3 col-md-2 sidebar-pf sidebar-pf-left sidebar-pf-dark sidebar-pf-big-icons\">\n\n  <ul class=\"nav nav-pills nav-stacked nav-dark nav-big-icons\">\n    <li ng-class=\"getClass(\'/metrics/responseTime\')\"><a href=\"/metrics/responseTime\"><i class=\"fa fa-line-chart\"></i>Response Time</a></li>\n    <li ng-class=\"getClass(\'/metrics/upDowntime\')\"><a href=\"/metrics/upDowntime\"><i class=\"fa fa-arrow-up\"></i>Up / Downtime</a></li>\n    <li ng-class=\"getClass(\'/metrics/alerts\')\"><a href=\"/metrics/alerts\"><i class=\"fa fa-flag\"></i>Alerts</a></li>\n  </ul>\n</div>");
$templateCache.put("plugins/topbar/html/topbar.html","<ul class=\"nav navbar-nav navbar-primary navbar-selector navbar-dark row\">\n  <li class=\"dropdown context col-sm-3 col-md-2\">\n    <a href=\"#\" class=\"dropdown-toggle additional-info\" data-toggle=\"dropdown\" ng-hide=\"resources.length === 0\">\n      {{getSelection().resource.id}}\n      <span>{{getSelection().resource.parameters.url}}</span>\n      <b class=\"caret\"></b>\n    </a>\n    <a href=\"/metrics/addUrl\" class=\"additional-info\" ng-show=\"resources.length === 0\">\n      No Resources Available\n      <span>Add a Resource</span>\n    </a>\n    <ul class=\"dropdown-menu\">\n      <li ng-class=\"{\'active\': getSelection().resource.id == resource.id}\" ng-repeat=\"resource in resources\">\n        <a href=\"\" ng-click=\"setSelection(resource)\">{{resource.id}}</a>\n      </li>\n      <li class=\"divider\"></li>\n      <li>\n        <a href=\"/metrics/addUrl\">Add Application...</a>\n      </li>\n    </ul>\n  </li>\n\n  <li class=\"pull-right date-range dropdown\">\n    <i class=\"fa fa-calendar\"></i>\n    <div class=\"input\" data-toggle=\"dropdown\">\n      {{rangeNames[range]}} <span class=\"additional-info\">({{rangeDates}})</span>\n    </div>\n\n    <div class=\"dropdown-menu infotip bottom-right\">\n      <div class=\"arrow\"></div>\n      <div class=\"dropdown-menu-content\">\n        <span class=\"label\">Last</span>\n        <div class=\"btn-group\">\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'hour\'}\" ng-click=\"setRange({hour: 1})\">1h</button>\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'hours\'}\" ng-click=\"setRange({hours: 12})\">12h</button>\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'day\'}\" ng-click=\"setRange({day: 1})\">Day</button>\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'week\'}\" ng-click=\"setRange({week: 1})\">Week</button>\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'month\'}\" ng-click=\"setRange({month: 1})\">Month</button>\n          <button type=\"button\" class=\"btn btn-default\" ng-class=\"{\'active\': range === \'year\'}\" ng-click=\"setRange({year: 1})\">Year</button>\n        </div>\n      </div>\n    </div>\n  </li>\n</ul>");}]); hawtioPluginLoader.addModule("hawkular-ui-components-directives-templates");