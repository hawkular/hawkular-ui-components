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

<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
	__webpack_require__(21);
	module.exports = __webpack_require__(23);
=======
	__webpack_require__(3);
	module.exports = __webpack_require__(46);
>>>>>>> Add Rx, new component for alerts, add them to demo


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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

=======
/* 10 */
/***/ function(module, exports) {

	module.exports = "<div>\n  <button ng-repeat=\"oneAction in actions\"\n          name=\"button\"\n          type=\"submit\"\n          class=\"btn {{oneAction.btnClass}}\"\n          alt=\"action.title\"\n          title=\"action.title\"\n          ng-disabled=\"oneAction.validate && !isValid\"\n          ng-click=\"oneAction.clickFunction($event)\">\n    <span>\n      <i ng-if=\"oneAction.iconClass\" class=\"{{oneAction.iconClass}}\"></i>\n      {{oneAction.label}}\n    </span>\n  </button>\n</div>\n"

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "<div class=\"dataTables_paginate paging_bootstrap_input\" id=\"DataTables_Table_0_paginate\">\n  <ul class=\"pagination\">\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"first\" ng-click=\"goToFirst()\"><span\n      class=\"i fa fa-angle-double-left\"></span></li>\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"prev\" ng-click=\"setPage(currentPage - 1)\"><span\n      class=\"i fa fa-angle-left\"></span></li>\n  </ul>\n  <div class=\"pagination-input\">\n    <form ng-submit=\"setPage(currentPageView - 1)\">\n      <input type=\"text\" class=\"paginate_input\" ng-model=\"currentPageView\">\n      <span class=\"paginate_of\">of <b>{{goTos.length}}</b></span>\n    </form>\n  </div>\n  <ul class=\"pagination\">\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"next\" ng-click=\"setPage(currentPage + 1)\"><span\n      class=\"i fa fa-angle-right\"></span></li>\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"last\" ng-click=\"goToLast()\"><span\n      class=\"i fa fa-angle-double-right\"></span></li>\n  </ul>\n</div>\n"
>>>>>>> Add Rx, new component for alerts, add them to demo

/***/ },
/* 20 */,
/* 21 */
/***/ function(module, exports) {

<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
	// removed by extract-text-webpack-plugin
=======
	module.exports = "<div>\n  <table class=\"table table-bordered table-striped table-hover mig-table-with-footer mig-table\">\n    <thead>\n    <tr>\n      <th class=\"narrow miq-select\" ng-if=\"vm.selectable\">\n        <input ng-if=\"vm.data.length !== 0\" type=\"checkbox\" ng-model=\"isChecked\" ng-click=\"vm.onCheckAll(isChecked)\" title=\"Select all\">\n      </th>\n      <th ng-repeat=\"column in vm.columns\" ng-click=\"vm.onSortClick(column)\"\n          ng-class=\"vm.getColumnClass(column)\">\n        <div ng-if=\"column.sort\">\n          {{column.text}}\n          <div class=\"pull-right\">\n            <i ng-if=\"vm.isFilteredBy(column.col_idx) && !vm.sortReverse\" class=\"fa fa-sort-desc\"></i>\n            <i ng-if=\"vm.isFilteredBy(column.col_idx) && vm.sortReverse\" class=\"fa fa-sort-asc\"></i>\n          </div>\n        </div>\n      </th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr ng-repeat=\"row in vm.data | orderBy : vm.sortType : vm.sortReverse\"\n        ng-class=\"{active : row.selected}\"\n        ng-click=\"vm.onRowClick({$event: $event, rowData: row})\">\n      <td class=\"narrow\" ng-if=\"vm.selectable\" onclick=\"event.stopPropagation();\">\n        <input ng-click=\"vm.onRowSelected($event)\"\n               onclick=\"event.stopPropagation();\"\n               type=\"checkbox\"\n               ng-model=\"row.selected\"\n               name=\"check_{{row.id}}\"\n               value=\"{{row.id}}\"\n               ng-checked=\"row.selected\"\n               class=\"list-grid-checkbox\">\n      </td>\n      <td ng-repeat=\"(columnKey, column) in vm.columns\"\n          ng-class=\"vm.getColumnClass(column)\">\n        <img ng-if=\"vm.isIconOrImage(row, columnKey)\"\n             alt=\"row.cells[columnKey].title\"\n             title=\"row.cells[columnKey].title\"\n             ng-src=\"{{vm.buildImageUrl(row, columnKey)}}\">\n            <span ng-if=\"row.cells[columnKey].text\">\n                {{row.cells[columnKey].text}}\n            </span>\n      </td>\n    </tr>\n    <tr ng-if=\"vm.data.length === 0\">\n      <td colspan=\"{{vm.columns.length + (vm.selectable? 1 : 0)}}\">\n        <p>It looks like this table has no data.</p>\n        <p ng-if=\"vm.defaultAction\">\n          Why don't you try\n            <a ng-click=\"vm.defaultAction.actionFunction()\">{{vm.defaultAction.title}}</a>\n          so this table would not be empty.\n        </p>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <div ng-if=\"!vm.noFooter\" class=\"dataTables_footer\">\n        <span class=\"pull-right\">\n            <miq-data-table-pagination resource-list=\"vm.data\"\n                                       current-page=\"vm.resCurPage\"\n                                       page-setter=\"vm.setPage\"\n                                       per-page=\"vm.resPerPage\">\n            </miq-data-table-pagination>\n        </span>\n  </div>\n</div>\n"
>>>>>>> Add Rx, new component for alerts, add them to demo

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
	var loader_2 = __webpack_require__(44);
	var loader_3 = __webpack_require__(47);
	var app = angular.module('miQStaticAssets', ['ui.bootstrap', 'ui.bootstrap.tabs']);
	loader_1.default(app);
	loader_2.default(app);
	loader_3.default(app);

<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
=======
	module.exports = "<div class=\"miq-alert-section\">\n  <div class=\"miq-info-alert\" ng-if=\"vm.showInfo && (vm.limit ? vm.limit : 1) < vm.activeNotifications.length\">\n    And {{vm.activeNotifications.length - (vm.limit ? vm.limit : 1)}} more\n  </div>\n  <miq-notifications ng-repeat=\"(key, alert) in vm.activeNotifications | limitTo: (vm.limit ? vm.limit : 1)\"\n                     type=\"alert.type\"\n                     header=\"alert.header\"\n                     body=\"alert.body\"\n                     dismissible=\"alert.dismissible\"\n                     on-dismiss=\"vm.onDismiss(key)\">\n  </miq-notifications>\n</div>\n"
>>>>>>> Add Rx, new component for alerts, add them to demo

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
	var actionButtonsDirective_1 = __webpack_require__(39);
	var validateCredentialsComponent_1 = __webpack_require__(41);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    loader_1.default(module);
	    loader_2.default(module);
	    module.directive('miqActionButtons', actionButtonsDirective_1.default.Factory());
	    module.component('miqValidateCredentials', new validateCredentialsComponent_1.default);
	};

