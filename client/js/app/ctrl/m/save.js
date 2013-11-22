/* global angular */
angular.module('app').controller('modalSave',
  function ($scope, $modalInstance) {
    'use strict';

    $scope.close = function () {
      $modalInstance.dismiss();
    };

    $scope.accept = function (name) {
      $modalInstance.close(name);
    };
  }
);
