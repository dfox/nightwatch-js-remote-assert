const http = require('http');

const BASE_PATH = "/fixtures/";
const ERROR_MESSAGE = 'Error executing fixture: ';
const FIXTURE_FAILED_MESSAGE = 'The following remote fixture(s) failed:\n';

exports.command = function(grouping, name, callback) {
    var self = this;

    const options = this.globals.remoteAssertions;

    const chunks = [];
    
    const httpOptions = {
        host: options.host,
        port: options.port,
        path: BASE_PATH + '/' + grouping + '/' + name,
        method: 'POST'
    };

    const formatGroup = (result) => {
        return util.format("     Group: %s\n", result.grouping);
    };
    
    const formatName = (result) => {
        return util.format("     Name: %s\n", result.name);
    };
    
    const formatError = (result) => {
        const message = (result.error.message) ? ": " + result.error.message : "";
        return util.format("     Error: %s %s\n", result.error.name, message);
    };
    
    const formatTrace = (result) => {
        return "     Trace: \n       " + result.trace.join("\n       ");
    };
    
    const formatTestFailed = () => {
        return formatMessagePrefix() + ": " + FIXTURE_FAILED_MESSAGE
    }

    const formatErrorResults = (results) => {
        results.reduce((acc, result) => {
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
        }, formatTestFailed());
    }
    
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
                    throw Error(formatErrorResults(json.results))
                }
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

    return this;
};
