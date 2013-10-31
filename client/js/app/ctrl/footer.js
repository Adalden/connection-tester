/* global app */
app.controller('footerCtrl',
  function ($scope, alerts) {
    'use strict';
    $scope.year = (new Date()).getFullYear();
    $scope.alerts = alerts.alerts;
    $scope.closeAlert = alerts.close;
  }
);
