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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzLmpzIiwiL1VzZXJzL2FtbWVuZG9uY2EvRHJvcGJveC93b3JrL3dvcmtzcGFjZS9yZWRoYXQvaGF3a3VsYXItdWktY29tcG9uZW50cy9zaWRlYmFyL3RzL3NpZGViYXJHbG9iYWxzLnRzIiwiL1VzZXJzL2FtbWVuZG9uY2EvRHJvcGJveC93b3JrL3dvcmtzcGFjZS9yZWRoYXQvaGF3a3VsYXItdWktY29tcG9uZW50cy9zaWRlYmFyL3RzL3NpZGViYXJQbHVnaW4udHMiLCIvVXNlcnMvYW1tZW5kb25jYS9Ecm9wYm94L3dvcmsvd29ya3NwYWNlL3JlZGhhdC9oYXdrdWxhci11aS1jb21wb25lbnRzL3NpZGViYXIvdHMvc2lkZWJhckRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6WyJTaWRlYmFyIiwiU2lkZWJhci5TaWRlYmFyRGlyZWN0aXZlIiwiU2lkZWJhci5TaWRlYmFyRGlyZWN0aXZlLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDZUEsSUFBTyxPQUFPLENBUWI7QUFSRCxXQUFPLE9BQU8sRUFBQyxDQUFDO0lBRUhBLGtCQUFVQSxHQUFHQSxTQUFTQSxDQUFDQTtJQUV2QkEsV0FBR0EsR0FBa0JBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLGtCQUFVQSxDQUFDQSxDQUFDQTtJQUU1Q0Esb0JBQVlBLEdBQUdBLG1DQUFtQ0EsQ0FBQ0E7QUFFaEVBLENBQUNBLEVBUk0sT0FBTyxLQUFQLE9BQU8sUUFRYjs7QUNQRCxJQUFPLE9BQU8sQ0FTYjtBQVRELFdBQU8sT0FBTyxFQUFDLENBQUM7SUFFSEEsZUFBT0EsR0FBR0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0Esa0JBQVVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO0lBRXBEQSxlQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxpQkFBaUJBLEVBQUVBO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3hDLENBQUMsQ0FBQ0EsQ0FBQ0E7SUFFSEEsa0JBQWtCQSxDQUFDQSxTQUFTQSxDQUFDQSxrQkFBVUEsQ0FBQ0EsQ0FBQ0E7QUFDM0NBLENBQUNBLEVBVE0sT0FBTyxLQUFQLE9BQU8sUUFTYjs7QUNWRCxJQUFPLE9BQU8sQ0FtQmI7QUFuQkQsV0FBTyxPQUFPLEVBQUMsQ0FBQztJQUVkQSxJQUFJQSxHQUFHQSxHQUFrQkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7SUFFL0NBLElBQWFBLGdCQUFnQkE7UUFBN0JDLFNBQWFBLGdCQUFnQkE7WUFFcEJDLGFBQVFBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ2ZBLGVBQVVBLEdBQUdBLEtBQUtBLENBQUNBO1lBRW5CQSxnQkFBV0EsR0FBR0Esb0JBQVlBLENBQUNBO1FBQ3BDQSxDQUFDQTtRQUFERCx1QkFBQ0E7SUFBREEsQ0FOQUQsQUFNQ0MsSUFBQUQ7SUFOWUEsd0JBQWdCQSxHQUFoQkEsZ0JBTVpBLENBQUFBO0lBRVVBLHlCQUFpQkEsR0FBR0EsZUFBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsMkJBQTJCQSxFQUMzRUEsQ0FBQ0EsUUFBUUEsRUFBRUEsWUFBWUEsRUFBRUEsV0FBV0EsRUFBRUEsVUFBQ0EsTUFBTUEsRUFBRUEsVUFBVUEsRUFBRUEsU0FBU0E7UUFFcEVBLE1BQU1BLENBQUNBLFFBQVFBLEdBQUdBLFVBQVVBLElBQUlBO1lBQzlCLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQzlELENBQUMsQ0FBQ0E7SUFDSkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDTkEsQ0FBQ0EsRUFuQk0sT0FBTyxLQUFQLE9BQU8sUUFtQmIiLCJmaWxlIjoiY29tcGlsZWQuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vaW5jbHVkZXMudHNcIi8+XG5tb2R1bGUgU2lkZWJhciB7XG5cbiAgZXhwb3J0IHZhciBwbHVnaW5OYW1lID0gXCJzaWRlYmFyXCI7XG5cbiAgZXhwb3J0IHZhciBsb2c6TG9nZ2luZy5Mb2dnZXIgPSBMb2dnZXIuZ2V0KHBsdWdpbk5hbWUpO1xuXG4gIGV4cG9ydCB2YXIgdGVtcGxhdGVQYXRoID0gXCJwbHVnaW5zL3NpZGViYXIvaHRtbC9zaWRlYmFyLmh0bWxcIjtcblxufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9pbmNsdWRlcy50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzaWRlYmFyR2xvYmFscy50c1wiLz5cbm1vZHVsZSBTaWRlYmFyIHtcblxuICBleHBvcnQgdmFyIF9tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShwbHVnaW5OYW1lLCBbXSk7XG5cbiAgX21vZHVsZS5kaXJlY3RpdmUoJ2hhd2t1bGFyU2lkZWJhcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFNpZGViYXIuU2lkZWJhckRpcmVjdGl2ZSgpO1xuICB9KTtcblxuICBoYXd0aW9QbHVnaW5Mb2FkZXIuYWRkTW9kdWxlKHBsdWdpbk5hbWUpO1xufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzaWRlYmFyUGx1Z2luLnRzXCIvPlxubW9kdWxlIFNpZGViYXIge1xuXG4gIHZhciBsb2c6TG9nZ2luZy5Mb2dnZXIgPSBMb2dnZXIuZ2V0KFwiU2lkZWJhclwiKTtcblxuICBleHBvcnQgY2xhc3MgU2lkZWJhckRpcmVjdGl2ZSB7XG5cbiAgICBwdWJsaWMgcmVzdHJpY3QgPSAnRSc7XG4gICAgcHVibGljIHRyYW5zY2x1ZGUgPSBmYWxzZTtcblxuICAgIHB1YmxpYyB0ZW1wbGF0ZVVybCA9IHRlbXBsYXRlUGF0aDtcbiAgfVxuXG4gIGV4cG9ydCB2YXIgU2lkZWJhckNvbnRyb2xsZXIgPSBfbW9kdWxlLmNvbnRyb2xsZXIoXCJTaWRlYmFyLlNpZGViYXJDb250cm9sbGVyXCIsXG4gICAgWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckbG9jYXRpb24nICwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkbG9jYXRpb24pID0+IHtcblxuICAgICRzY29wZS5nZXRDbGFzcyA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICByZXR1cm4gJGxvY2F0aW9uLnBhdGgoKS5pbmRleE9mKHBhdGgpID09PSAwID8gJ2FjdGl2ZScgOiAnJztcbiAgICB9O1xuICB9XSk7XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
angular.module("hawkular-ui-components-directives-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/sidebar/html/sidebar.html","<aside>\n  <nav class=\"navbar navbar-vertical\" role=\"navigation\">\n    <div>\n      <ul>\n        <li class=\"response\" ng-class=\"getClass(\'/metrics/responseTime\')\"><a href=\"/metrics/responseTime\"><i class=\"fa fa-line-chart\"></i>Response Time</a>\n        </li>\n        <li class=\"uptime\" ng-class=\"getClass(\'/metrics/upDowntime\')\"><a href=\"/metrics/upDowntime\"><i class=\"fa fa-arrow-up\"></i>Up / Downtime</a>\n        </li>\n        <li class=\"alerts\" ng-class=\"getClass(\'/metrics/alerts\')\"><a href=\"/metrics/alerts\"><i class=\"fa fa-flag\"></i>Alerts</a>\n        </li>\n      </ul>\n    </div>\n  </nav>\n</aside>\n");}]); hawtioPluginLoader.addModule("hawkular-ui-components-directives-templates");