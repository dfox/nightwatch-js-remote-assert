const http = require('http');

const BASE_PATH = '/data/';
const ERROR_MESSAGE = 'Error loading test data: ';

exports.command = function command (path, callback) {

  const that = this;

  this.globals.remoteTest.data = this.globals.remoteTest.data || {};

  const options = this.globals.remoteTest;
  const data = this.globals.remoteTest.data;

  if (data[path]) {

    return callback.call(this, data[path]);

  } else {

    const chunks = [];
    const HTTP_SUCCESS = 200;

    const httpOptions = {

      'host': options.server.host,
      'method': 'GET',
      'path': [BASE_PATH, '/', path].join(''),
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

          data[path] = JSON.parse(body);
          callback.call(that, data[path]);

        });

      } else {

        throw Error([ERROR_MESSAGE, ': ', path, ': ', response.statusMessage].join(''));

      }

    });

    request.on('error', (error) => {

      if (error.code !== 'ECONNRESET') {

        console.log(ERROR_MESSAGE + error.message);

      }

    });

    request.end();

  }

  return this;

};
