/* jshint node:true */
'use strict';

var time = 1; // 15

var    http = require('http'),
    request = require('request'),
          _ = require('underscore');

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
    if (!curConfig.nodes || !curConfig.conns) return false;

    var selfNode = _.find(curConfig.nodes, function (node) {
      return node.ip === ip;
    });
    if (selfNode === null) return false;

    aliveNodes.push(selfNode.id);

    for (var j = 0; j < curConfig.conns.length; ++j) {
      var conn = curConfig.conns[j];
      if (conn.source === selfNode.id) {
        var sendNode = null;
        for (var k = 0; k < curConfig.nodes.length; ++k) {
          if (curConfig.nodes[k].id === conn.target) {
            sendNode = curConfig.nodes[k];
          }
        }
        var iid = createAnAsker(conn, sendNode);
        askers.push(iid);
      } else if (conn.target === selfNode.id) {
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
      clearInterval(askers[j]);
    }
    listeners.length = 0;
    aliveNodes.length = 0;
  }

  function createAServer(conn) {
    var id = http.createServer(function (req, res) {
      aliveNodes.push(conn.source);
      update();
      res.end(aliveNodes.toString());
    }).listen(conn.port);
    return id;
  }

  function createAnAsker(conn, sendNode) {
    if (!sendNode) return;
    var id = setInterval(function () {
      var url = 'http://' + sendNode.ip + ':' + conn.port;
      request(url, function (err, resp, body) {
        if (err) return;
        if (body) {
          var json = JSON.parse(body);
          aliveNodes.push(conn.target);
          aliveNodes = aliveNodes.concat(json);
          update();
        }
      });
    }, 1000 * time);
    return id;
  }

  function update() {
    aliveNodes = _.uniq(aliveNodes);
    io.sockets.emit('progress', aliveNodes);
  }
};

function getIp(cb) {
  request('http://bot.whatismyipaddress.com', function (err, resp, data) {
    if (err) return cb(err);
    cb(null, data);
  });
}
