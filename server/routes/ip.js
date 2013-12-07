/* jshint node:true */
'use strict';

var request = require('request');

// var os = require('os');
// var ifaces = os.networkInterfaces();

// var ips = [];
// for (var dev in ifaces) {
//   for (var i = 0; i < ifaces[dev].length; ++i) {
//     if (ifaces[dev][i].family === 'IPv4') {
//       ips.push(ifaces[dev][i].address);
//     }
//   }
// }


module.exports = function (app) {
  app.get('/ip', getIp);
};

function getIp(req, res) {
  request('http://bot.whatismyipaddress.com', function (err, resp, data) {
    if (err) return res.fail(err);
    res.send({
      success: true,
      ip: data
      //   internal: ips,
      //   external: data
      // }
    });
  });
}
