/* jshint node:true */
'use strict';

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+ Include Deps -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

var      fs = require('fs'),
          _ = require('underscore'),
    configs = require('../data/configurations.json');

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+ Public Functions -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

module.exports = {
  exists:  exists,
  list:    list,
  save:    save,
  get:     get,
  approve: approve,
  remove:  remove,
  _setAll: _setAll,
  _getAll: _getAll
};

function get(req, res) {
  var config = configs[req.params.name];
  if (!config) return res.fail('No such config exists.');

  res.send({
    success: true,
    config:  config
  });
}

function list(req, res) {
  res.send({
    success: true,
    configs: _.keys(configs) // also send approved status
  });
}

function exists(req, res) {
  var config = configs[req.params.name];
  res.send({
    success: true,
    exists:  !!config
  });
}

function approve(req, res) {
  var config = configs[req.params.name] || {};

  config.approved = true;

  _updateConfigFile(function (err) {
    if (err) return res.fail(err);
    res.send({
      success: true
    });
  });
}

function save(req, res) {
  var newConfig = req.body;
  newConfig.approved = false;

  configs[newConfig.name] = newConfig;

  _updateConfigFile(function (err) {
    if (err) return res.fail(err);
    res.send({
      success: true
    });
  });
}

function remove(req, res) {
  if (configs[req.params.name]) {
    delete configs[req.params.name];
  }
  _updateConfigFile(function () {
    res.send({
      success: true
    });
  });
}

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+ Private Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

function _updateConfigFile(cb) {
  fs.writeFile(__dirname + '/../data/configurations.json', JSON.stringify(configs), cb);
}

function _setAll(_configs, cb) {
  configs = _configs;
  _updateConfigFile(cb);
}

function _getAll() {
  return configs;
}
