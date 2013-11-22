/* global angular, _ */
angular.module('app').controller('configsCtrl',
  function ($scope, $modal, alerts, configs) {
    'use strict';

    newConfig();

    $scope.select = function (name, item) {
      $scope.editTitle = name;
      $scope.editItem = item;
    };

    $scope.deselect = function () {
      $scope.editTitle = '';
      $scope.editItem = '';
    };

    $scope.newButton = function () {
      ensureSave(newConfig);
    };

    function newConfig() {
      $scope.unsavedChanges = false;
      $scope.name = '';

      $scope.nodes = [
        { id: 0 },
        { id: 1 },
        { id: 2 }
      ];

      $scope.conns = [
        { source: 0, target: 1 },
        { source: 1, target: 2 }
      ];
    }

    $scope.openButton = function () {
      ensureSave(openDialog);
    };

    function openDialog() {
      createModal('tmpl/m/open.html', 'modalOpenCtrl').then(function (choice) {
        openConfig(choice);
      }, function (err) {
        if (err && err !== 'backdrop click')
          alerts.create('error', err);
      });
    }

    function openConfig(name) {
      configs.get(name, function (err, config) {
        if (err) return alerts.create('error', err);
        $scope.unsavedChanges = false;
        $scope.name = name;
        $scope.nodes = config.nodes;
        $scope.conns = config.conns;
      });
    }

    $scope.saveButton = function (saveAs) {
      if (saveAs) return saveDialog();
      saveConfig();
    };

    function saveDialog() {
      createModal('tmpl/m/save.html', 'modalSaveCtrl').then(function (name) {
        configs.exists(name, function (err, doesExist) {
          if (err) return alerts.create('error', err);
          var newSaveFn = _.partial(saveConfig, name);
          if (doesExist) return showPrompt('That name is already taken. Are you sure you want to overwrite it?', newSaveFn);
          newSaveFn();
        });
      }, function (err) {
        if (err && err !== 'backdrop click')
          alerts.create('error', err);
      });
    }

    function saveConfig(name) {
      var testName = name || $scope.name;
      var toSave = serializeConfig(testName);
      configs.save(toSave, function (err) {
        if (err) return alerts.create('error', err);
        alerts.create('success', 'Configuration saved successfully!');
        $scope.unsavedChanges = false;
        $scope.name = testName;
      });
    }

    function serializeConfig(name) {
      var nodes = _.map($scope.nodes, function (node) {
        return {
          id: node.id,
          name: node.name,
          color: node.color,
          ip: node.ip,
          os: node.os
        };
      });
      var conns = _.map($scope.conns, function (conn) {
        return {
          port: conn.port,
          target: conn.target.id,
          source: conn.source.id
        };
      });

      return {
        name: name,
        nodes: nodes,
        conns: conns
      };
    }

    function showPrompt(msg, cb) {
      createModal('tmpl/m/prompt.html', 'modalPromptCtrl', msg).then(cb);
    }

    function createModal(tmpl, ctrl, msg) {
      var opts = {
        templateUrl: tmpl,
        controller: ctrl
      };

      if (msg) {
        opts.resolve = {
          msg: function () {
            return msg;
          }
        };
      }

      return $modal.open(opts).result;
    }

    function ensureSave(fn) {
      if (!$scope.unsavedChanges) return fn();
      showPrompt('You have unsaved changes. Are you sure you want to continue?', fn);
    }
  }
);
