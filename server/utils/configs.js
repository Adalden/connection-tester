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
  exists: exists,
  list:   list,
  save:   save,
  getAll: getAll,
  get:    get
};

function get(req, res) {
  var config = configs[req.params.name];
  if (!config) return res.fail('No such config exists.');

  res.send({
    success: true,
    config:  config
  });
}

function getAll(req, res) {
  res.send({
    success: true,
    configs: configs
  });
}

function list(req, res) {
  res.send({
    success: true,
    configs: _.keys(configs)
  });
}

function exists(req, res) {
  var config = configs[req.params.name];
  res.send({
    success: true,
    exists:  !!config
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

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+ Private Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

function _updateConfigFile(cb) {
  fs.writeFile(__dirname + '/../data/configurations.json', JSON.stringify(configs), cb);
}
