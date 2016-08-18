const util = require('util');

function formatGroup(result){
  return util.format('Group: %s\n', result.grouping);
}
  
function formatName(result){
  return util.format('Name: %s\n', result.name);
}

function formatError(result){
    const message = (result.error.message) ? ': ' + result.error.message : '';
    return util.format('Error: %s %s\n', result.error.name, message);
}
  
function formatTrace(indent, result){
  return 'Trace: \n' + indent + result.trace.join('\n' + indent);
}
  
function formatResults(prefix, results){
  return results.reduce((acc, result) => {
    if (result.successful){
      return acc;
    }
    else {
      const indent = '    ';
      
      return acc +
        indent + formatGroup(result) +
        indent + formatName(result) +
        indent + formatError(result) + 
        indent + formatTrace(indent + indent, result);
    }
  }, prefix);
}

module.exports = {
  group: formatGroup,
  name: formatName,
  error: formatError,
  trace: formatTrace,
  results: formatResults
}
