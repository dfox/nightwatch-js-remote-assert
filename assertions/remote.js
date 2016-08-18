const http = require('http'); 
const util = require('util');

const BASE_PATH = "/tests/";
const DEFAULT_MESSAGE_PREFIX = 'Testing remote assertion: %s: %s';
const TEST_FAILED_MESSAGE = 'The following remote test(s) failed:\n';

function formatGroup(result){
  return util.format("Group: %s\n", result.grouping);
};

function formatName(result){
  return util.format("Name: %s\n", result.name);
};

function formatError(result){
  const message = (result.error.message) ? ": " + result.error.message : "";
  return util.format("Error: %s %s\n", result.error.name, message);
};

function formatTrace(indent, result){
  return "Trace: \n" + indent + result.trace.join("\n" + indent);
};

function formatErrorResults(prefix, results){
  return results.reduce((acc, result) => {
    if (result.successful){
      return acc;
    }
    else {
      const indent = "    ";

      return acc +
        indent + formatGroup(result) +
        indent + formatName(result) +
        indent + formatError(result) + 
        indent + formatTrace(indent + indent, result);
    }
  }, prefix);
}

exports.assertion = function(grouping, name, message) {
    
  const options = this.globals.remoteAssertions;
  
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
      const prefix = formatMessagePrefix() + ": " + TEST_FAILED_MESSAGE;
      this.message = formatErrorResults(prefix, result.results);
    }
    return !result.successful;
  };
  
  this.value = function(result) {    
    return result.successful;
  };
  
  this.command = function(callback) {
    
    const chunks = [];
    
    const httpOptions = {
      host: options.host,
      port: options.port,
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
        throw Error("Error running remote assertion: '"
                    + response.statusMessage);
      }
    });
    
    request.on('error', (e) => {
      if (e.code != 'ECONNRESET') {
        console.log('Problem running remote assertion: ' + e.message);
      }
    });
    
    request.end();
    
    return this;
  };
};
