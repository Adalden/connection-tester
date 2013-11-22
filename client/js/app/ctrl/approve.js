/* global angular, console, _*/

angular.module('app').controller('approveCtrl',
  function ($scope, configs, alerts){
    'use strict';

    $scope.configuration = [];
    $scope.nodes = [];
    $scope.conns = [];
    $scope.btnDisabled = true;

    configs.getAll(function(err, res) {
      if (err) return alerts.create('error', 'Failed to get saved configurations');
      $scope.configs = _unapproved(res);

    });

    $scope.select = function(name, item) {
      $scope.showTitle = name;
      $scope.showItem = item;
    };

    $scope.approveConfig = function(selected) {
      selected.approved = true;
      configs.save(selected, function (err) {
        if (err) return alerts.create('error', 'Failed to save updates to configuration');
        $scope.configs.splice($scope.configs.indexOf(selected, 0), 1);
        $scope.btnDisabled = true;
        $scope.nodes = [];
        $scope.conns = [];
        alerts.create('success', 'Configuration approved');
      });
    };

    $scope.loadConfig = function(selected) {
      console.log(selected);
      $scope.nodes = selected.nodes;
      $scope.conns = selected.conns;
      $scope.btnDisabled = false;
    };

    function _unapproved(configs) {
      var list = _.filter(configs, function(config) {
        return !config.approved;
      });

      return list;
    }
});
