/* global angular, d3, _, $ */
angular.module('app').directive('networkConfig',
  function ($rootScope) {
  'use strict';

  function link(scope, el) {
    var width  = 960;
    var height = 500;
    var colors = d3.scale.category10();

    var select = scope.select || angular.noop;
    var deselect = scope.deselect || angular.noop;

    scope.$watch('nodes', createItAll);

    function createItAll() {
      $(el[0]).empty();
      var svg = d3.select(el[0])
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // set up initial nodes and links
      //  - nodes are known by 'id', not by index in array.
      //  - reflexive edges are indicated on the node (as a bold black circle).
      //  - links are always source < target; edge directions are set by 'left' and 'right'.
      var nodes = scope.nodes;

      var lastNodeId = -1;
      _.each(nodes, function (node) {
        if (node.id > lastNodeId) lastNodeId = node.id;
      });

      var links = scope.conns;

      // init D3 force layout
      var force = d3.layout.force()
          .nodes(nodes)
          .links(links)
          .size([width, height])
          .linkDistance(150)
          .charge(-500)
          .on('tick', tick);

      // define arrow markers for graph links
      svg.append('svg:defs').append('svg:marker')
          .attr('id', 'end-arrow')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 6)
          .attr('markerWidth', 3)
          .attr('markerHeight', 3)
          .attr('orient', 'auto')
        .append('svg:path')
          .attr('d', 'M0,-5L10,0L0,5')
          .attr('fill', '#000');

      // svg.append('svg:defs').append('svg:marker')
      //     .attr('id', 'start-arrow')
      //     .attr('viewBox', '0 -5 10 10')
      //     .attr('refX', 4)
      //     .attr('markerWidth', 3)
      //     .attr('markerHeight', 3)
      //     .attr('orient', 'auto')
      //   .append('svg:path')
      //     .attr('d', 'M10,-5L0,0L10,5')
      //     .attr('fill', '#000');

      // line displayed when dragging new nodes
      var drag_line = svg.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');

      // handles to link and node element groups
      var path = svg.append('svg:g').selectAll('path'),
          circle = svg.append('svg:g').selectAll('g');

      // mouse event vars
      var selected_node = null,
          selected_link = null,
          mousedown_link = null,
          mousedown_node = null,
          mouseup_node = null;

      function resetMouseVars() {
        mousedown_node = null;
        mouseup_node = null;
        mousedown_link = null;
      }

      // update force layout (called automatically each iteration)
      function tick() {
        // draw directed edges with proper padding from node centers
        path.attr('d', function(d) {
          var deltaX = d.target.x - d.source.x,
              deltaY = d.target.y - d.source.y,
              dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
              normX = deltaX / dist,
              normY = deltaY / dist,
              sourcePadding = d.left ? 17 : 12,
              targetPadding = d.right ? 17 : 12,
              sourceX = d.source.x + (sourcePadding * normX),
              sourceY = d.source.y + (sourcePadding * normY),
              targetX = d.target.x - (targetPadding * normX),
              targetY = d.target.y - (targetPadding * normY);
          return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
        });

        circle.attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        });
      }

      // update graph (called when needed)
      function restart() {
        if (selected_node) {
          select('node', selected_node);
        } else if (selected_link) {
          select('conn', selected_link);
        } else {
          deselect();
        }
        $rootScope.$$phase || $rootScope.$apply();

        path = path.data(links);

        // update existing links
        path.classed('selected', function (d) { return d === selected_link; })
          .style('marker-start', '')
          .style('marker-end', 'url(#end-arrow)');


        // add new links
        path.enter().append('svg:path')
          .attr('class', 'link')
          .classed('selected', function(d) { return d === selected_link; })
          .style('marker-start', '')
          .style('marker-end', 'url(#end-arrow)')
          .on('mousedown', function (d) {
            if (!scope.editable) return;
            if (d3.event.ctrlKey || d3.event.metaKey) return;

            if (d3.event.which === 3) {
              return deleteItem('link', d);
            }

            // select link
            mousedown_link = d;
            if (mousedown_link === selected_link) selected_link = null;
            else selected_link = mousedown_link;
            selected_node = null;
            restart();
          });

        // remove old links
        path.exit().remove();


        // circle (node) group
        // NB: the function arg is crucial here! nodes are known by id, not by index!
        circle = circle.data(nodes, function (d) { return d.id; });

        // update existing nodes (reflexive & selected visual states)
        circle.selectAll('circle')
          .style('fill', function (d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); });

        // add new nodes
        var g = circle.enter().append('svg:g');

        g.append('svg:circle')
          .attr('class', 'node')
          .attr('r', 12)
          .style('fill', function (d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
          .style('stroke', function (d) { return d3.rgb(colors(d.id)).darker().toString(); })
          .on('mouseover', function (d) {
            if (!scope.editable) return;
            if (!mousedown_node || d === mousedown_node) return;
            d3.select(this).attr('transform', 'scale(1.1)');
          })
          .on('mouseout', function (d) {
            if (!scope.editable) return;
            if (!mousedown_node || d === mousedown_node) return;
            d3.select(this).attr('transform', '');
          })
          .on('mousedown', function (d) {
            if (!scope.editable) return;
            if(d3.event.ctrlKey || d3.event.metaKey) return;

            if (d3.event.which === 3) {
              deleteItem('node', d);
              return restart();
            }

            // select node
            mousedown_node = d;
            if (mousedown_node === selected_node) selected_node = null;
            else selected_node = mousedown_node;
            selected_link = null;

            // reposition drag line
            drag_line
              .style('marker-end', 'url(#end-arrow)')
              .classed('hidden', false)
              .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

            restart();
          })
          .on('mouseup', function (d) {
            if (!scope.editable) return;
            if (!mousedown_node) return;

            // needed by FF
            drag_line
              .classed('hidden', true)
              .style('marker-end', '');

            // check for drag-to-self
            mouseup_node = d;
            if (mouseup_node === mousedown_node) return resetMouseVars();

            // unenlarge target node
            d3.select(this).attr('transform', '');

            // add link to graph (update if exists)
            // NB: links are strictly source < target; arrows separately specified by booleans
            var source, target, direction;
            source = mousedown_node;
            target = mouseup_node;
            direction = 'right';

            var link = links.filter(function (l) {
              return (l.source === source && l.target === target) || (l.source === target && l.target === source);
            })[0];

            if (!link) {
              link = { source: source, target: target };
              links.push(link);
              scope.unsavedChanges = true;
            }

            // select new link
            selected_link = link;
            selected_node = null;
            restart();
          });

        // show node IDs
        g.append('svg:text')
            .attr('x', 0)
            .attr('y', 4)
            .attr('class', 'id')
            .text(function (d) { return d.id; });

        // remove old nodes
        circle.exit().remove();

        // set the graph in motion
        force.start();
      }

      function mousedown() {
        svg.classed('active', true);

        if (d3.event.ctrlKey || d3.event.metaKey || mousedown_node || mousedown_link) return;
        if (d3.event.which === 3) return;

        // insert new node at point
        var point = d3.mouse(this),
            node = { id: ++lastNodeId };
        node.x = point[0];
        node.y = point[1];
        nodes.push(node);
        scope.unsavedChanges = true;
        restart();
      }

      function mousemove() {
        if (!mousedown_node) return;

        // update drag line
        var point = d3.mouse(this);
        drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + point[0] + ',' + point[1]);

        restart();
      }

      function mouseup() {
        if (mousedown_node) {
          // hide drag line
          drag_line
            .classed('hidden', true)
            .style('marker-end', '');
        }

        svg.classed('active', false);

        // clear mouse event vars
        resetMouseVars();
      }

      function deleteItem(type, item) {
        if (type === 'node') {
          nodes.splice(nodes.indexOf(item), 1);
          spliceLinksForNode(item);
        } else {
          links.splice(links.indexOf(item), 1);
        }
        selected_link = null;
        selected_node = null;
        scope.unsavedChanges = true;
        restart();
      }

      function spliceLinksForNode(node) {
        var toSplice = links.filter(function(l) {
          return (l.source === node || l.target === node);
        });
        toSplice.map(function (l) {
          links.splice(links.indexOf(l), 1);
        });
      }

      // app starts here
      if (scope.editable) {
        svg.on('mousedown', mousedown)
          .on('mousemove', mousemove)
          .on('mouseup', mouseup)
          .on('contextmenu', function () {
            d3.event.preventDefault();
          });
      }

      restart();
    }
  }
  return {
    scope: {
      nodes: '=',
      conns: '=',
      editable: '=',
      unsavedChanges: '=',

      select: '=',
      deselect: '='
    },
    restrict: 'EA',
    link:     link
  };
});
