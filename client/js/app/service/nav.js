/* global app */
var nav;
nav = [
  {
    name:   'Main',
    state:  'index',
    url:    '/',
    tmpl:   'tmpl/main.html',
    ctrl:   'mainCtrl',
    hidden: true
  },
  {
    name:   'Users',
    state:  'users',
    url:    '/users',
    tmpl:   'tmpl/users.html',
    ctrl:   'usersCtrl',
    acl:    'admin'
  },
  {
    name:   'Configurations',
    state:  'configurations',
    url:    '/configurations',
    tmpl:   'tmpl/configurations.html',
    ctrl:   'configurationsCtrl',
    acl:    'engineer'
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
