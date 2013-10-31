/* global app */
app.directive('header',
  function () {
    'use strict';
    return {
      restricts: 'EA',
      controller: 'headerCtrl',
      templateUrl: 'tmpl/header.html'
    };
  }
);
