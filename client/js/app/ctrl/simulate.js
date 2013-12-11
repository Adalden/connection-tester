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

    socket.emit('status', '', function (status) {
      if (status.running) {
        $scope.running = true;
        setNewConfig(status.config.name);
      }
    });

    $scope.getConfig = function (selected) {
      configs.get(selected, function (err, res) {
        if (err) return alerts.create('error', 'Failed to load selected configuration!');
        $scope.stop();
        $scope.curConfig = JSON.parse(JSON.stringify(res));

        $scope.nodes = res.nodes;
        $scope.conns = res.conns;

        $timeout(function () {
          $scope.nodes.forEach(function (node) {
            $('#node-' + node.id).css({
              'stroke': 'red',
              'fill':   'red'
            });
          });
        }, 50);
      });
    };

    $scope.start = function() {
      if (!$scope.nodes.length || !$scope.conns.length) return;
      $scope.running = true;
      socket.emit('start', $scope.curConfig, function (data) {
        if (!data.success) {
          alerts.create('error', data.err);
          if (data.config) {
            setNewConfig(data.config.name);
          } else {
            $scope.running = false;
          }
        }
      });
    };

    $scope.stop = function() {
      $scope.running = false;
      socket.emit('stop');
    };

    socket.on('progress', function (nodes) {
      if (!$scope.running) return;
      updateNodes(nodes);
    });

    socket.on('started', function (config) {
      $scope.running = true;
      $scope.getConfig(config.name);
    });

    socket.on('stopped', function() {
      $scope.running = false;
    });

    function updateNodes(nodes) {
      nodes.forEach(function (node) {
        $('.simulate-config #node-' + node).css({
          'stroke':  'green',
          'fill':    'green'
        });
      });
    }

    function setNewConfig(name) {
      $scope.configName = name;
      $scope.getConfig(name);
    }
});
