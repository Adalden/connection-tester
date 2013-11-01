/* jshint node:true */
'use strict';

var user = require('../utils/userFile.js');

module.exports = function (app) {
  var loggedIn = app.mw.isLoggedIn;
  var notLoggedIn = app.mw.isNotLoggedIn;
  var hasACL = app.mw.hasACL;

  app.post('/login',
    notLoggedIn,
    user.login
  );

  app.post('/create/user',
    loggedIn,
    hasACL('admin'),
    user.create
  );

  app.post('/update/user',
    loggedIn,
    hasACL('admin'),
    user.update
  );

  app.get('/logout',
    loggedIn,
    user.logout
  );

  app.get('/user',
    loggedIn,
    user.get
  );

  app.get('/all/users',
    loggedIn,
    hasACL('admin'),
    user.getAll
  );
};
