/* global angular, d3, $ */

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
      configs.get(selected, function(err, res) {
        if (err) return alerts.create('error', 'Failed to load selected configuration!');
        $scope.curConfig = {};
        $.extend($scope.curConfig, res);
        $scope.nodes = res.nodes;
        $scope.conns = res.conns;

        var timeout = $timeout(function() {
          $scope.nodes.forEach(function(node) {
            $('#node-'+node.id).css({
              'stroke':  '#555555',
              'fill':    '#555555'
            });
          });
          $timeout.cancel(timeout);
        }, 50);
      });
    };

    $scope.start = function() {
      if (!$scope.nodes.length && !$scope.conns.length) return;
      $scope.running = !$scope.running;
      socket.emit('start', $scope.curConfig, function(err, res) {
        console.log(err, res);
      });
    };

    $scope.stop = function() {
      $scope.running = !$scope.running;
      socket.emit('stop');
    };

    socket.on('progress', function(nodes) {
      console.log(nodes);
      nodes.forEach(function(node) {
        $('#node-' + node.id).css({
          'stroke':  'red',
          'fill':    'red'
        });
      });
    });

    socket.on('started', function(config) {
      $scope.running = true;
      $scope.curConfig = config;
      $scope.nodes = config.nodes;
      $scope.conns = config.conns;
    });

    socket.on('stopped', function() {
      $scope.running = false;
    });

});
