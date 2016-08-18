const http = require('http');

const BASE_PATH = '/data/';
const ERROR_MESSAGE = 'Error loading test data: ';

exports.command = function(path, callback) {
    var self = this;

    this.globals.remoteTestData = this.globals.remoteTestData || {};

    const options = this.globals.remoteAssertions;
    const data = this.globals.remoteTestData;

    if (data[path]) {
        return callback.call(this, data[path]);
    }
    else {
        const chunks = [];
        
        const httpOptions = {
            host: options.host,
            port: options.port,
            path: BASE_PATH + '/' + path,
            method: 'GET'
        };
        
        const request = http.request(httpOptions, (response) => {
            if (response.statusCode == 200) {                
                response.setEncoding('utf8');
                
                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                
                response.on('end', () => {
                    const body = chunks.join('');
                    data[path] = JSON.parse(body);
                    callback.call(self, data[path]);
                });
            }
            else {
                throw Error(ERROR_MESSAGE + ": '" + path + "': " + response.statusMessage);
            }
        });
        
        request.on('error', (e) => {
            if (e.code != 'ECONNRESET') {
                console.log(ERROR_MESSAGE + e.message);
            }
        });
        
        request.end();
    }

    return this;
};
