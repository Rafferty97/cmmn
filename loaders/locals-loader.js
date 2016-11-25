"use strict";

module.exports = function (source) {
  return source + "\n\n// Only locals\nmodule.exports = module.exports.locals;";
};