/// <reference path="inventoryPlugin.ts"/>
module Inventory {

  export var InventoryController = _module.controller("Inventory.InventoryController", ['$scope', ($scope) => {
      $scope.inventory = [
          {resourceId: "cpu0.rh1001", resourceName:"CPU0 on RH1001"  },
          {resourceId: "cpu2.rh1001", resourceName:"CPU2 on RH1001"  },
          {resourceId: "cpu1.rh1001", resourceName:"CP10 on RH1001"  }

      ];
  }]);

}
