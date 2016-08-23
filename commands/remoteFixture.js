const http = require('http');
const format = require('../lib/format');

const BASE_PATH = '/fixtures/';
const ERROR_MESSAGE = 'Error executing fixture: ';
const FIXTURE_FAILED_MESSAGE = 'The following remote fixture(s) failed:\n';

exports.command = function command (grouping, name, callback) {

  const options = this.globals.remoteTest;

  const chunks = [];
  const HTTP_SUCCESS = 200;

  const httpOptions = {
    'host': options.server.host,
    'method': 'POST',
    'path': [BASE_PATH, '/', grouping, '/', name].join(''),
    'port': options.server.port
  };

  const request = http.request(httpOptions, (response) => {

    if (response.statusCode === HTTP_SUCCESS) {

      response.setEncoding('utf8');

      response.on('data', (chunk) => {

        chunks.push(chunk);

      });

      response.on('end', () => {

        const body = chunks.join('');
        const json = JSON.parse(body);

        if (json.successful) {

          callback();

        } else {

          console.log(format.results(FIXTURE_FAILED_MESSAGE, json.results));
          throw Error([ERROR_MESSAGE, ': ', grouping, ': ', name].join(''));

        }

      });

    } else {

      throw Error([ERROR_MESSAGE, ': ', grouping, ': ', name, ': ',
      response.statusMessage].join(''));

    }

  });

  request.on('error', (error) => {

    if (error.code !== 'ECONNRESET') {

      throw Error(ERROR_MESSAGE + error.message);

    }

  });

  request.end();

  return this;

};
