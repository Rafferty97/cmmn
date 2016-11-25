var build = require('./build');

module.exports = {
  build: build.bind(null, false),
  buildWatch: build.bind(null, true)
};
