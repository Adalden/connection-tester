angular.module('app').factory('nodeSaver', function ($http){

  function saveConfig (newConfig, cb) {
    $http.post('/config/save', newConfig)
      .success(function(res) {
        cb(true);
      })
      .error(function(res) {
        cb(false);
      });
  };

  function retrieveConfigs (cb) {
    $http.get('/config/get')
      .success(function(res){
        cb(res);
      })
      .error(function(err) {
        cb(false);
      });
  };

  return{
    saveConfig:      saveConfig,
    retrieveConfigs: retrieveConfigs
  }
});
