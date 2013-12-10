/* jshint node:true */
'use strict';

var configs = require('../utils/configs.js');
var request = require('request');

var url = 'http://json-copy.aws.af.cm/';
var token = '8dadeed6-f936-7efe-d171-8779d9f45fdb';

module.exports = function (app) {
  app.get('/dev/saveAll', saveAll);
  app.get('/dev/loadAll', loadAll);
};

function saveAll(req, res) {
  request({
    method: 'POST',
    url: url + token,
    json: { json: configs._getAll() }
  }, function (err, resp, data) {
    if (err) return res.fail(err);
    if (!data.success) return res.fail(data.err);
    res.send({
      success: true
    });
  });
}

function loadAll(req, res) {
  request(url + token, function (err, resp, data) {
    if (err) return res.fail(err);
    data = JSON.parse(data);
    if (!data.success) return res.fail(data.err);
    configs._setAll(data.json, function (err) {
      if (err) return res.fail(err);
      res.send({
        success: true
      });
    });
  });
}
