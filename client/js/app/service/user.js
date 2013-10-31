/* global app, angular, _ */
app.factory('user',
  function ($rootScope, $http, $window) {
    'use strict';
    function User() {
      var user = this;

      this.hasACL = function (permission) {
        if ('data' in user) {
          if (_.isArray(user.data.acl)) {
            return _.contains(user.data.acl, permission);
          }
        }
        return false;
      };

      this.on = function (cb) {
        if (user.data) return cb();
        $rootScope.$on('got-user', function (e, isLoggedIn) {
          if (isLoggedIn) cb();
        });
      };

      this.check = function () {
        $http.get('/user').then(function (resp) {
          if (resp.data.success) {
            user.data = resp.data.user;
            $rootScope.$emit('got-user', true);
          } else {
            $rootScope.$emit('got-user', false);
          }
        });
      };

      this.login = function (name, pass, cb) {
        cb = cb || angular.noop;

        var data = {
          name: name,
          pass: pass,
        };

        $http.post('/login', data).then(function (resp) {
          if (resp.data.success) {
            user.data = resp.data.user;
            $rootScope.$emit('got-user', true);
            cb(null);
          } else {
            $rootScope.$emit('got-user', false);
            cb(resp.data.err);
          }
        });
      };

      this.logout = function () {
          $http.get('/logout').then(function () {
            $window.location.reload();
          });
      };
    }
    return new User();
  }
);
