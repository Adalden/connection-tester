/* jshint node:true */
'use strict';

var time = 1; // 15

var    http = require('http'),
    request = require('request');

module.exports = function (io) {
  var sessionGuid = 0;
  var running = false;
  var curConfig;
  var listeners = [];
  var askers = [];
  var aliveNodes = [];

  var ip;

  getIp(function (err, data) {
    ip = data;
  });

  io.sockets.on('connection', function (socket) {

    socket.on('start', function (config, fn) {
      if (running) {
        fn({
          success: false,
          err: 'Simulation in Progress',
          config: curConfig
        });
      } else {
        setupSimulation(config);
        if (!startSimulation()) {
          fn({
            success: false,
            err: 'Bad Config or IP Not Found'
          });
          return;
        }
        socket.broadcast.emit('started', config);
        fn({
          success: true
        });
      }
    });

    socket.on('stop', function () {
      stopSimulation();
      socket.broadcast.emit('stopped');
    });

    socket.on('status', function (nothing, fn) {
      if (running) {
        fn({
          running: true,
          config: curConfig
        });
      } else {
        fn({
          running: false
        });
      }
    });
  });

  function setupSimulation(config) {
    ++sessionGuid;
    curConfig = config;
    running = true;
  }

  function startSimulation() {
    var selfNode = null;
    if (!curConfig.nodes || !curConfig.conns) return false;

    for (var i = 0; i < curConfig.nodes.length; ++i) {
      var node = curConfig.nodes[i];
      if (node.ip === ip) {
        selfNode = curConfig.nodes[i].id;
      }
    }
    if (selfNode === null) return false;

    for (var j = 0; j < curConfig.conns.length; ++j) {
      var conn = curConfig.conns[j];
      if (conn.source === selfNode) {
        var sendNode = null;
        for (var k = 0; k < curConfig.nodes.length; ++k) {
          if (curConfig.nodes[k].id === conn.target) {
            sendNode = curConfig.nodes[i].id;
          }
        }
        var iid = createAnAsker(conn, sendNode);
        askers.push(iid);
      } else if (conn.target === selfNode) {
        if (conn.port) {
          var sid = createAServer(conn);
          listeners.push(sid);
        }
      }
    }

    return true;
  }

  function stopSimulation() {
    ++sessionGuid;
    running = false;
    curConfig = null;
    for (var i = 0; i < listeners.length; ++i) {
      // kill the server listeners[i]
    }
    for (var j = 0; j < askers.length; ++j) {
      // kill the intervals
    }
    listeners.length = 0;
    aliveNodes.length = 0;
  }

  function createAServer(conn) {
    console.log('setting up Server' + conn.port);
    var id = http.createServer(function (req, res) {
      var exists = false;
      for (var i = 0; i < aliveNodes.length && !exists; ++i) {
        if (aliveNodes[i] === conn.source) {
          exists = true;
        }
      }
      if (!exists) aliveNodes.push(conn.source);
      update();
      res.end(aliveNodes.toString());
    }).listen(conn.port);
    return id;
  }

  function createAnAsker(conn, sendNode) {
    if (!sendNode) return;
    var hi = 'http://' + sendNode.ip + ':' + conn.port;
    console.log('setting up Asker' + hi);

    var id = setInterval(function () {
      var url = 'http://' + sendNode.ip + ':' + conn.port;
      request(url, function (err, resp, body) {
        if (err) return;
        if (body) {
          console.log(typeof body);
          console.log(body);
        }
      });
    }, 1000 * time);
    return id;
  }

  function update() {
    io.sockets.emit('progress', aliveNodes);
  }
};

function getIp(cb) {
  request('http://bot.whatismyipaddress.com', function (err, resp, data) {
    if (err) return cb(err);
    cb(null, data);
  });
}
