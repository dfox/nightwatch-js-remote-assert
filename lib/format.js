const util = require('util');

const formatGroup = function formatGroup (result) {

  return util.format('Group: %s\n', result.grouping);

};

const formatName = function formatName (result) {

  return util.format('Name: %s\n', result.name);

};

const formatError = function formatError (result) {

  const message = (result.error.message) ? ': ' + result.error.message : '';

  return util.format('Error: %s %s\n', result.error.name, message);

};

const formatTrace = function formatTrace (indent, result) {

  return ['Trace: \n', indent, result.trace.join('\n' + indent)].join('');

};

const formatResults = function formatResults (prefix, results) {

  return results.reduce((acc, result) => {

    if (result.successful) {

      return acc;

    } else {

      const indent = '    ';

      return acc +
        indent + formatGroup(result) +
        indent + formatName(result) +
        indent + formatError(result) +
        indent + formatTrace(indent + indent, result);

    }

  }, prefix);

};

module.exports = {
  'error': formatError,
  'group': formatGroup,
  'name': formatName,
  'results': formatResults,
  'trace': formatTrace
};
