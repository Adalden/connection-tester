/* global angular, console, _*/

angular.module('app').controller('approveCtrl',
  function ($scope, configs, alerts){
    'use strict';

    $scope.configuration = [];
    $scope.nodes = [];
    $scope.conns = [];

    configs.getAll(function(err, res) {
      if (err) return alerts.create('error', 'Failed to get saved configurations');
      $scope.configs = _unapproved(res);

    });

    $scope.select = function(name, item) {
      console.log(name, item);
    };

    $scope.approveConfig = function(selected) {
      console.log(selected);

    };

    $scope.loadConfig = function(selected) {
      $scope.nodes = selected.nodes;
      $scope.conns = selected.conns;
    };

    function _unapproved(configs) {
      var list = _.filter(configs, function(config) {
        return !config.approved;
      });

      return list;
    }
});