<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
=======
	module.exports = "<div class=\"alert\" ng-class=\"vm.getClassFromType()\">\n  <button type=\"button\" class=\"close\" ng-click=\"vm.onDismiss()\" aria-hidden=\"true\" ng-if=\"vm.dismissible\">\n    <span class=\"pficon pficon-close\"></span>\n  </button>\n  <span ng-class=\"vm.getIconByType()\" class=\"pficon\"></span>\n  <strong ng-if=\"vm.header\">{{vm.header}}</strong> <span>{{(vm.body?vm.body:'&nbsp;')}}</span>\n</div>\n"
>>>>>>> Add Rx, new component for alerts, add them to demo

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

<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
=======
	module.exports = "<div>\n  Button\n</div>\n"
>>>>>>> Add Rx, new component for alerts, add them to demo

/***/ },
/* 27 */
/***/ function(module, exports) {

<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
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

=======
	module.exports = "<div class=\"btn-group\" dropdown>\n  <button type=\"button\" dropdown-toggle class=\"btn dropdown-toggle btn-default\"\n          ng-class=\"{disabled: toolbarList.disabled}\" title=\"{{toolbarList.title}}\">\n    <i class=\"{{toolbarList.icon}}\" style=\"margin-right: 5px;\" ng-if=\"toolbarList.icon\"></i>\n    {{toolbarList.title}}\n    <span class=\"caret\"></span>\n  </button>\n  <ul class=\"dropdown-menu\" role=\"menu\">\n    <li ng-repeat=\"item in toolbarList.children\" ng-class=\"{disabled: item.disabled}\">\n      <a href=\"#\" ng-click=\"onItemClick({item: item})\">\n        <i ng-if=\"item.icon\" class=\"{{item.icon}}\"></i>\n        {{item.title}}\n      </a>\n    </li>\n  </ul>\n</div>\n"
>>>>>>> Add Rx, new component for alerts, add them to demo

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = "<div class=\"toolbar-pf-actions\">\n  <div id=\"center_tb\">\n    <div class=\"form-group\">\n      <miq-toolbar-list ng-repeat=\"item in vm.toolbarItems | filter: children\"\n                        toolbar-list=\"item\"\n                        on-item-click=\"vm.onItemClick(item)\">\n      </miq-toolbar-list>\n    </div>\n  </div>\n  <div id=\"view_tb\"></div>\n</div>\n"
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703

/***/ },
/* 29 */
=======

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = "<div>\n  <div class=\"form-group\">\n    <label class=\"col-md-2 control-label\">Username</label>\n    <div class=\"col-md-4\">\n      <input type=\"text\" name=\"{{vm.modelName}}_userid\" maxlength=\"50\" class=\"form-control\" ng-model=\"vm.modelHolder[vm.modelName + '_userid']\">\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-2 control-label\">Password</label>\n    <div class=\"col-md-4\">\n      <input type=\"password\" name=\"{{vm.modelName}}_password\" maxlength=\"50\" class=\"form-control\" ng-model=\"vm.modelHolder[vm.modelName + '_password']\">\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-2 control-label\">Confirm Password</label>\n    <div class=\"col-md-4\">\n      <input type=\"password\" name=\"{{vm.modelName}}_verify\" maxlength=\"50\" class=\"form-control\" ng-model=\"vm.modelHolder[vm.modelName + '_verify']\">\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <div class=\"col-md-6\">\n      <button name=\"button\" type=\"submit\" class=\"btn btn-primary btn-xs pull-right\"\n              ng-class=\"vm.getValidateClass()\"\n              ng-click=\"vm.onValidate()\">\n        Validate\n      </button>\n    </div>\n  </div>\n</div>\n"

