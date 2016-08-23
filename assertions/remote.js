const http = require('http');
const util = require('util');
const format = require('../lib/format');

const BASE_PATH = '/tests/';
const DEFAULT_MESSAGE_PREFIX = 'Testing remote assertion: %s: %s';
const TEST_FAILED_MESSAGE = 'The following remote test(s) failed:\n';
const ERROR_MESSAGE = 'Error running remote assertion: ';

exports.assertion = function assertion (grouping, name, message) {

  const options = this.globals.remoteTest;

  const formatMessagePrefix = () => message || util.format(DEFAULT_MESSAGE_PREFIX, grouping, name);

  this.message = formatMessagePrefix();

  this.expected = function expected () {

    return true;

  };

  this.pass = function pass (value) {

    return value;

  };

  this.failure = function failure (result) {

    if (!result.successful) {

      const prefix = [formatMessagePrefix(), ': ', TEST_FAILED_MESSAGE].join('');

      this.message = format.results(prefix, result.results);

    }

    return !result.successful;

  };

  this.value = function value (result) {

    return result.successful;

  };

  this.command = function command (callback) {

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

          callback(json);

        });

      } else {

        throw Error(ERROR_MESSAGE + response.statusMessage);

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

};
