const http = require('http');

module.exports = {

    'fixtures': {},
    
    'load': function(path, callback) {

        const self = this;

        if (this.fixtures[path]) {
            return callback(this.fixtures[path]);
        }
        else {
            var result = '';
            
            const options = {
                host: 'localhost',
                port: 8081,
                path: '/fixtures/' + path,
                method: 'GET'
            };
            
            const req = http.request(options, function(res) {
                if (res.statusCode == 200) {                
                    res.setEncoding('utf8');
                    
                    res.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    res.on('end', () => {
                        self.fixtures[path] = JSON.parse(result)
                        callback(self.fixtures[path]);
                    });
                }
                else {
                    throw Error("Error loading fixture: '"
                                + path + "': " + res.statusMessage);
                }
            });
            
            req.on('error', (e) => {
                console.log('Problem with fixture: ' + e.message);
            });
            
            req.end();
        }
    }
};
