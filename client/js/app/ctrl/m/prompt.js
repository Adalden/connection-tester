/* global angular */
angular.module('app').controller('modalPrompt',
  function ($scope, $modalInstance, msg) {
    'use strict';

    $scope.msg = msg;

    $scope.close = function () {
      $modalInstance.dismiss();
    };

    $scope.accept = function () {
      $modalInstance.close();
    };
  }
);
