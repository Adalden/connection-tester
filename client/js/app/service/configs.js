/* global angular*/
angular.module('app').factory('configs',
  function ($http){
    'use strict';

    function list(cb) {
      $http.get('/config/list').then(function (resp) {
        if (!resp.data.success) return cb(resp.data.err);
        cb(null, resp.data.configs);
      });
    }

    function exists(name, cb) {
      $http.get('/config/' + name + '/exists').then(function (resp) {
        if (!resp.data.success) return cb(resp.data.err);
        cb(null, resp.data.exists);
      });
    }

    function save(config, cb) {
      $http.post('/config/save', config).then(function (resp) {
        if (!resp.data.success) return cb(resp.data.err);
        cb();
      });
    }

    function get(name, cb) {
      $http.get('/config/get/' + name).then(function (resp) {
        if (!resp.data.success) return cb(resp.data.err);
        cb(null, resp.data.config);
      });
    }

    return {
      exists: exists,
      list:   list,
      save:   save,
      get:    get
    };
  }
);
