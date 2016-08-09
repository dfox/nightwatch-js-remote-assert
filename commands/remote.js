exports.assertion = function(grouping, name, msg) {

  const http = require('http'); 

  const MSG_PREFIX = 'Testing remote assertion %s: %s'
    
  const MSG_ASSERTION_FAILED = MSG_PREFIX + ': Assertion failed with error: %s: %s: %s';

  this.message = msg || util.format(MSG_PREFIX, grouping, name);

  this.jsonResult = {};

  this.pass = function(value) {
      return true;
  };

  this.failure = function(result) {
      return false;
  };

  this.value = function(result) {
      console.log(result)
      return true;
  };

  this.command = function(callback) {
    http.get({
        hostname: 'localhost',
        port: 8080,
        path: grouping + '/' + name,
        agent: false
    }, callback);
    return this;
  };
};
