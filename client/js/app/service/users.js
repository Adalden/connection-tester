/* global angular, _ */
angular.module('app').factory('users',
  function ($http) {
    'use strict';

    function getAll(cb) {
      $http.get('/all/users').then(function (resp) {
        if (!resp.data.success) return cb(resp.data.err);

        _.each(resp.data.users, function (user) {
          _translate(user);
        });
        cb(null, resp.data.users);
      });
    }

    function create(user, cb) {
      $http.post('/create/user', user).then(function (resp) {
        if (!resp.data.success) return cb(resp.data.err);

        cb(null, _translate(resp.data.user));
      });
    }

    function remove(name, cb) {
      $http.delete('/user/' + name).then(function (resp) {
        if (!resp.data.success) return cb(resp.data.err);
        cb();
      });
    }

    function update(user, cb) {
      $http.post('/update/user', user).then(function (resp) {
        if (!resp.data.success) return cb(resp.data.err);
        cb();
      });
    }

    function _translate(user) {
      user.acl = {
        admin: _.contains(user.acl, 'admin'),
        engineer: _.contains(user.acl, 'engineer'),
        tester: _.contains(user.acl, 'tester')
      };
      return user;
    }

    return {
      getAll: getAll,
      create: create,
      remove: remove,
      update: update
    };
  }
);
