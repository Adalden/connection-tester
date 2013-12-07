/* jshint node:true */
'use strict';

var request = require('request');

module.exports = function (io) {

  var sessionGuid = 0;
  var running = false;
  var curConfig;
  var listeners = [];

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
        startSimulation();
        socket.broadcast.emit('started');
        fn({
          success: true
        });
      }
    });

    socket.on('stop', function () {
      stopSimulation();
      destroySimulation();
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
    curConfig = {'name':'Test1','nodes':[{'id':0},{'id':1},{'id':2}],'conns':[{'target':1,'source':0},{'target':2,'source':1}],'approved':true};
    running = true;
  }

  function startSimulation() {
    var selfNode = null;
    for (var i = 0; i < curConfig.nodes.length; ++i) {
      if (curConfig.nodes[i].ip === '127.0.0.1') {
        selfNode = curConfig.nodes[i].id;
      }
    }

    if (selfNode === null) return false;

    for (var j = 0; j < curConfig.conns.length; ++i) {
      if (curConfig);
    }

  }

  function destroySimulation() {
    ++sessionGuid;
    running = false;
    curConfig = null;
  }

  function stopSimulation() {
    for (var i = 0; i < listeners.length; ++i) {

    }
  }
};
