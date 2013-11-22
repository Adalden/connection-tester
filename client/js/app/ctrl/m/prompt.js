/* global angular */
angular.module('app').controller('modalPromptCtrl',
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
