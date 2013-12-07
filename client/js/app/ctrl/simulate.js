/* global angular, d3, $ */

angular.module('app').controller('simulateCtrl',
  function ($scope, $timeout, configs, alerts){
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
        $scope.nodes = res.nodes;
        $scope.conns = res.conns;

        var timeout = $timeout(function() {
          $scope.nodes.forEach(function(node) {
            $('#node-'+node.id).css('fill', '#555555');
            $('#node-'+node.id).css('stroke', '#555555');
          });
          $timeout.cancel(timeout);
        }, 50);
      });
    };

    $scope.start = function() {
      if (!$scope.nodes.length && !$scope.conns.length) return;
      $scope.running = !$scope.running;
      console.log('start');
    };

    $scope.stop = function() {
      $scope.running = !$scope.running;
      console.log('stop');
    };




});
