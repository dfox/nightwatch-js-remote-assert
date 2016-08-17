const http = require('http');

module.exports = {

    'data': {},
    
    'load': function(path, callback) {

        const self = this;

        if (this.data[path]) {
            return callback(this.data[path]);
        }
        else {
            const chunks = [];
            
            const options = {
                host: 'localhost',
                port: 8081,
                path: '/data/' + path,
                method: 'GET'
            };
            
            const request = http.request(options, (response) => {
                if (response.statusCode == 200) {                
                    response.setEncoding('utf8');
                    
                    response.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
                    
                    response.on('end', () => {
                        const body = chunks.join("");
                        self.data[path] = JSON.parse(body);
                        callback(self.data[path]);
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
