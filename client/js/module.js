/* global angular, nav */
var app = angular.module('app', ['ui.bootstrap', 'ui.router']);

app.config(
  function ($stateProvider, $urlRouterProvider) {
    'use strict';

    for (var i = 0; i < nav.length; ++i) {
      $stateProvider.state(nav[i].state, {
        templateUrl: nav[i].tmpl,
        controller: nav[i].ctrl,
        url: nav[i].url,
        acl: nav[i].acl
      });
    }

    $urlRouterProvider.otherwise('/');
  }
);
