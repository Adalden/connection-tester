/* global angular, _ */
angular.module('app').controller('usersCtrl',
  function ($scope, $modal, alerts, users) {
    'use strict';

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

    $scope.newUserDialog = function () {
      $modal.open({
        templateUrl: 'tmpl/m/user.html',
        controller: 'modalUser'
      }).result.then(function (newUser) {
        addUser(newUser);
      });
    };

    function addUser(newUser) {
      var user = _translate(newUser);

      users.create(user, function (err, savedUser) {
        if (err) return alerts.create('error', err);
        $scope.users.push(savedUser);
      });
    }

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
