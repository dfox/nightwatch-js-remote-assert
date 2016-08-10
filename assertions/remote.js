const http = require('http'); 
const util = require('util');

exports.assertion = function(grouping, name, message) {

    const BASE_PATH = "/tests/";
    const DEFAULT_MESSAGE_PREFIX = 'Testing remote assertion: %s: %s';
    const ASSERTION_FAILED_MESSAGE = 'The following remote test(s) failed:\n';

    const options = this.client.options.remoteAssertions;

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

        const formatAssertionFailed = () => {
            return formatMessagePrefix() + ": " + ASSERTION_FAILED_MESSAGE
        }

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
            }, formatAssertionFailed());
        }
        return !result.successful;
    };

    this.value = function(result) {
        return result.successful;
    };
    
    this.command = function(callback) {
        let result = '';
        
        const httpOptions = {
            host: options.host,
            port: options.port,
            path: BASE_PATH + '/' + grouping + '/' + name,
            method: 'POST'
        };

        const request = http.request(httpOptions, (response) => {            
            response.setEncoding('utf8');
            
            response.on('data', (chunk) => {
                result += chunk;
            });

            response.on('end', () => {
                callback(JSON.parse(result));
            });
        });

        request.on('error', (e) => {
            console.log('Problem with request: ' + e.message);
        });

        request.end();

        return this;
    };
};
