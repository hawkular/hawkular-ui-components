/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		1:0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + ".js/" + ({"0":"demo-app"}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = ".";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(21);
	module.exports = __webpack_require__(23);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 22 */,
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="tsd.d.ts"/>
	var loader_1 = __webpack_require__(24);
	var loader_2 = __webpack_require__(56);
	var loader_3 = __webpack_require__(60);
	var app = angular.module('miQStaticAssets', ['ui.bootstrap', 'ui.bootstrap.tabs', 'rx']);
	loader_1.default(app);
	loader_2.default(app);
	loader_3.default(app);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var loader_1 = __webpack_require__(25);
	var loader_2 = __webpack_require__(33);
	var loader_3 = __webpack_require__(39);
	var loader_4 = __webpack_require__(46);
	var actionButtonsDirective_1 = __webpack_require__(51);
	var validateCredentialsComponent_1 = __webpack_require__(53);
	var sortItemsComponent_1 = __webpack_require__(62);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    loader_1.default(module);
	    loader_2.default(module);
	    loader_3.default(module);
	    loader_4.default(module);
	    module.directive('miqActionButtons', actionButtonsDirective_1.default.Factory());
	    module.component('miqValidateCredentials', new validateCredentialsComponent_1.default);
	    module.component('miqSortItems', new sortItemsComponent_1.default);
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var toolbarComponent_1 = __webpack_require__(26);
	var toolbarButtonDirective_1 = __webpack_require__(29);
	var toolbarListDirective_1 = __webpack_require__(31);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.component('miqToolbarMenu', new toolbarComponent_1.default);
	    module.directive('miqToolbarButton', toolbarButtonDirective_1.default.Factory());
	    module.directive('miqToolbarList', toolbarListDirective_1.default.Factory());
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var toolbarController_1 = __webpack_require__(27);
	var Toolbar = (function () {
	    function Toolbar() {
	        this.replace = true;
	        this.template = __webpack_require__(28);
	        this.controller = toolbarController_1.default;
	        this.controllerAs = 'vm';
	        this.bindings = {
	            toolbarItems: '='
	        };
	    }
	    return Toolbar;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Toolbar;


/***/ },
/* 27 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var ToolbarController = (function () {
	    /*@ngInject*/
	    function ToolbarController($window, $location) {
	        this.$window = $window;
	        this.$location = $location;
	    }
	    ToolbarController.$inject = ["$window", "$location"];
	    ToolbarController.prototype.onItemClick = function (item) {
	        if (item.hasOwnProperty('actionUrl')) {
	            this.$location.path(item.actionUrl);
	        }
	        else if (item.hasOwnProperty('redirectUrl')) {
	            this.$window.location = item.redirectUrl;
	        }
	        else if (item.hasOwnProperty('actionFunction')) {
	            item.actionFunction();
	        }
	    };
	    return ToolbarController;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ToolbarController;


/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = "<div class=\"toolbar-pf-actions miq-toolbar-actions\">\n    <div class=\"form-group\">\n      <miq-toolbar-list ng-repeat=\"item in vm.toolbarItems | filter: children\"\n                        toolbar-list=\"item\"\n                        on-item-click=\"vm.onItemClick(item)\">\n      </miq-toolbar-list>\n    </div>\n</div>\n"

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var ToolbarButton = (function () {
	    function ToolbarButton() {
	        this.replace = true;
	        this.template = __webpack_require__(30);
	        this.scope = {
	            toolbarButton: '='
	        };
	    }
	    ToolbarButton.Factory = function () {
	        var directive = function () { return new ToolbarButton(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return ToolbarButton;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ToolbarButton;


/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = "<div>\n  Button\n</div>\n"

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var ToolbarList = (function () {
	    function ToolbarList() {
	        this.replace = true;
	        this.template = __webpack_require__(32);
	        this.scope = {
	            toolbarList: '=',
	            onItemClick: '&'
	        };
	    }
	    ToolbarList.Factory = function () {
	        var directive = function () { return new ToolbarList(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return ToolbarList;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ToolbarList;


/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = "<div class=\"btn-group\" dropdown>\n  <button type=\"button\" dropdown-toggle class=\"btn dropdown-toggle btn-default\"\n          ng-class=\"{disabled: toolbarList.disabled}\" title=\"{{toolbarList.title}}\">\n    <i class=\"{{toolbarList.icon}}\" style=\"margin-right: 5px;\" ng-if=\"toolbarList.icon\"></i>\n    {{toolbarList.title}}\n    <span class=\"caret\"></span>\n  </button>\n  <ul class=\"dropdown-menu\" role=\"menu\">\n    <li ng-repeat=\"item in toolbarList.children\" ng-class=\"{disabled: item.disabled}\">\n      <a href=\"#\" ng-click=\"onItemClick({item: item})\">\n        <i ng-if=\"item.icon\" class=\"{{item.icon}}\"></i>\n        {{item.title}}\n      </a>\n    </li>\n  </ul>\n</div>\n"

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var dataTableComponent_1 = __webpack_require__(34);
	var dataTablePaginationDirective_1 = __webpack_require__(37);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.component('miqDataTable', new dataTableComponent_1.default);
	    module.directive('miqDataTablePagination', dataTablePaginationDirective_1.default.Factory());
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var dataTablecontroller_1 = __webpack_require__(35);
	var DataTable = (function () {
	    function DataTable() {
	        this.replace = true;
	        this.template = __webpack_require__(36);
	        this.controller = dataTablecontroller_1.default;
	        this.controllerAs = 'vm';
	        this.bindings = {
	            onRowClick: '&',
	            onItemSelected: '&',
	            data: '=',
	            columns: '=',
	            selectable: '=',
	            noFooter: '=',
	            defaultAction: '='
	        };
	    }
	    return DataTable;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = DataTable;


/***/ },
/* 35 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var DataTableController = (function () {
	    function DataTableController() {
	        this.sortType = -1;
	        this.resPerPage = 10;
	        this.resCurPage = 0;
	        this.noFooter = false;
	        this.selectable = true;
	    }
	    Object.defineProperty(DataTableController, "assetUrl", {
	        get: function () {
	            return '/assets/';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DataTableController.prototype.isFilteredBy = function (key) {
	        return this.sortType === key;
	    };
	    DataTableController.prototype.getColumnClass = function (column) {
	        return {
	            narrow: column.is_narrow,
	            miqTextLeft: column.align === 'left',
	            miqTextRight: column.align === 'right'
	        };
	    };
	    DataTableController.prototype.onSortClick = function (column) {
	        if (column.sort) {
	            this.sortType = column['col_idx'];
	            this.sortReverse = !this.sortReverse;
	        }
	    };
	    DataTableController.prototype.isCheckbox = function (row, columnKey) {
	        return row.cells[columnKey].hasOwnProperty('is_checkbox') && row.cells[columnKey]['is_checkbox'];
	    };
	    DataTableController.prototype.isIconOrImage = function (row, columnKey) {
	        return DataTableController.isImage(row, columnKey) ||
	            DataTableController.isIcon(row, columnKey);
	    };
	    DataTableController.isIcon = function (row, columnKey) {
	        return row.cells[columnKey].hasOwnProperty('icon') && row.cells[columnKey]['icon'] !== null;
	    };
	    DataTableController.isImage = function (row, columnKey) {
	        return row.cells[columnKey].hasOwnProperty('image') && row.cells[columnKey]['image'] !== null;
	    };
	    DataTableController.prototype.buildImageUrl = function (row, columnKey) {
	        var imagePath = DataTableController.isIcon(row, columnKey) ?
	            row.cells[columnKey]['icon'] : row.cells[columnKey]['image'];
	        return DataTableController.assetUrl + imagePath;
	    };
	    DataTableController.prototype.setPage = function (page) {
	        this.resCurPage = page;
	    };
	    DataTableController.prototype.getSortTypeAsText = function () {
	        var selectedFilter = _.find(this.columns, { col_idx: this.sortType });
	        if (selectedFilter) {
	            return selectedFilter.text;
	        }
	    };
	    DataTableController.prototype.onCheckAll = function (isChecked) {
	        _.each(this.data, function (oneItem) {
	            oneItem.selected = isChecked;
	        });
	        this.onItemSelected();
	    };
	    DataTableController.prototype.onRowSelected = function ($event) {
	        $event.stopPropagation();
	        this.onItemSelected();
	    };
	    return DataTableController;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = DataTableController;


/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = "<div>\n  <table class=\"table table-bordered table-striped table-hover mig-table-with-footer mig-table\">\n    <thead>\n    <tr>\n      <th class=\"narrow miq-select\" ng-if=\"vm.selectable\">\n        <input ng-if=\"vm.data.length !== 0\" type=\"checkbox\" ng-model=\"isChecked\" ng-click=\"vm.onCheckAll(isChecked)\" title=\"Select all\">\n      </th>\n      <th ng-repeat=\"column in vm.columns\" ng-click=\"vm.onSortClick(column)\"\n          ng-class=\"vm.getColumnClass(column)\">\n        <div ng-if=\"column.sort\">\n          {{column.text}}\n          <div class=\"pull-right\">\n            <i ng-if=\"vm.isFilteredBy(column.col_idx) && !vm.sortReverse\" class=\"fa fa-sort-desc\"></i>\n            <i ng-if=\"vm.isFilteredBy(column.col_idx) && vm.sortReverse\" class=\"fa fa-sort-asc\"></i>\n          </div>\n        </div>\n      </th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr ng-repeat=\"row in vm.data | orderBy : vm.sortType : vm.sortReverse\"\n        ng-class=\"{active : row.selected}\"\n        ng-click=\"vm.onRowClick({$event: $event, rowData: row})\">\n      <td class=\"narrow\" ng-if=\"vm.selectable\" onclick=\"event.stopPropagation();\">\n        <input ng-click=\"vm.onRowSelected($event)\"\n               onclick=\"event.stopPropagation();\"\n               type=\"checkbox\"\n               ng-model=\"row.selected\"\n               name=\"check_{{row.id}}\"\n               value=\"{{row.id}}\"\n               ng-checked=\"row.selected\"\n               class=\"list-grid-checkbox\">\n      </td>\n      <td ng-repeat=\"(columnKey, column) in vm.columns\"\n          ng-class=\"vm.getColumnClass(column)\">\n        <img ng-if=\"vm.isIconOrImage(row, columnKey)\"\n             alt=\"row.cells[columnKey].title\"\n             title=\"row.cells[columnKey].title\"\n             ng-src=\"{{vm.buildImageUrl(row, columnKey)}}\">\n            <span ng-if=\"row.cells[columnKey].text\">\n                {{row.cells[columnKey].text}}\n            </span>\n      </td>\n    </tr>\n    <tr ng-if=\"vm.data.length === 0\">\n      <td colspan=\"{{vm.columns.length + (vm.selectable? 1 : 0)}}\">\n        <p>It looks like this table has no data.</p>\n        <p ng-if=\"vm.defaultAction\">\n          Why don't you try\n            <a ng-click=\"vm.defaultAction.actionFunction()\">{{vm.defaultAction.title}}</a>\n          so this table would not be empty.\n        </p>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <div ng-if=\"!vm.noFooter\" class=\"dataTables_footer\">\n        <span class=\"pull-right\">\n            <miq-data-table-pagination resource-list=\"vm.data\"\n                                       current-page=\"vm.resCurPage\"\n                                       page-setter=\"vm.setPage\"\n                                       per-page=\"vm.resPerPage\">\n            </miq-data-table-pagination>\n        </span>\n  </div>\n</div>\n"

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var DataTablePagination = (function () {
	    function DataTablePagination() {
	        this.template = __webpack_require__(38);
	        this.scope = {
	            resourceList: '=',
	            currentPage: '=',
	            linkHeader: '=',
	            pageSetter: '&',
	            perPage: '='
	        };
	        this.replace = true;
	        this.link = function ($scope, element, attrs) {
	            $scope.currentPageView = $scope.currentPage + 1;
	            $scope.pagesNumber = getPagesNumber();
	            function getPagesNumber() {
	                return $scope.resourceList && Math.ceil(($scope.resourceList.length || 1) / $scope.perPage);
	            }
	            $scope.setPage = function (pageNumber) {
	                $scope.pagesNumber = getPagesNumber();
	                if ($scope.pagesNumber === 1) {
	                    $scope.currentPageView = 1;
	                    return;
	                }
	                if (pageNumber < 1) {
	                    $scope.pageSetter({ pageNumber: 0 });
	                    $scope.currentPageView = 1;
	                }
	                else if (pageNumber >= $scope.pagesNumber) {
	                    $scope.pageSetter({ pageNumber: $scope.pagesNumber - 1 });
	                    $scope.currentPageView = pageNumber;
	                }
	                else {
	                    $scope.pageSetter({ pageNumber: pageNumber });
	                }
	            };
	            $scope.goToFirst = function () {
	                $scope.pageSetter({ pageNumber: 0 });
	            };
	            $scope.goToLast = function () {
	                $scope.pagesNumber = getPagesNumber();
	                $scope.pageSetter({ pageNumber: $scope.pagesNumber - 1 });
	            };
	            $scope.goTos = [0];
	            $scope.$watch('currentPage', function (recentCurrentPage) {
	                $scope.currentPageView = parseInt(recentCurrentPage, 10) + 1;
	            });
	            $scope.$watchGroup(['perPage'], function () {
	                $scope.pagesNumber = getPagesNumber();
	                $scope.goTos = new Array($scope.pagesNumber);
	            });
	        };
	    }
	    DataTablePagination.Factory = function () {
	        var directive = function () { return new DataTablePagination(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return DataTablePagination;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = DataTablePagination;


/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = "<div class=\"dataTables_paginate paging_bootstrap_input\" id=\"DataTables_Table_0_paginate\">\n  <ul class=\"pagination\">\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"first\" ng-click=\"goToFirst()\"><span\n      class=\"i fa fa-angle-double-left\"></span></li>\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"prev\" ng-click=\"setPage(currentPage - 1)\"><span\n      class=\"i fa fa-angle-left\"></span></li>\n  </ul>\n  <div class=\"pagination-input\">\n    <form ng-submit=\"setPage(currentPageView - 1)\">\n      <input type=\"text\" class=\"paginate_input\" ng-model=\"currentPageView\">\n      <span class=\"paginate_of\">of <b>{{goTos.length}}</b></span>\n    </form>\n  </div>\n  <ul class=\"pagination\">\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"next\" ng-click=\"setPage(currentPage + 1)\"><span\n      class=\"i fa fa-angle-right\"></span></li>\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"last\" ng-click=\"goToLast()\"><span\n      class=\"i fa fa-angle-double-right\"></span></li>\n  </ul>\n</div>\n"

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var notificationsDirective_1 = __webpack_require__(40);
	var notificationSectionComponent_1 = __webpack_require__(43);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.directive('miqNotifications', notificationsDirective_1.default.Factory());
	    module.component('miqNotificationSection', new notificationSectionComponent_1.default);
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var notificationsController_1 = __webpack_require__(41);
	var Notifications = (function () {
	    function Notifications() {
	        this.replace = true;
	        this.template = __webpack_require__(42);
	        this.controller = notificationsController_1.default;
	        this.controllerAs = 'vm';
	        this.scope = {};
	        this.bindToController = {
	            dismissible: '=',
	            header: '=',
	            body: '=',
	            type: '=',
	            onDismiss: '&'
	        };
	    }
	    Notifications.Factory = function () {
	        var directive = function () { return new Notifications(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return Notifications;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Notifications;


/***/ },
/* 41 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var NotificationsController = (function () {
	    function NotificationsController() {
	    }
	    NotificationsController.prototype.getClassFromType = function () {
	        return {
	            'alert-danger': this.type === 'danger',
	            'alert-warning': this.type === 'warning',
	            'alert-success': this.type === 'success',
	            'alert-info': this.type === 'info' || this.type === 'loading',
	            'alert-dismissable': this.dismissible
	        };
	    };
	    NotificationsController.prototype.getIconByType = function () {
	        return {
	            'pficon-error-circle-o': this.type === 'danger',
	            'pficon-warning-triangle-o': this.type === 'warning',
	            'pficon-ok': this.type === 'success',
	            'pficon-info': this.type === 'info',
	            'spinner miq-alert-loading': this.type === 'loading'
	        };
	    };
	    return NotificationsController;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = NotificationsController;


/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = "<div class=\"alert\" ng-class=\"vm.getClassFromType()\">\n  <button type=\"button\" class=\"close\" ng-click=\"vm.onDismiss()\" aria-hidden=\"true\" ng-if=\"vm.dismissible\">\n    <span class=\"pficon pficon-close\"></span>\n  </button>\n  <span ng-class=\"vm.getIconByType()\" class=\"pficon\"></span>\n  <strong ng-if=\"vm.header\">{{vm.header}}</strong> <span>{{(vm.body?vm.body:'&nbsp;')}}</span>\n</div>\n"

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var notificationSectionController_1 = __webpack_require__(44);
	var NotificationSection = (function () {
	    function NotificationSection() {
	        this.replace = true;
	        this.template = __webpack_require__(45);
	        this.controller = notificationSectionController_1.default;
	        this.controllerAs = 'vm';
	        this.scope = {};
	        this.bindings = {
	            limit: '=',
	            timer: '=',
	            showInfo: '@'
	        };
	    }
	    return NotificationSection;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = NotificationSection;


/***/ },
/* 44 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	var NotificationSectionController = (function () {
	    /* @ngInject */
	    function NotificationSectionController(MiQNotificationService, $timeout, $scope, rx) {
	        var _this = this;
	        this.MiQNotificationService = MiQNotificationService;
	        this.$timeout = $timeout;
	        this.$scope = $scope;
	        this.rx = rx;
	        this.activeNotifications = [];
	        var disposable = MiQNotificationService.notificationSubject.subscribe(function (data) { return _this.onNext(data); }, function (error) { return _this.onError(error); });
	        $scope.$eventToObservable('$destroy')
	            .subscribe(function () { return disposable.dispose(); });
	    }
	    NotificationSectionController.$inject = ["MiQNotificationService", "$timeout", "$scope", "rx"];
	    /**
	     *
	     * @param data
	       */
	    NotificationSectionController.prototype.onNext = function (data) {
	        if (data.loadingItem) {
	            this.disposeItem(data.loadingItem);
	        }
	        this.activeNotifications.unshift(data);
	        //Work arround for safeApply on Scope
	        this.rx.Observable.interval()
	            .safeApply(this.$scope)
	            .subscribe();
	        if (this.timer) {
	            this.removeItemAfterTimer(data);
	        }
	    };
	    /**
	     *
	     * @param item
	       */
	    NotificationSectionController.prototype.removeItemAfterTimer = function (item) {
	        var _this = this;
	        this.rx.Observable.timer(this.timer)
	            .subscribe(function () { return _this.disposeItem(item); });
	    };
	    /**
	     *
	     * @param err
	       */
	    NotificationSectionController.prototype.onError = function (err) {
	        console.error('On error ', err);
	    };
	    NotificationSectionController.prototype.disposeItem = function (item) {
	        var indexToRemove = _.findIndex(this.activeNotifications, item);
	        if (indexToRemove !== -1) {
	            this.onDismiss(indexToRemove);
	        }
	    };
	    /**
	     *
	     * @param key
	       */
	    NotificationSectionController.prototype.onDismiss = function (key) {
	        this.activeNotifications.splice(key, 1);
	    };
	    return NotificationSectionController;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = NotificationSectionController;


/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = "<div class=\"miq-alert-section\">\n  <div class=\"miq-info-alert\" ng-if=\"vm.showInfo && (vm.limit ? vm.limit : 1) < vm.activeNotifications.length\">\n    And {{vm.activeNotifications.length - (vm.limit ? vm.limit : 1)}} more\n  </div>\n  <miq-notifications ng-repeat=\"(key, alert) in vm.activeNotifications | limitTo: (vm.limit ? vm.limit : 1)\"\n                     type=\"alert.type\"\n                     header=\"alert.header\"\n                     body=\"alert.body\"\n                     dismissible=\"alert.dismissible\"\n                     on-dismiss=\"vm.onDismiss(key)\">\n  </miq-notifications>\n</div>\n"

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var tileViewComponent_1 = __webpack_require__(47);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.component('miqTileView', new tileViewComponent_1.default(__webpack_require__(49)));
	    module.component('miqSmallTileView', new tileViewComponent_1.default(__webpack_require__(50)));
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../../tsd.d.ts"/>
	var tileViewController_1 = __webpack_require__(48);
	var TileView = (function () {
	    function TileView(template) {
	        this.template = template;
	        this.replace = true;
	        this.controller = tileViewController_1.default;
	        this.controllerAs = 'vmCtrl';
	        this.bindings = {
	            items: '=',
	            headers: '=',
	            onTileSelect: '&',
	            onTileClick: '&'
	        };
	    }
	    return TileView;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TileView;


/***/ },
/* 48 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	var TileViewcontroller = (function () {
	    /* @ngInject */
	    function TileViewcontroller() {
	        this.numberOfVisible = 10;
	        this.slicedData = [];
	        this.perPage = 10;
	        this.$onInit = function () {
	            this.slicedData = this.items.slice(0, this.numberOfVisible);
	        };
	        this.initOptions();
	    }
	    TileViewcontroller.prototype.initOptions = function () {
	        this.options = {
	            selectionMatchProp: 'id',
	            selectItems: true,
	            multiSelect: true,
	            showSelectBox: false,
	            onClick: _.bind(this.handleClick, this),
	            selectedItems: this.filterSelected(),
	        };
	    };
	    TileViewcontroller.prototype.filterSelected = function () {
	        return this.items.filter(function (oneItem) {
	            return oneItem.selected;
	        });
	    };
	    TileViewcontroller.prototype.handleClick = function (item, event) {
	        if (event.target instanceof HTMLImageElement || event.target.tagName.toLowerCase() === 'a') {
	            event.preventDefault();
	            this.onTileClick({ $event: event, rowData: item });
	        }
	        else {
	            item.selected = !item.selected;
	            this.options.selectedItems = this.filterSelected();
	            this.onTileSelect();
	        }
	    };
	    TileViewcontroller.prototype.loadMoreItems = function () {
	        this.numberOfVisible += this.perPage;
	        this.slicedData = this.items.slice(0, this.numberOfVisible);
	    };
	    return TileViewcontroller;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TileViewcontroller;


/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = "<div class=\"miq-tile-section\">\n  <div pf-card-view config=\"vmCtrl.options\" items=\"vmCtrl.items\" class=\"miq-tile-with-body\">\n    <a href=\"#\">{{item.nameItem.text}}</a>\n    <div class=\"row miq-row-margin-only-top \">\n      <div class=\"col-md-3 col-ld-3 miq-icon-section\">\n        <a href=\"#\">\n          <img height=\"72\" class=\"miq-gradient-background\" ng-src=\"/assets/{{item.icon.image}}\" width=\"72\">\n        </a>\n      </div>\n      <div class=\"col-md-9 col-ld-9 miq-info-section\">\n        <dl class=\"dl-horizontal tile\">\n          <dt ng-repeat-start=\"(key, header) in item.headers\" ng-if=\"header.text && header.text !== 'Name'\">{{header.text}}</dt>\n          <dd ng-repeat-end ng-if=\"header.text && header.text !== 'Name'\">{{item.cells[key].text}}</dd>\n        </dl>\n      </div>\n    </div>\n  </div>\n  <div ng-if=\"vmCtrl.items.length > vmCtrl.numberOfVisible\" class=\"miq-load-more\">\n    <a href=\"#\" ng-click=\"vmCtrl.loadMoreItems()\">Show {{vmCtrl.perPage}} more</a>\n  </div>\n</div>\n"

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = "<div class=\"miq-tile-section\">\n  <div pf-card-view config=\"vmCtrl.options\" items=\"vmCtrl.slicedData\" class=\"miq-small-tile\">\n    <a href=\"#\">\n      <img height=\"72\" class=\"miq-gradient-background\" ng-src=\"/assets/{{item.icon.image}}\" width=\"72\">\n    </a>\n  </div>\n  <div ng-if=\"vmCtrl.items.length > vmCtrl.numberOfVisible\" class=\"miq-load-more\">\n    <a href=\"#\" ng-click=\"vmCtrl.loadMoreItems()\">Show {{vmCtrl.perPage}} more</a>\n  </div>\n</div>\n"

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var ActionButtons = (function () {
	    function ActionButtons() {
	        this.replace = true;
	        this.template = __webpack_require__(52);
	        this.scope = {
	            actions: '=',
	            isValid: '='
	        };
	    }
	    ActionButtons.Factory = function () {
	        var directive = function () { return new ActionButtons(); };
	        directive.$inject = [];
	        return directive;
	    };
	    return ActionButtons;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ActionButtons;


/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = "<div>\n  <button ng-repeat=\"oneAction in actions\"\n          name=\"button\"\n          type=\"submit\"\n          class=\"btn {{oneAction.btnClass}}\"\n          alt=\"action.title\"\n          title=\"action.title\"\n          ng-disabled=\"oneAction.validate && !isValid\"\n          ng-click=\"oneAction.clickFunction($event)\">\n    <span>\n      <i ng-if=\"oneAction.iconClass\" class=\"{{oneAction.iconClass}}\"></i>\n      {{oneAction.label}}\n    </span>\n  </button>\n</div>\n"

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var validateCredentialsController_1 = __webpack_require__(54);
	var ValidateCredentials = (function () {
	    function ValidateCredentials() {
	        this.replace = true;
	        this.template = __webpack_require__(55);
	        this.controller = validateCredentialsController_1.default;
	        this.controllerAs = 'vm';
	        this.bindings = {
	            modelName: '@',
	            modelHolder: '=',
	            validateAction: '&'
	        };
	    }
	    return ValidateCredentials;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ValidateCredentials;


/***/ },
/* 54 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var ValidateCredentialsController = (function () {
	    function ValidateCredentialsController() {
	    }
	    ValidateCredentialsController.prototype.onValidate = function () {
	        this.validateAction({ validateData: this.modelHolder });
	    };
	    ValidateCredentialsController.prototype.getValidateClass = function () {
	        return {
	            disabled: !this.isActive()
	        };
	    };
	    ValidateCredentialsController.prototype.isActive = function () {
	        if (this.modelHolder) {
	            return ValidateCredentialsController.notEmpty(this.modelHolder[this.modelName + '_userid']) &&
	                ValidateCredentialsController.notEmpty(this.modelHolder[this.modelName + '_password']) &&
	                ValidateCredentialsController.notEmpty(this.modelHolder[this.modelName + '_verify']);
	        }
	        else {
	            return false;
	        }
	    };
	    ValidateCredentialsController.notEmpty = function (item) {
	        return item !== undefined && item !== '';
	    };
	    return ValidateCredentialsController;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ValidateCredentialsController;


/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = "<div>\n  <div class=\"form-group\">\n    <label class=\"col-md-2 control-label\">Username</label>\n    <div class=\"col-md-4\">\n      <input type=\"text\" name=\"{{vm.modelName}}_userid\" maxlength=\"50\" class=\"form-control\" ng-model=\"vm.modelHolder[vm.modelName + '_userid']\">\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-2 control-label\">Password</label>\n    <div class=\"col-md-4\">\n      <input type=\"password\" name=\"{{vm.modelName}}_password\" maxlength=\"50\" class=\"form-control\" ng-model=\"vm.modelHolder[vm.modelName + '_password']\">\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-2 control-label\">Confirm Password</label>\n    <div class=\"col-md-4\">\n      <input type=\"password\" name=\"{{vm.modelName}}_verify\" maxlength=\"50\" class=\"form-control\" ng-model=\"vm.modelHolder[vm.modelName + '_verify']\">\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <div class=\"col-md-6\">\n      <button name=\"button\" type=\"submit\" class=\"btn btn-primary btn-xs pull-right\"\n              ng-class=\"vm.getValidateClass()\"\n              ng-click=\"vm.onValidate()\">\n        Validate\n      </button>\n    </div>\n  </div>\n</div>\n"

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var dataTableService_1 = __webpack_require__(57);
	var formValidatorService_1 = __webpack_require__(58);
	var notificationService_1 = __webpack_require__(59);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.provider('MiQDataTableService', dataTableService_1.default);
	    module.provider('MiQFormValidatorService', formValidatorService_1.default);
	    module.service('MiQNotificationService', notificationService_1.default);
	};


/***/ },
/* 57 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var DataTableService = (function () {
	    function DataTableService() {
	        this.endpoints = {
	            list: '/list'
	        };
	    }
	    DataTableService.prototype.retrieveRowsAndColumnsFromUrl = function () {
	        return this.$http({
	            method: 'GET',
	            url: location.origin + this.MiQDataAccessService.getUrlPrefix() + this.endpoints.list
	        }).then(function (responseData) {
	            DataTableService.mockData(responseData.data.rows);
	            DataTableService.filterSelectBox(responseData.data.head, responseData.data.rows);
	            DataTableService.bindHeadersToRows(responseData.data.head, responseData.data.rows);
	            DataTableService.exposeName(responseData.data.head, responseData.data.rows);
	            DataTableService.exposeIcon(responseData.data.rows);
	            return {
	                rows: responseData.data.rows,
	                cols: responseData.data.head
	            };
	        });
	    };
	    DataTableService.exposeName = function (headers, rows) {
	        _.each(rows, function (row) {
	            row.nameItem = DataTableService.findNameItem(row.cells, headers);
	        });
	    };
	    DataTableService.bindHeadersToRows = function (headers, rows) {
	        _.each(rows, function (row) {
	            row['headers'] = headers;
	        });
	    };
	    DataTableService.filterSelectBox = function (headers, rows) {
	        _.each(rows, function (row) {
	            row.cells = row.cells.filter(function (cell) { return !cell.hasOwnProperty('is_checkbox'); });
	        });
	        headers.splice(0, 1);
	    };
	    DataTableService.exposeIcon = function (rows) {
	        _.each(rows, function (oneRow) {
	            oneRow.icon = DataTableService.findIconItem(oneRow.cells);
	        });
	    };
	    DataTableService.findIconItem = function (cells) {
	        return _.find(cells, function (row) {
	            return row.hasOwnProperty('image') || row.hasOwnProperty('icon');
	        });
	    };
	    DataTableService.findNameItem = function (cells, headers) {
	        var nameIndex = _.findIndex(headers, { text: 'Name' });
	        if (nameIndex !== -1) {
	            return cells[nameIndex];
	        }
	    };
	    // TODO: Remove this method
	    DataTableService.mockData = function (rows) {
	        rows.push(_.cloneDeep(rows[0]));
	        rows.push(_.cloneDeep(rows[0]));
	        rows.push(_.cloneDeep(rows[0]));
	        rows.push(_.cloneDeep(rows[0]));
	        _.each(rows, function (row, key) {
	            row.id += key;
	            row.cells[2].text += row.id;
	        });
	    };
	    /*@ngInject*/
	    DataTableService.prototype.$get = function ($http, MiQDataAccessService) {
	        var _this = this;
	        this.$http = $http;
	        this.MiQDataAccessService = MiQDataAccessService;
	        return {
	            retrieveRowsAndColumnsFromUrl: function () { return _this.retrieveRowsAndColumnsFromUrl(); }
	        };
	    };
	    DataTableService.prototype.$get.$inject = ["$http", "MiQDataAccessService"];
	    return DataTableService;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = DataTableService;


/***/ },
/* 58 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var FormValidatorService = (function () {
	    function FormValidatorService() {
	        this.endpoints = {
	            validate: '/validate',
	            create: '/create'
	        };
	    }
	    FormValidatorService.prototype.validateObject = function (dataObject) {
	        return this.httpPost(this.MiQDataAccessService.getUrlPrefix() + this.endpoints.validate, dataObject);
	    };
	    FormValidatorService.prototype.saveObject = function (dataObject) {
	        return this.httpPost(this.MiQDataAccessService.getUrlPrefix() + this.endpoints.create, dataObject);
	    };
	    FormValidatorService.prototype.httpPost = function (url, dataObject) {
	        var _this = this;
	        return this.$http.post(url, dataObject).then(function (validationData) {
	            return {
	                isValid: validationData.data.result,
	                errorMsg: validationData.data.details,
	                formObject: validationData.data.ems_object,
	                serverAlerts: _this.mergeAlerts(validationData.data.database_errors)
	            };
	        });
	    };
	    FormValidatorService.prototype.mergeAlerts = function (alertsData) {
	        var allAlerts = {};
	        _.each(alertsData, function (item, key) {
	            allAlerts[key] = item.join();
	        });
	        return allAlerts;
	    };
	    /*@ngInject*/
	    FormValidatorService.prototype.$get = function ($http, MiQDataAccessService) {
	        var _this = this;
	        this.$http = $http;
	        this.MiQDataAccessService = MiQDataAccessService;
	        return {
	            validateObject: function (data) { return _this.validateObject(data); },
	            saveObject: function (data) { return _this.saveObject(data); }
	        };
	    };
	    FormValidatorService.prototype.$get.$inject = ["$http", "MiQDataAccessService"];
	    return FormValidatorService;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = FormValidatorService;


/***/ },
/* 59 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var NotificationService = (function () {
	    /* @ngInject */
	    function NotificationService(rx) {
	        this.rx = rx;
	        this.notificationSubject = new this.rx.Subject();
	    }
	    NotificationService.$inject = ["rx"];
	    Object.defineProperty(NotificationService, "bodyTag", {
	        get: function () { return '<body>'; },
	        enumerable: true,
	        configurable: true
	    });
	    ;
	    Object.defineProperty(NotificationService, "closeBodyTag", {
	        get: function () { return '</body>'; },
	        enumerable: true,
	        configurable: true
	    });
	    ;
	    NotificationService.prototype.sendNext = function (data) {
	        this.notificationSubject.onNext(data);
	        return data;
	    };
	    NotificationService.prototype.sendDanger = function (data) {
	        data.type = 'danger';
	        return this.sendNext(data);
	    };
	    NotificationService.prototype.sendWarning = function (data) {
	        data.type = 'warning';
	        return this.sendNext(data);
	    };
	    NotificationService.prototype.sendSuccess = function (data) {
	        data.type = 'success';
	        return this.sendNext(data);
	    };
	    NotificationService.prototype.sendInfo = function (data) {
	        data.type = 'info';
	        return this.sendNext(data);
	    };
	    NotificationService.prototype.sendLoading = function (data) {
	        data.type = 'loading';
	        return this.sendNext(data);
	    };
	    NotificationService.prototype.dismissibleMessage = function (body, header, loadingItem) {
	        return {
	            body: NotificationService.checkForBody(body),
	            dismissible: true,
	            header: header,
	            loadingItem: loadingItem
	        };
	    };
	    NotificationService.checkForBody = function (msg) {
	        if (msg && msg !== '') {
	            var bodyIndex = msg.indexOf(NotificationService.bodyTag);
	            if (bodyIndex !== -1) {
	                return msg.substring(bodyIndex + NotificationService.bodyTag.length, msg.indexOf(NotificationService.closeBodyTag));
	            }
	        }
	        return msg;
	    };
	    return NotificationService;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = NotificationService;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var dataAccessService_1 = __webpack_require__(61);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.provider('MiQDataAccessService', dataAccessService_1.default);
	};


/***/ },
/* 61 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var DataAccessService = (function () {
	    function DataAccessService() {
	    }
	    DataAccessService.prototype.setUrlPrefix = function (urlPrefix) {
	        this.urlPrefix = urlPrefix;
	    };
	    DataAccessService.prototype.$get = function () {
	        var _this = this;
	        return {
	            getUrlPrefix: function () { return _this.urlPrefix; }
	        };
	    };
	    return DataAccessService;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = DataAccessService;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var sortItemsController_1 = __webpack_require__(63);
	var SortItems = (function () {
	    function SortItems() {
	        this.replace = true;
	        this.template = __webpack_require__(64);
	        this.controller = sortItemsController_1.default;
	        this.controllerAs = 'vm';
	        this.bindings = {
	            headers: '=',
	            items: '='
	        };
	    }
	    return SortItems;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = SortItems;


/***/ },
/* 63 */
/***/ function(module, exports) {

	///
	/// Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
	/// and other contributors as indicated by the @author tags.
	///
	/// Licensed under the Apache License, Version 2.0 (the "License");
	/// you may not use this file except in compliance with the License.
	/// You may obtain a copy of the License at
	///
	///    http://www.apache.org/licenses/LICENSE-2.0
	///
	/// Unless required by applicable law or agreed to in writing, software
	/// distributed under the License is distributed on an "AS IS" BASIS,
	/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	/// See the License for the specific language governing permissions and
	/// limitations under the License.
	///
	"use strict";
	///<reference path="../tsd.d.ts"/>
	var SortItemsController = (function () {
	    /* @ngInject */
	    function SortItemsController($scope, rx) {
	        this.$scope = $scope;
	        this.rx = rx;
	        this.initOptions();
	        this.fillFields();
	    }
	    SortItemsController.$inject = ["$scope", "rx"];
	    SortItemsController.prototype.initOptions = function () {
	        var _this = this;
	        this.options = {
	            fields: [],
	            onSortChange: function (sortId, isAscending) { return _this.handleSort(sortId, isAscending); }
	        };
	    };
	    SortItemsController.prototype.fillFields = function () {
	        var _this = this;
	        _.each(this.headers, function (oneCol) {
	            if (!oneCol.hasOwnProperty('is_narrow') && oneCol.hasOwnProperty('text')) {
	                _this.options.fields.push({
	                    id: oneCol.text.toLowerCase(),
	                    title: oneCol.text,
	                    sortType: oneCol.sort === 'str' ? 'alpha' : 'numeric'
	                });
	            }
	        });
	    };
	    SortItemsController.prototype.handleSort = function (sortId, isAscending) {
	        var itemIndex = _.findIndex(this.headers, { text: sortId.title });
	        this.items.sort(function (item1, item2) {
	            var compValue = 0;
	            if (sortId.sortType === 'numeric') {
	                compValue = item1.cells[itemIndex] - item2[itemIndex];
	            }
	            else {
	                compValue = item1.cells[itemIndex].text.localeCompare(item2.cells[itemIndex].text);
	            }
	            return (isAscending) ? compValue : compValue * -1;
	        });
	    };
	    return SortItemsController;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = SortItemsController;


/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = "<div>\n  <div pf-sort config=\"vm.options\"></div>\n</div>\n"

/***/ }
/******/ ]);
//# sourceMappingURL=hawkular-ui-components.js.map