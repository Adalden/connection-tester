/* global angular */
angular.module('app').controller('modalHelpCtrl',
  function ($scope, $modalInstance) {
    'use strict';

    $scope.close = function () {
      $modalInstance.dismiss();
    };
  }
);
