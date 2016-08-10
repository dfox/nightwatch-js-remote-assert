exports.assertion = function(grouping, name, msg) {
    
    const http = require('http'); 
    const util = require('util');

    const options = this.client.options.remoteAssertions;
    
    const MSG_PREFIX = 'Testing remote assertion: %s: %s'
    
    const MSG_ASSERTION_FAILED = (msg || util.format(MSG_PREFIX, grouping, name))
          + ': The following remote test(s) failed:\n';
    
    this.message = msg || util.format(MSG_PREFIX, grouping, name);
    
    this.expected = function() {
        return true;
    };
    
    this.pass = function(result) {
        return result;
    };
    
    this.failure = function(result) {

        const formatGroup = (result) => {
            return util.format("     Group: %s\n", result.grouping);
        };

        const formatName = (result) => {
            return util.format("     Name: %s\n", result.name);
        };

        const formatError = (result) => {
            const value = (result.error.value) ? ": " + result.error.value : "";
            return util.format("     Error: %s %s\n", result.error.name, value);
        };

        const formatTrace = (result) => {
            return "     Trace: \n       " + result.trace.join("\n       ");
        };

        if (!result.successful) {
            this.message = result.results.reduce((acc, result) => {
                if (result.successful){
                    return acc;
                }
                else {
                    return acc +
                        formatGroup(result) +
                        formatName(result) +
                        formatError(result) + 
                        formatTrace(result);
                }
            }, MSG_ASSERTION_FAILED);
        }
        return !result.successful;
    };

    this.value = function(result) {
        return result.successful;
    };
    
    this.command = function(callback) {
        var result = "";
        
        const httpOptions = {
            host: options.host,
            port: options.port,
            path: options.basePath + "/" + grouping + "/" + name,
            method: 'POST'
        };

        const req = http.request(httpOptions, (res) => {            
            res.setEncoding('utf8');
            
            res.on('data', (chunk) => {
                result += chunk;
            });

            res.on('end', () => {
                callback(JSON.parse(result));
            });
        });

        req.on('error', (e) => {
            console.log("Problem with request: " + e.message);
        });

        req.end();

        return this;
    };
};
