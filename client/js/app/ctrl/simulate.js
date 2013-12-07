/* global angular, $ */

angular.module('app').controller('simulateCtrl',
  function ($scope, $timeout, configs, alerts, socket){
    'use strict';
    $scope.nodes      = [];
    $scope.conns      = [];
    $scope.configList = [];
    $scope.running    = false;

    configs.list(function(err, res) {
      if (err) return alerts.create('error', 'Failed to get configurations!');
      $scope.configList = res;
    });

    $scope.getConfig = function(selected) {
      configs.get(selected, function (err, res) {
        if (err) return alerts.create('error', 'Failed to load selected configuration!');
        $scope.curConfig = JSON.parse(JSON.stringify(res));

        $scope.nodes = res.nodes;
        $scope.conns = res.conns;

        $timeout(function() {
          $scope.nodes.forEach(function(node) {
            $('#node-'+node.id).css({
              'stroke': 'red',
              'fill':   'red'
            });
          });
        }, 50);
      });
    };

    $scope.start = function() {
      if (!$scope.nodes.length && !$scope.conns.length) return;
      $scope.running = !$scope.running;
      socket.emit('start', $scope.curConfig, function (data) {
        if (!data.success) {
          if (data.config) {
            $scope.configName = data.config.name;
            $scope.getConfig(data.config.name);
          }
        }
      });
    };

    $scope.stop = function() {
      $scope.running = !$scope.running;
      socket.emit('stop');
    };

    socket.on('progress', function(nodes) {
      if (!$scope.running) return;
      nodes.forEach(function(node) {
        $('#node-' + node).css({
          'stroke':  'green',
          'fill':    'green'
        });
      });
    });

    socket.on('started', function (config) {
      $scope.running = true;
      $scope.getConfig(config.name);
    });

    socket.on('stopped', function() {
      $scope.running = false;
    });

});
