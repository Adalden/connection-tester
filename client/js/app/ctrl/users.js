/* global angular, _ */
angular.module('app').controller('usersCtrl',
  function ($scope, alerts, users) {
    'use strict';

    $scope.modalOpts = {
      backdropFade: true,
      dialogFade: true
    };

    users.getAll(function (err, all) {
      if (err) return alerts.create('error', err);
      $scope.users = all;
    });

    $scope.updateUser = function (updatedUser) {
      var user = _translate(updatedUser);

      users.update(user, function (err) {
        if (err) return alerts.create('error', err);
      });
    };

    $scope.deleteUser = function (user) {
      users.remove(user.name, function (err) {
        if (err) return alerts.create('error', err);
        $scope.users = _.without($scope.users, user);
      });
    };

    $scope.addUser = function (newUser) {
      var user = _translate(newUser);

      users.create(user, function (err, savedUser) {
        if (err) return alerts.create('error', err);
        $scope.users.push(savedUser);
        $scope.showModal = false;

        $scope.nu = {};
      });
    };

    function _translate(user) {
      var newUser = {
        name: user.name.replace(/[\/\\]/g, '').trim(),
        pass: user.pass,
        acl: []
      };

      user.acl = user.acl || {};
      if (user.acl.admin) newUser.acl.push('admin');
      if (user.acl.engineer) newUser.acl.push('engineer');
      if (user.acl.tester) newUser.acl.push('tester');

      return newUser;
    }
  }
);
