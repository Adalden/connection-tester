/* jshint node:true */
'use strict';

var request = require('request');

module.exports = function (app) {
  app.get('/ip', getIp);
};

function getIp(req, res) {
  request('http://bot.whatismyipaddress.com', function (err, resp, data) {
    if (err) return res.fail(err);
    res.send({
      success: true,
      ip: data
    });
  });
}
