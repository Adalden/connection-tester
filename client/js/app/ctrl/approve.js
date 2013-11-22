/* global angular, console*/

angular.module('app').controller('approveCtrl',
  function ($scope, nodeSaver){
    'use strict';

    $scope.configuration = [];
    nodeSaver.retrieveConfigs(function(res) {
      if (!res) {
        console.log('uh oh...something went wrong!');
        return [];
      }
      $scope.configurations = res;
    });


    $scope.approveConfig = function(selected) {
      console.log(selected);

    };
});
