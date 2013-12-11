/* global angular */
angular.module('app').controller('modalReportCtrl',
  function ($scope, $modalInstance, alives, aConfig) {
    'use strict';

    $scope.alives = alives;
    $scope.config = aConfig;

    $scope.close = function () {
      $modalInstance.dismiss();
    };
  }
);
