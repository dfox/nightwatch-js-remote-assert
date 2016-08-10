const http = require('http');

module.exports = {

    'fixtures': {},
    
    'load': function(path, callback) {

        const self = this;

        if (this.fixtures[path]) {
            return callback(this.fixtures[path]);
        }
        else {
            const chunks = [];
            
            const options = {
                host: 'localhost',
                port: 8081,
                path: '/fixtures/' + path,
                method: 'GET'
            };
            
            const request = http.request(options, function(response) {
                if (response.statusCode == 200) {                
                    response.setEncoding('utf8');
                    
                    response.on('data', function (chunk) {
                        chunks.push(chunk);
                    });
                    
                    response.on('end', () => {
                        const body = chunks.join("");
                        self.fixtures[path] = JSON.parse(body);
                        callback(self.fixtures[path]);
                    });
                }
                else {
                    throw Error("Error loading fixture: '"
                                + path + "': " + response.statusMessage);
                }
            });
            
            request.on('error', (e) => {
                if (e.code != 'ECONNRESET') {
                    console.log('Problem loading fixture: ' + e.message);
                }
            });
            
            request.end();
        }
    }
};
