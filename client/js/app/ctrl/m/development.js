/* global angular */
angular.module('app').controller('modalDevelopmentCtrl',
  function ($scope, $http, $modalInstance, alerts) {
    'use strict';

    $scope.saveAll = function () {
      $http.get('/dev/saveAll').then(function () {
        alerts.create('success', 'Saved Your Configs to External Server.');
      }, function (err) {
        alerts.create('error', err);
      });
    };

    $scope.loadAll = function () {
      $http.get('/dev/loadAll').then(function () {
        alerts.create('success', 'Loaded Configs from the External Server.');
        alerts.create('info', 'Your browser is in dire need of a refresh!!');
      }, function (err) {
        alerts.create('error', err);
      });
    };

    $scope.close = function () {
      $modalInstance.dismiss();
    };
  }
);
