/* global app */
app.controller('loginCtrl',
  function ($scope, $rootScope, $state, user, alerts) {
    'use strict';

    user.on(function () {
      $state.transitionTo('index');
    });

    $scope.login = function (name, pass) {
      user.login(name, pass, function (err) {
        if (err) return alerts.create('error', err);
        alerts.create('success', 'Logged In!');
      });
    };
  }
);
