/* global angular */
angular.module('app').controller('modalUser',
  function ($scope, $modalInstance) {
    'use strict';

    $scope.close = function () {
      $modalInstance.dismiss();
    };

    $scope.accept = function (newUser) {
      $modalInstance.close(newUser);
    };
  }
);
