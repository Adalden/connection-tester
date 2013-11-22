/* global angular */
angular.module('app').controller('modalIpCtrl',
  function ($scope, $http, $modalInstance) {
    'use strict';

    $scope.ip = 'LOADING...';
    $http.get('/ip').then(function (resp) {
      var d = resp.data;
      $scope.ip = d.ip || d.err;
    });

    $scope.close = function () {
      $modalInstance.dismiss();
    };
  }
);
