import utils from 'loader-utils';

module.exports = function(source) {
  const query = utils.parseQuery(this.query);
  return `${source}\n\nmodule.exports = ${query['var']};`;
}
