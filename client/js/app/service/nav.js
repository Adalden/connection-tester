/* global app */
var nav;
nav = [
  {
    name:   'Main',
    state:  'index',
    url:    '/',
    tmpl:   'tmpl/main.html',
    ctrl:   'mainCtrl'
  },
  {
    name:   'Protected',
    state:  'protected',
    url:    '/protected',
    tmpl:   'tmpl/protected.html',
    ctrl:   'protectedCtrl',
    acl:    'logged-in'
  },
  {
    name:   'Login',
    state:  'login',
    url:    '/login',
    tmpl:   'tmpl/login.html',
    ctrl:   'loginCtrl',
    hidden: true
  }
];

app.factory('nav',
  function () {
    'use strict';
    return nav;
  }
);
