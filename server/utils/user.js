/* jshint node:true */
'use strict';

var request = require('request'),
         cc = require('config').couch;

var couchURL = 'http://' + cc.host + ':' + cc.port + '/' + cc.db.users;

function getUser(name, cb) {
  _getUser(name, function (err, user) {
    if (err) return cb(err);
    cb(null, strip(user));
  });
}

function createUser(user, cb) {
  _getUser(user.name, function (err) {
    if (!err) return cb('User Already Exists');
    _putUser(user, cb);
  });
}

function updateUser(user, cb) {
  _getUser(user.name, function (err, storedUser) {
    if (err) return cb(err);
    user._id = storedUser._id;
    user._rev = storedUser._rev;
    _putUser(user, function (err, newUser) {
      if (err) return cb(err);
      cb(null, strip(newUser));
    });
  });
}

module.exports = {
  create: createUser,
  update: updateUser,
  get: getUser
};

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+ Private Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

function strip(user) {
  delete user._id;
  delete user._rev;
  return user;
}

function _getUser(name, cb) {
  request({
    url: couchURL + '/' + name,
    method: 'GET',
  }, function (err, resp, body) {
    if (err) return cb(err);
    body = JSON.parse(body);
    if (body.error) return cb(body);
    cb(null, body);
  });
}

function _putUser(user, cb) {
  request({
    url: couchURL + '/' + user.name,
    method: 'PUT',
    json: user
  }, function (err, resp, body) {
    if (err) return cb(err);
    if (body.error) return cb(body);
    cb(null, user);
  });
}
