/* jshint node:true */
'use strict';

var config = require('../utils/configs.js');

module.exports = function (app) {
  var loggedIn = app.mw.isLoggedIn;
  var hasACL = app.mw.hasACL;

  app.post('/config/save',
    loggedIn,
    hasACL('admin'),
    config.save
  );

  app.get('/config/get',
    loggedIn,
    hasACL('admin'),
    config.get
  );
};
