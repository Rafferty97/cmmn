'use strict';

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (source) {
  var query = _loaderUtils2.default.parseQuery(this.query);
  return source + '\n\nmodule.exports = ' + query['var'] + ';';
};