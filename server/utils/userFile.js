/* jshint node:true */
'use strict';

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+ Include Deps -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
var     fs = require('fs'),
      hash = require('password-hash'),
         _ = require('underscore'),
    verify = require('../utils/forms.js').verifyFields,
     users = require('../data/users.json');

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+ Public Functions -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

module.exports = {
  login: login,
  logout: logout,
  create: create,
  update: update,
  remove: remove,
  get: get,
  getAll: getAll
};

var map = {
  name: 'Username',
  pass: 'Password'
};

function login(req, res) {
  var test = verify(req.body, ['name', 'pass']);
  if (test) {
    return res.fail('Missing a ' + map[test] + '.');
  }

  var user = users[req.body.name];
  if (!user) return res.fail('User doesn\'t exist.');

  if (!hash.verify(req.body.pass, user.pass)) {
    return res.fail('Incorrect Password');
  }

  req.session.user = user;
  _sendUser(req, res);
}

function logout(req, res) {
  req.session.destroy(function () {
    res.send('ok');
  });
}

function create(req, res) {
  var id = req.body.id;

  if (users[id]) return res.fail('User already exists.');

  users[id] = req.body;

  _updateUserFile(function (err) {
    if (err) return res.fail(err);

    res.send({
      success: true
    });
  });
}

function update(req, res) {
  var id = req.body.id;

  if (!users[id]) return res.fail('No such user exists.');

  users[id] = req.body;

  _updateUserFile(function (err) {
    if (err) return res.fail(err);

    res.send({
      success: true
    });
  });
}

function remove(req, res) {
  var id = req.body.id;

  if (!users[id]) return res.fail('No such user exists.');

  delete users[id];

  _updateUserFile(function (err) {
    if (err) return res.fail(err);

    res.send({
      success: true
    });
  });
}

function get(req, res) {
  _sendUser(req, res);
}

function getAll(req, res) {
  var arr = _.values(users);
  res.send({
    success: true,
    users: arr
  });
}

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+ Private Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

function _sendUser(req, res) {
  res.send({
    success: true,
    user: req.session.user
  });
}

function _updateUserFile(cb) {
  // TODO write the file here
  // fs.writeFile()
  cb(null);
}
