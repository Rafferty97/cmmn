'use strict';

module.exports = function (source) {
  var runtime = require.resolve('./bem-loader-runtime');
  return source + '\n\n// Bemify\nmodule.exports = (require(\'' + runtime + '\').default)(module.exports || {});';
};