/***/ },
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
	        this.template = __webpack_require__(30);
=======
	        this.template = __webpack_require__(10);
>>>>>>> Add Rx, new component for alerts, add them to demo
	        this.scope = {
<<<<<<< 7e9f5935c08d60402e46d08e08a65b5bf3895475
	            toolbarButton: '='
=======
	            actions: '=',
	            isValid: '='
>>>>>>> Fix notification services to work more with Rxjs
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 30 */
/***/ function(module, exports) {

	module.exports = "<div>\n  Button\n</div>\n"

/***/ },
/* 31 */
=======
/* 29 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
	var ToolbarList = (function () {
	    function ToolbarList() {
	        this.replace = true;
	        this.template = __webpack_require__(32);
	        this.scope = {
	            toolbarList: '=',
	            onItemClick: '&'
=======
	var dataTablecontroller_1 = __webpack_require__(31);
	var DataTable = (function () {
	    function DataTable() {
	        this.replace = true;
	        this.template = __webpack_require__(12);
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
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 34 */
=======
/* 30 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
	var dataTablecontroller_1 = __webpack_require__(35);
	var DataTable = (function () {
	    function DataTable() {
=======
	var DataTablePagination = (function () {
	    function DataTablePagination() {
	        this.template = __webpack_require__(11);
	        this.scope = {
	            resourceList: '=',
	            currentPage: '=',
	            linkHeader: '=',
	            pageSetter: '&',
	            perPage: '='
	        };
>>>>>>> Add Rx, new component for alerts, add them to demo
	        this.replace = true;
	        this.template = __webpack_require__(36);
	        this.controller = dataTablecontroller_1.default;
	        this.controllerAs = 'vm';
	        this.bindings = {
	            onRowClick: '&',
	            onItemSelected: '&',
	            data: '=',
	            columns: '=',
	            noFooter: '@',
	            defaultAction: '='
	        };
	    }
	    return DataTable;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = DataTable;


/***/ },
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 35 */
=======
/* 31 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 36 */
/***/ function(module, exports) {
=======
/* 32 */
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
	var dataTableComponent_1 = __webpack_require__(29);
	var dataTablePaginationDirective_1 = __webpack_require__(30);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.component('miqDataTable', new dataTableComponent_1.default);
	    module.directive('miqDataTablePagination', dataTablePaginationDirective_1.default.Factory());
	};


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
	///<reference path="../tsd.d.ts"/>
	var loader_1 = __webpack_require__(39);
	var loader_2 = __webpack_require__(32);
	var loader_3 = __webpack_require__(34);
	var actionButtonsDirective_1 = __webpack_require__(28);
	var validateCredentialsComponent_1 = __webpack_require__(44);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    loader_1.default(module);
	    loader_2.default(module);
	    loader_3.default(module);
	    module.directive('miqActionButtons', actionButtonsDirective_1.default.Factory());
	    module.component('miqValidateCredentials', new validateCredentialsComponent_1.default);
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
	var notificationsDirective_1 = __webpack_require__(38);
	var notificationSectionComponent_1 = __webpack_require__(57);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.directive('miqNotifications', notificationsDirective_1.default.Factory());
	    module.component('miqNotificationSection', new notificationSectionComponent_1.default);
	};


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
	var NotificationSectionController = (function () {
	    /* @ngInject */
	    function NotificationSectionController(MiQNotificationService, $timeout, $scope, rx) {
	        var _this = this;
	        this.MiQNotificationService = MiQNotificationService;
	        this.$timeout = $timeout;
	        this.$scope = $scope;
	        this.rx = rx;
	        this.activeNotifications = [];
	        console.log(this.rx);
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
	        console.log(data, this.activeNotifications);
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
/* 36 */,
/* 37 */
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
/* 38 */
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
	var notificationsController_1 = __webpack_require__(37);
	var Notifications = (function () {
	    function Notifications() {
	        this.replace = true;
	        this.template = __webpack_require__(14);
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
	var toolbarComponent_1 = __webpack_require__(41);
	var toolbarButtonDirective_1 = __webpack_require__(40);
	var toolbarListDirective_1 = __webpack_require__(43);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.component('miqToolbarMenu', new toolbarComponent_1.default);
	    module.directive('miqToolbarButton', toolbarButtonDirective_1.default.Factory());
	    module.directive('miqToolbarList', toolbarListDirective_1.default.Factory());
	};
>>>>>>> Add Rx, new component for alerts, add them to demo

	module.exports = "<div>\n  <table class=\"table table-bordered table-striped table-hover mig-table-with-footer\">\n    <thead>\n    <tr>\n      <th ng-repeat=\"column in vm.columns\"\n          ng-class=\"vm.getColumnClass(column)\">\n        <a href=\"#\" ng-click=\"vm.onSortClick(column)\" ng-if=\"column.sort\">\n          {{column.text}}\n          <div class=\"pull-right\">\n            <i ng-if=\"vm.isFilteredBy(column.col_idx) && !vm.sortReverse\" class=\"fa fa-sort-desc\"></i>\n            <i ng-if=\"vm.isFilteredBy(column.col_idx) && vm.sortReverse\" class=\"fa fa-sort-asc\"></i>\n          </div>\n        </a>\n      </th>\n    </tr>\n    </thead>\n    <tbody>\n    <tr ng-repeat=\"row in vm.data | orderBy : vm.sortType : vm.sortReverse\"\n        ng-class=\"{active : row.selected}\"\n        ng-click=\"vm.onRowClick({$event: $event, rowData: row})\">\n      <td ng-repeat=\"(columnKey, column) in vm.columns\"\n          ng-class=\"vm.getColumnClass(column)\">\n        <input ng-if=\"vm.isCheckbox(row, columnKey)\"\n               ng-click=\"vm.onRowSelected($event)\"\n               onclick=\"event.stopPropagation();\"\n               type=\"checkbox\"\n               ng-model=\"row.selected\"\n               name=\"check_{{row.id}}\"\n               value=\"{{row.id}}\"\n               ng-checked=\"row.selected\"\n               class=\"list-grid-checkbox\">\n        <img ng-if=\"vm.isIconOrImage(row, columnKey)\"\n             alt=\"row.cells[columnKey].title\"\n             title=\"row.cells[columnKey].title\"\n             ng-src=\"{{vm.buildImageUrl(row, columnKey)}}\">\n            <span ng-if=\"row.cells[columnKey].text\">\n                {{row.cells[columnKey].text}}\n            </span>\n      </td>\n    </tr>\n    <tr ng-if=\"vm.data.length === 0\">\n      <td colspan=\"{{vm.columns.length}}\">\n        <p>It looks like this table has no data.</p>\n        <p ng-if=\"vm.defaultAction\">So why don't you try <a ng-click=\"vm.defaultAction.actionFunction()\">{{vm.defaultAction.title}}</a> so this table would not be empty.</p>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <div ng-if=\"!vm.noFooter\" class=\"dataTables_footer\">\n        <span class=\"miq-info here\">\n            <input type=\"checkbox\" ng-model=\"isChecked\" ng-click=\"vm.onCheckAll(isChecked)\"> Check All\n        </span>\n        <span class=\"pull-right\">\n            <miq-data-table-pagination resource-list=\"vm.data\"\n                                       current-page=\"vm.resCurPage\"\n                                       page-setter=\"vm.setPage\"\n                                       per-page=\"vm.resPerPage\">\n            </miq-data-table-pagination>\n        </span>\n  </div>\n</div>\n"

/***/ },
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 37 */
=======
/* 40 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
	var DataTablePagination = (function () {
	    function DataTablePagination() {
	        this.template = __webpack_require__(38);
=======
	var ToolbarButton = (function () {
	    function ToolbarButton() {
	        this.replace = true;
	        this.template = __webpack_require__(15);
>>>>>>> Add Rx, new component for alerts, add them to demo
	        this.scope = {
	            resourceList: '=',
	            currentPage: '=',
	            linkHeader: '=',
	            pageSetter: '&',
	            perPage: '='
	        };
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
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
=======
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
/* 41 */
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
	var toolbarController_1 = __webpack_require__(42);
	var Toolbar = (function () {
	    function Toolbar() {
	        this.replace = true;
	        this.template = __webpack_require__(17);
	        this.controller = toolbarController_1.default;
	        this.controllerAs = 'vm';
	        this.bindings = {
	            toolbarItems: '='
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 38 */
=======
/* 42 */
>>>>>>> Add Rx, new component for alerts, add them to demo
/***/ function(module, exports) {

	module.exports = "<div class=\"dataTables_paginate paging_bootstrap_input\" id=\"DataTables_Table_0_paginate\">\n  <ul class=\"pagination\">\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"first\" ng-click=\"goToFirst()\"><span\n      class=\"i fa fa-angle-double-left\"></span></li>\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"prev\" ng-click=\"setPage(currentPage - 1)\"><span\n      class=\"i fa fa-angle-left\"></span></li>\n  </ul>\n  <div class=\"pagination-input\">\n    <form ng-submit=\"setPage(currentPageView - 1)\">\n      <input type=\"text\" class=\"paginate_input\" ng-model=\"currentPageView\">\n      <span class=\"paginate_of\">of <b>{{goTos.length}}</b></span>\n    </form>\n  </div>\n  <ul class=\"pagination\">\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"next\" ng-click=\"setPage(currentPage + 1)\"><span\n      class=\"i fa fa-angle-right\"></span></li>\n    <li ng-class=\"{disabled: pagesNumber === 1}\" class=\"last\" ng-click=\"goToLast()\"><span\n      class=\"i fa fa-angle-double-right\"></span></li>\n  </ul>\n</div>\n"

/***/ },
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 39 */
=======
/* 43 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
	        this.template = __webpack_require__(40);
=======
	        this.template = __webpack_require__(16);
>>>>>>> Add Rx, new component for alerts, add them to demo
	        this.scope = {
	            actions: '='
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 40 */
/***/ function(module, exports) {

	module.exports = "<div>\n  <button ng-repeat=\"oneAction in actions\"\n          name=\"button\"\n          type=\"submit\"\n          class=\"btn {{oneAction.btnClass}}\"\n          alt=\"action.title\"\n          title=\"action.title\"\n          ng-click=\"oneAction.clickFunction()\">\n    <span>\n      <i ng-if=\"oneAction.iconClass\" class=\"{{oneAction.iconClass}}\"></i>\n      {{oneAction.label}}\n    </span>\n  </button>\n</div>\n"

/***/ },
/* 41 */
=======
/* 44 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
	var validateCredentialsController_1 = __webpack_require__(42);
	var ValidateCredentials = (function () {
	    function ValidateCredentials() {
	        this.replace = true;
	        this.template = __webpack_require__(43);
=======
	var validateCredentialsController_1 = __webpack_require__(45);
	var ValidateCredentials = (function () {
	    function ValidateCredentials() {
	        this.replace = true;
	        this.template = __webpack_require__(18);
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 42 */
=======
/* 45 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
	        console.log(this);
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 43 */
=======
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
	///<reference path="tsd.d.ts"/>
	var loader_1 = __webpack_require__(33);
	var loader_2 = __webpack_require__(51);
	var loader_3 = __webpack_require__(48);
	var app = angular.module('miQStaticAssets', ['ui.bootstrap', 'ui.bootstrap.tabs', 'rx']);
	loader_1.default(app);
	loader_2.default(app);
	loader_3.default(app);


/***/ },
/* 47 */
>>>>>>> Add Rx, new component for alerts, add them to demo
/***/ function(module, exports) {

	module.exports = "<div>\n  <div class=\"form-group\">\n    <label class=\"col-md-2 control-label\">Username</label>\n    <div class=\"col-md-4\">\n      <input type=\"text\" name=\"{{vm.modelName}}_userid\" maxlength=\"50\" class=\"form-control\" ng-model=\"vm.modelHolder[vm.modelName + '_userid']\">\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-2 control-label\">Password</label>\n    <div class=\"col-md-4\">\n      <input type=\"password\" name=\"{{vm.modelName}}_password\" maxlength=\"50\" class=\"form-control\" ng-model=\"vm.modelHolder[vm.modelName + '_password']\">\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label class=\"col-md-2 control-label\">Confirm Password</label>\n    <div class=\"col-md-4\">\n      <input type=\"password\" name=\"{{vm.modelName}}_verify\" maxlength=\"50\" class=\"form-control\" ng-model=\"vm.modelHolder[vm.modelName + '_verify']\">\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <div class=\"col-md-6\">\n      <button name=\"button\" type=\"submit\" class=\"btn btn-primary btn-xs pull-right\"\n              ng-class=\"vm.getValidateClass()\"\n              ng-click=\"vm.onValidate()\">\n        Validate\n      </button>\n    </div>\n  </div>\n</div>\n"

/***/ },
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 44 */
=======
/* 48 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
	var dataTableService_1 = __webpack_require__(45);
	var formValidatorService_1 = __webpack_require__(46);
=======
	var dataAccessService_1 = __webpack_require__(47);
>>>>>>> Add Rx, new component for alerts, add them to demo
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.provider('MiQDataTableService', dataTableService_1.default);
	    module.provider('MiQFormValidatorService', formValidatorService_1.default);
	};


/***/ },
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 45 */
=======
/* 49 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
	            return {
	                rows: responseData.data.rows,
	                cols: responseData.data.head
	            };
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 46 */
=======
/* 50 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
	            console.log(validationData);
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 47 */
=======
/* 51 */
>>>>>>> Add Rx, new component for alerts, add them to demo
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
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
	var dataAccessService_1 = __webpack_require__(48);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.provider('MiQDataAccessService', dataAccessService_1.default);
=======
	var dataTableService_1 = __webpack_require__(49);
	var formValidatorService_1 = __webpack_require__(50);
	var notificationService_1 = __webpack_require__(52);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (module) {
	    module.provider('MiQDataTableService', dataTableService_1.default);
	    module.provider('MiQFormValidatorService', formValidatorService_1.default);
	    module.service('MiQNotificationService', notificationService_1.default);
>>>>>>> Add Rx, new component for alerts, add them to demo
	};


/***/ },
<<<<<<< b9e5a028c6c0b592911fc1e780641125afa55703
/* 48 */
=======
/* 52 */
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
<<<<<<< 7e9f5935c08d60402e46d08e08a65b5bf3895475
/* 53 */
>>>>>>> Add Rx, new component for alerts, add them to demo
/***/ function(module, exports) {
=======
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */
/***/ function(module, exports, __webpack_require__) {
>>>>>>> Fix notification services to work more with Rxjs

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
<<<<<<< 7e9f5935c08d60402e46d08e08a65b5bf3895475
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
=======
	///<reference path="../../tsd.d.ts"/>
	var notificationSectionController_1 = __webpack_require__(35);
	var NotificationSection = (function () {
	    function NotificationSection() {
	        this.replace = true;
	        this.template = __webpack_require__(13);
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
>>>>>>> Fix notification services to work more with Rxjs


/***/ }
/******/ ]);
//# sourceMappingURL=hawkular-ui-components.js.map