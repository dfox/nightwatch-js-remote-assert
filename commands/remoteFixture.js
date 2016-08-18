const http = require('http');
const format = require('../lib/format');

const BASE_PATH = "/fixtures/";
const ERROR_MESSAGE = 'Error executing fixture: ';
const FIXTURE_FAILED_MESSAGE = 'The following remote fixture(s) failed:\n';

exports.command = function(grouping, name, callback) {
  var self = this;
  
  const options = this.globals.remoteTest;
  
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
        if (json.successful) {
          callback();
        }
        else {
          console.log(format.results(FIXTURE_FAILED_MESSAGE, json.results))
          throw Error(ERROR_MESSAGE + ": " + grouping + ": " + name)
        }
      });
    }
    else {
      throw Error(ERROR_MESSAGE + ": " + grouping + ": " + name + ": "
                  + response.statusMessage);
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
