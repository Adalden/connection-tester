/* jshint node:true */
'use strict';

var config = require('../utils/configs.js');

module.exports = function (app) {
  var loggedIn = app.mw.isLoggedIn;
  var hasACL = app.mw.hasACL;

  app.post('/config/save',
    loggedIn,
    hasACL('engineer'),
    config.save
  );

  app.get('/config/get/:name',
    loggedIn,
    hasACL('engineer'),
    config.get
  );

  app.get('/config/getAll',
    loggedIn,
    hasACL('admin'),
    config.getAll
  );

  app.get('/config/list',
    loggedIn,
    hasACL('engineer'),
    config.list
  );

  app.get('/config/:name/exists',
    loggedIn,
    hasACL('engineer'),
    config.exists
  );
};
