/* jshint node:true */
'use strict';

var _ = require('underscore');

module.exports = function (app) {
  app.mw.isLoggedIn = isLoggedIn;
  app.mw.isNotLoggedIn = isNotLoggedIn;
  app.mw.hasACL = hasACL;
};

function isLoggedIn(req, res, next) {
  if (req.session.user) return next();
  res.fail('Not Logged In');
}

function isNotLoggedIn(req, res, next) {
  if (!req.session.user) return next();
  res.fail('Already Logged In');
}

function hasACL(permission) {
  return function (req, res, next) {
    var user = req.session.user;
    if (user && _.isArray(user.acl)) {
      if (_.contains(user.acl, permission)) {
        return next();
      }
    }

    res.fail('Insufficient Privileges');
  };
}
