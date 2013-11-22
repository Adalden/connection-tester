/* global angular, console, _ */
angular.module('app').controller('configsCtrl',
  function ($scope, $modal, alerts, configs) {
    'use strict';

    var unsavedChanges;
    newConfig();

    $scope.newButton = function () {
      ensureSave(newConfig);
    };

    function newConfig() {
      unsavedChanges = false;
      $scope.name = '';
      $scope.nodes = [];
      $scope.conns = [];
      // possibly refresh directive
    }

    $scope.openButton = function () {
      ensureSave(openDialog);
    };

    function openDialog() {
      createModal('tmpl/m/open.html', 'modalOpen').then(function (choice) {
        openConfig(choice);
      }, function (err) {
        if (err && err !== 'backdrop click')
          alerts.create('error', err);
      });
    }

    function openConfig(name) {
      configs.get(name, function (err, config) {
        if (err) return alerts.create('error', err);
        unsavedChanges = false;
        $scope.name = name;
        console.log('load this config:', config);
      });
    }

    $scope.saveButton = function (saveAs) {
      if (saveAs) return saveDialog();
      saveConfig();
    };

    function saveDialog() {
      createModal('tmpl/m/save.html', 'modalSave').then(function (name) {
        configs.exists(name, function (err, doesExist) {
          if (err) return alerts.create('error', err);
          var newSaveFn = _.partial(saveConfig, name);
          if (doesExist) return showPrompt('That name is already taken. Are you sure you want to overwrite it?', newSaveFn);
          newSaveFn();
        });
      }, function (err) {
        if (err && err !== 'backdrop click')
          alerts.create('error', err);
      });
    }

    function saveConfig(name) {
      var testName = name || $scope.name;
      var toSave = serializeConfig(testName);
      configs.save(toSave, function (err) {
        if (err) return alerts.create('error', err);
        alerts.create('success', 'Configuration saved successfully!');
        unsavedChanges = false;
        $scope.name = testName;
      });
    }



    function serializeConfig(name) {
      return {
        name: name,
        msg: 'NEED TO IMPLEMENT'
      };
    }

    function showPrompt(msg, cb) {
      createModal('tmpl/m/prompt.html', 'modalPrompt', msg).then(cb);
    }

    function createModal(tmpl, ctrl, msg) {
      var opts = {
        templateUrl: tmpl,
        controller: ctrl
      };

      if (msg) {
        opts.resolve = {
          msg: function () {
            return msg;
          }
        };
      }

      return $modal.open(opts).result;
    }

    function ensureSave(fn) {
      if (!unsavedChanges) return fn();
      showPrompt('You have unsaved changes. Are you sure you want to continue?', fn);
    }

    // // set up SVG for D3
    // $scope.configSelected = false;
    // $scope.selectConfig   = false;
    // $scope.configName     = '';

    // nodeSaver.retrieveConfigs(function(res) {
    //   if (!res) return alerts.create('error', 'Woops something bad happened...');
    //   $scope.savedConfigs = res;
    //   // $scope.curConfig = $scope.savedConfigs[0];
    // });

    // $scope.saveConfiguration = function (name) {
    //   var newConfig = {
    //     name:  name,
    //     nodes: [],
    //     links: []
    //   };

    //   newConfig.nodes = _.map($scope.nodes, function (node) {
    //     return {
    //       id: node.id,
    //       name: node.name,
    //       ip: node.ip,
    //       os: node.os
    //     };
    //   });

    //   newConfig.links = _.map($scope.links, function (link) {
    //     return {
    //       target: link.target.id,
    //       source: link.source.id,
    //       port: link.port
    //     };
    //   });

    //   nodeSaver.saveConfig(newConfig, function (res) {
    //     if(!res) {
    //       alerts.create('error', 'Woops something bad happened...');
    //     } else {
    //       alerts.create('success', 'Configuration saved!');
    //     }
    //   });
    // };

    // $scope.openConfiguration = function () {
    //   $scope.configSelected = false;
    //   $scope.selectConfig   = true;
    // };

    // $scope.loadSelected = function (config) {
    //   $scope.configName = config.name;
    //   $scope.configSelected = false;
    //   $scope.selectConfig   = false;

    //   $scope.nodes.length = 0;
    //   _.each(config.nodes, function (node) {
    //     $scope.nodes.push(node);
    //   });

    //   $scope.links.length = 0;
    //   _.each(config.links, function (link) {
    //     $scope.links.push({
    //       source: getById($scope.nodes, link.source),
    //       target: getById($scope.nodes, link.target),
    //       port: link.port
    //     });
    //   });

    //   _.each($scope.nodes, function (node) {
    //     node.id = ++lastNodeId;
    //   });

    //   restart();
    // };

    // function getById(arr, id) {
    //   return _.find(arr, function (node) {
    //     return node.id == id;
    //   });
    // }

    // var width  = 960,
    //     height = 500,
    //     colors = d3.scale.category10();

    // var svg = d3.select('#configBuilder')
    //   .append('svg')
    //   .attr('width', width)
    //   .attr('height', height);

    // // set up initial $scope.nodes and $scope.links
    // //  - $scope.nodes are known by 'id', not by index in array.
    // //  - reflexive edges are indicated on the node (as a bold black circle).
    // //  - $scope.links are always source < target; edge directions are set by 'left' and 'right'.
    // $scope.links = [];
    // $scope.nodes = [
    //   { id: 0 }
    // ];
    // var lastNodeId = 0;

    // // init D3 force layout
    // var force = d3.layout.force()
    //     .nodes($scope.nodes)
    //     .links($scope.links)
    //     .size([width, height])
    //     .linkDistance(150)
    //     .charge(-500)
    //     .on('tick', tick);

    // // define arrow markers for graph $scope.links
    // svg.append('svg:defs').append('svg:marker')
    //     .attr('id', 'end-arrow')
    //     .attr('viewBox', '0 -5 10 10')
    //     .attr('refX', 6)
    //     .attr('markerWidth', 3)
    //     .attr('markerHeight', 3)
    //     .attr('orient', 'auto')
    //     .append('svg:path')
    //     .attr('d', 'M0,-5L10,0L0,5')
    //     .attr('fill', '#000');

    // svg.append('svg:defs').append('svg:marker')
    //     .attr('id', 'start-arrow')
    //     .attr('viewBox', '0 -5 10 10')
    //     .attr('refX', 4)
    //     .attr('markerWidth', 3)
    //     .attr('markerHeight', 3)
    //     .attr('orient', 'auto')
    //     .append('svg:path')
    //     .attr('d', 'M10,-5L0,0L10,5')
    //     .attr('fill', '#000');

    // // line displayed when dragging new $scope.nodes
    // var drag_line = svg.append('svg:path')
    //   .attr('class', 'link dragline hidden')
    //   .attr('d', 'M0,0L0,0');

    // // handles to link and node element groups
    // var path = svg.append('svg:g').selectAll('path'),
    //     circle = svg.append('svg:g').selectAll('g');

    // // mouse event vars
    // var selected_node = null,
    //     selected_link = null,
    //     mousedown_link = null,
    //     mousedown_node = null,
    //     mouseup_node = null;

    // function resetMouseVars() {
    //   mousedown_node = null;
    //   mouseup_node = null;
    //   mousedown_link = null;
    // }

    // // update force layout (called automatically each iteration)
    // function tick() {
    //   // draw directed edges with proper padding from node centers
    //   path.attr('d', function (d) {
    //     var deltaX = d.target.x - d.source.x,
    //         deltaY = d.target.y - d.source.y,
    //         dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
    //         normX = deltaX / dist,
    //         normY = deltaY / dist,
    //         sourceX = d.source.x + (17 * normX),
    //         sourceY = d.source.y + (17 * normY),
    //         targetX = d.target.x - (12 * normX),
    //         targetY = d.target.y - (12 * normY);
    //     return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
    //   });

    //   circle.attr('transform', function(d) {
    //     return 'translate(' + d.x + ',' + d.y + ')';
    //   });
    // }

    // // update graph (called when needed)
    // function restart() {
    //   // path (link) group
    //   path = path.data($scope.links);

    //   // update existing $scope.links
    //   path.classed('selected', function (d) { return d === selected_link; })
    //     .style('marker-start', 'url(#start-arrow)');

    //   // add new $scope.links
    //   path.enter().append('svg:path')
    //     .attr('class', 'link')
    //     .classed('selected', function (d) { return d === selected_link; })
    //     .style('marker-start', 'url(#start-arrow)')
    //     .on('mousedown', function (d) {
    //       if (d3.event.ctrlKey || d3.event.metaKey) return;

    //       // select link
    //       mousedown_link = d;
    //       if (mousedown_link === selected_link) selected_link = null;
    //       else selected_link = mousedown_link;
    //       selected_node = null;

    //       $scope.configSelected = 'line';
    //       $scope.line = selected_link ? selected_link : mousedown_link;
    //       $scope.$apply();

    //       restart();
    //     });

    //   // remove old $scope.links
    //   path.exit().remove();

    //   // circle (node) group
    //   // NB: the function arg is crucial here! $scope.nodes are known by id, not by index!
    //   circle = circle.data($scope.nodes, function (d) { return d.id; });

    //   // update existing $scope.nodes (reflexive & selected visual states)
    //   circle.selectAll('circle')
    //     .style('fill', function (d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); });

    //   // add new $scope.nodes
    //   var g = circle.enter().append('svg:g');

    //   g.append('svg:circle')
    //     .attr('class', 'node')
    //     .attr('r', 12)
    //     .style('fill', function (d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
    //     .style('stroke', function (d) { return d3.rgb(colors(d.id)).darker().toString(); })
    //     .on('mouseover', function (d) {
    //       if (!mousedown_node || d === mousedown_node) return;
    //       // enlarge target node
    //       d3.select(this).attr('transform', 'scale(1.1)');
    //     })
    //     .on('mouseout', function (d) {
    //       if (!mousedown_node || d === mousedown_node) return;
    //       // unenlarge target node
    //       d3.select(this).attr('transform', '');
    //     })
    //     .on('mousedown', function (d) {
    //       if (d3.event.ctrlKey || d3.event.metaKey) return;

    //       // select node
    //       mousedown_node = d;
    //       if (mousedown_node === selected_node) selected_node = null;
    //       else selected_node = mousedown_node;
    //       selected_link = null;

    //       $scope.configSelected = 'node';
    //       $scope.node = selected_node ? selected_node : mousedown_node;
    //       $scope.$apply();

    //       // reposition drag line
    //       drag_line
    //         .style('marker-end', 'url(#end-arrow)')
    //         .classed('hidden', false)
    //         .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

    //       restart();
    //     })
    //     .on('mouseup', function(d) {
    //       if(!mousedown_node) return;

    //       // needed by FF
    //       drag_line
    //         .classed('hidden', true)
    //         .style('marker-end', '');

    //       // check for drag-to-self
    //       mouseup_node = d;
    //       if (mouseup_node === mousedown_node) return resetMouseVars();

    //       // unenlarge target node
    //       d3.select(this).attr('transform', '');

    //       var source = mouseup_node;
    //       var target = mousedown_node;

    //       var link = $scope.links.filter(function (l) {
    //         return ((l.source === source && l.target === target) || (l.source === target && l.target === source));
    //       })[0];

    //       if (!link) {
    //         link = { source: source, target: target };
    //         $scope.links.push(link);
    //       }

    //       // select new link
    //       selected_link = link;
    //       selected_node = null;
    //       restart();
    //     });

    //   // show node IDs
    //   g.append('svg:text')
    //       .attr('x', 0)
    //       .attr('y', 4)
    //       .attr('class', 'id')
    //       .text(function (d) { return d.name || d.id; });

    //   // remove old $scope.nodes
    //   circle.exit().remove();

    //   // set the graph in motion
    //   force.start();
    // }

    // function mousedown() {
    //   // prevent I-bar on drag
    //   //d3.event.preventDefault();

    //   // because :active only works in WebKit?
    //   svg.classed('active', true);

    //   if(d3.event.ctrlKey || d3.event.metaKey || mousedown_node || mousedown_link) return;

    //   // insert new node at point
    //   var point = d3.mouse(this);
    //   var node = {
    //     id: ++lastNodeId,
    //     x: point[0],
    //     y: point[1]
    //   };
    //   $scope.nodes.push(node);

    //   restart();
    // }

    // function mousemove() {
    //   if (!mousedown_node) return;

    //   // update drag line
    //   drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

    //   restart();
    // }

    // function mouseup() {
    //   if (mousedown_node) {
    //     // hide drag line
    //     drag_line
    //       .classed('hidden', true)
    //       .style('marker-end', '');
    //   }

    //   // because :active only works in WebKit?
    //   svg.classed('active', false);

    //   // clear mouse event vars
    //   resetMouseVars();
    // }

    // function spliceLinksForNode(node) {
    //   var toSplice = $scope.links.filter(function(l) {
    //     return (l.source === node || l.target === node);
    //   });
    //   toSplice.map(function(l) {
    //     $scope.links.splice($scope.links.indexOf(l), 1);
    //   });
    // }

    // // only respond once per keydown
    // var lastKeyDown = -1;

    // function keydown() {
    //   if(lastKeyDown !== -1) return;
    //   lastKeyDown = d3.event.keyCode;

    //   // ctrl
    //   if (d3.event.ctrlKey || d3.event.metaKey) {
    //     circle.call(force.drag);
    //     svg.classed('ctrl', true);
    //   }

    //   if (!selected_node && !selected_link) return;
    //   switch (d3.event.keyCode) {
    //     case 8: // backspace
    //     case 46: // delete
    //       d3.event.preventDefault();
    //       if (selected_node) {
    //         $scope.nodes.splice($scope.nodes.indexOf(selected_node), 1);
    //         spliceLinksForNode(selected_node);
    //       } else if(selected_link) {
    //         $scope.links.splice($scope.links.indexOf(selected_link), 1);
    //       }
    //       selected_link = null;
    //       selected_node = null;
    //       restart();
    //       break;
    //   }
    // }

    // function keyup() {
    //   lastKeyDown = -1;

    //   // ctrl or meta
    //   if(d3.event.keyCode === 17 || d3.event.keyCode === 91) {
    //     circle
    //       .on('mousedown.drag', null)
    //       .on('touchstart.drag', null);
    //     svg.classed('ctrl', false);
    //   }
    // }

    // // app starts here
    // svg.on('mousedown', mousedown)
    //   .on('mousemove', mousemove)
    //   .on('mouseup', mouseup);
    // d3.select(window)
    //   .on('keydown', keydown)
    //   .on('keyup', keyup);
    // restart();
  }
);
