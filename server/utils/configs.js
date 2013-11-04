'use strict';

var fs    = require('fs'),
  configs = require('../data/configurations.json');

module.exports = {
  save: save,
  get:  get
};

function save(req, res) {
  fs.readFile(__dirname + '/../data/configurations.json', function (err, data) {
    if (err) return res.fail(err);
    var data = JSON.parse(data);
    data.push(req.body);
    fs.writeFile(__dirname + '/../data/configurations.json', JSON.stringify(data), function (err) {
      if (err) return res.fail(err);
      res.send('ok');
    });
  });
};

function get(req, res) {
  fs.readFile(__dirname + '/../data/configurations.json', function(err, data) {
    if (err) return res.fail(err);
    res.send(JSON.parse(data));
  });
};
