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

/// <reference path="../../includes.ts"/>

module HawkularMetrics {

  /// some config vars
  export var pluginName = "hawkular-metrics";

  export var log:Logging.Logger = Logger.get(pluginName);

  export var templatePath = "plugins/metrics/html";


  /// These are plugin globals used across several screens (think session vars from server side programming)

  /// @todo: this will go away once we have KeyCloak integration
  export var globalTenantId = "test";

  export var globalMetricId = "";
  export var globalResourceUrl = "";

  export var globalResourceList = [];

  export var globalChartTimeRange:ChartTimeRange;

  export class ChartTimeRange {
    startTimestamp:number;
    endTimestamp:number;

    constructor(private initialHoursDifference:number) {
      /// just set a default if no ctors given
      this.init();
    }

    init() {
      this.endTimestamp = moment().valueOf();
      this.startTimestamp = moment().subtract('hour', this.initialHoursDifference).valueOf();
    }

    getStartDate():Date {
      return new Date(this.startTimestamp);
    }

    getEndDate():Date {
      return new Date(this.endTimestamp);
    }

    getFormattedTimeRange():string {
      ///@todo: if less < 24 hr show times otherwise dates
      ///return moment(this.startTimestamp).format('MMM do') + ' - ' + moment(this.endTimestamp).format('MMM do')
      /// if within 7 days
      //return moment(this.startTimestamp).format('ddd, hA') + ' - ' + moment(this.endTimestamp).format('ddd, hA');
      // if within 24 hours
      return moment(this.startTimestamp).format('H:mm') + ' - ' + moment(this.endTimestamp).format('H:mm')
        + ' (' + moment(this.endTimestamp).from(moment(this.startTimestamp), true) + ')';
    }
  }

}
