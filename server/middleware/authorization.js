/* jshint node:true */
'use strict';

module.exports = function (app) {
  app.mw.isLoggedIn = isLoggedIn;
  app.mw.isNotLoggedIn = isNotLoggedIn;
  // TODO:: write hasACL function
};

function isLoggedIn(req, res, next) {
  if (req.session.user) return next();
  res.fail('Not Logged In');
}

function isNotLoggedIn(req, res, next) {
  if (!req.session.user) return next();
  res.fail('Already Logged In');
}
