/* global app */
app.controller('protectedCtrl',
  function ($scope) {
    'use strict';
    $scope.msg = 'This page is secret. You have to be logged in and have the proper acl to get here.';
  }
);
