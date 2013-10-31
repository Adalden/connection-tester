/* jshint node:true */
'use strict';

var hash = require('password-hash');

var verify = require('../utils/forms.js').verifyFields;
var userUtil = require('../utils/user.js');

module.exports = function (app) {
  var loggedIn = app.mw.isLoggedIn;
  var notLoggedIn = app.mw.isNotLoggedIn;

  app.post('/signup', notLoggedIn, signup);
  app.post('/login',  notLoggedIn, login);
  app.get('/logout',  loggedIn,    logout);
  app.get('/user',    loggedIn,    user);
};

var map = {
  name: 'Username',
  pass: 'Password'
};

function signup(req, res) {
  var userObj = req.body;

  var test = verify(userObj, ['name', 'pass']);

  if (test) return res.fail('Missing your ' + map[test] + '.');

  var myUser = {
    name: userObj.name,
    pass: hash.generate(userObj.pass, { iterations: 10 }),
    acl: ['logged-in']
  };

  userUtil.create(myUser, function (err, user) {
    if (err) return res.fail(err);
    delete user.pass;
    req.session.user = user;
    _sendUser(req, res);
  });
}

function login(req, res) {
  var userObj = req.body;

  var test = verify(userObj, ['name', 'pass']);

  if (test) {
    return res.fail('Missing a ' + map[test] + '.');
  }

  userUtil.get(userObj.name, function (err, user) {
    if (err) return res.fail('Incorrect Username or Password.');

    if (!hash.verify(userObj.pass, user.pass)) {
      return res.fail('Incorrect Username or Password.');
    }

    delete user.pass;
    req.session.user = user;
    _sendUser(req, res);
  });
}

function logout(req, res) {
  req.session.destroy(function () {
    res.send('ok');
  });
}

function user(req, res) {
  _sendUser(req, res);
}

function _sendUser(req, res) {
  res.send({
    success: true,
    user: req.session.user
  });
}
