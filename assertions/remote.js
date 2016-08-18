const http = require('http'); 
const util = require('util');
const format = require('../lib/format');

const BASE_PATH = "/tests/";
const DEFAULT_MESSAGE_PREFIX = 'Testing remote assertion: %s: %s';
const TEST_FAILED_MESSAGE = 'The following remote test(s) failed:\n';
const ERROR_MESSAGE = 'Error running remote assertion: ';

exports.assertion = function(grouping, name, message) {
    
  const options = this.globals.remoteTest;
  
  const formatMessagePrefix = () => {
    return message || util.format(DEFAULT_MESSAGE_PREFIX, grouping, name);
  }
  
  this.message = formatMessagePrefix()
  
  this.expected = function() {
    return true;
  };
  
  this.pass = function(value) {
    return value;
  };
  
  this.failure = function(result) {    
    if (!result.successful) {
      const prefix = formatMessagePrefix() + ': ' + TEST_FAILED_MESSAGE;
      this.message = format.results(prefix, result.results);
    }
    return !result.successful;
  };
  
  this.value = function(result) {    
    return result.successful;
  };
  
  this.command = function(callback) {
    
    const chunks = [];
    
    const httpOptions = {
      host: options.server.host,
      port: options.server.port,
      path: BASE_PATH + '/' + grouping + '/' + name,
      method: 'POST'
    };
    
    const request = http.request(httpOptions, (response) => {
      if (response.statusCode == 200) {
        response.setEncoding('utf8');
        
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          const body = chunks.join("");
          const json = JSON.parse(body);
          callback(json);
        });
      }
      else {
        throw Error(ERROR_MESSAGE + response.statusMessage);
      }
    });
    
    request.on('error', (e) => {
      if (e.code != 'ECONNRESET') {
        throw Error(ERROR_MESSAGE + e.message);
      }
    });
    
    request.end();
    
    return this;
  };
};
