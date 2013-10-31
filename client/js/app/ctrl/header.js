/* global app */
app.controller('headerCtrl',
  function ($scope, $state, user, nav) {
    'use strict';
    $scope.nav = nav;
    $scope.state = $state;

    $scope.goTo = function (item) {
      $state.transitionTo(item.state);
    };

    $scope.lMsg = 'Login';
    user.on(function () {
      $scope.lMsg = 'Logout';
    });

    $scope.logInOut = function (str) {
      if (str === 'Login') {
        $state.transitionTo('login');
      } else {
        user.logout();
      }
    };

    $scope.security = function (item) {
      if (item.hidden) return false;
      if (item.acl) {
        return user.hasACL(item.acl);
      }
      return true;
    };
  }
);
