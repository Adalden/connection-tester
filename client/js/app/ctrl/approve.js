/* global angular, _ */

angular.module('app').controller('approveCtrl',
  function ($scope, configs, alerts){
    'use strict';

    $scope.nodes = [];
    $scope.conns = [];

    configs.list(function (err, allConfigs) {
      if (err) return alerts.create('error', 'Failed to get saved configurations');

      $scope.configs = [];
      _.each(allConfigs, function (configName) {
        configs.get(configName, function (err, config) {
          if (!config.approved) {
            $scope.configs.push(configName);
          }
        });
      });
    });

    $scope.select = function (name, item) {
      $scope.showTitle = name;
      $scope.showItem = item;
    };

    $scope.approveConfig = function (name, index) {
      configs.approve(name, function (err) {
        if (err) return alerts.create('error', 'Failed to save updates to configuration');
        $scope.configs.splice(index, 1);
        $scope.canApprove = false;
        $scope.nodes = [];
        $scope.conns = [];
        alerts.create('success', 'Configuration approved');
      });
    };

    $scope.loadConfig = function (selected, index) {
      configs.get(selected, function (err, config) {
        $scope.nodes = config.nodes;
        $scope.conns = config.conns;

        $scope.selName = selected;
        $scope.selIndex = index;
      });
    };
});
