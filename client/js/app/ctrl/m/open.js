/* global angular */
angular.module('app').controller('modalOpen',
  function ($scope, $modalInstance, configs) {
    'use strict';

    configs.list(function (err, list) {
      if (err) $modalInstance.dismiss(err);

      $scope.allConfigs = list;
      $scope.choice = list[0];
    });

    $scope.close = function () {
      $modalInstance.dismiss();
    };

    $scope.accept = function (choice) {
      $modalInstance.close(choice);
    };
  }
);
