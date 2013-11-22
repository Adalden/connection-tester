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
    name:   'Create',
    state:  'configurations',
    url:    '/configurations',
    tmpl:   'tmpl/configs.html',
    ctrl:   'configsCtrl',
    acl:    'engineer'
  },
  {
    name:   'Approve',
    state:  'approve',
    url:    '/approve',
    tmpl:   'tmpl/approve.html',
    ctrl:   'approveCtrl',
    acl:    'admin'
  },
  {
    name:   'Simulate',
    state:  'simulate',
    url:    '/simulate',
    tmpl:   'tmpl/simulate.html',
    ctrl:   'simulateCtrl',
    acl:    'tester'
  },
  {
    name:   'What Is My IP?',
    modal: true,
    tmpl:   'tmpl/m/ip.html',
    ctrl:   'modalIpCtrl',
    acl:    ['admin', 'engineer', 'tester']
  },
  {
    name:   'Help?',
    modal: true,
    tmpl:   'tmpl/m/help.html',
    ctrl:   'modalHelpCtrl'
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
