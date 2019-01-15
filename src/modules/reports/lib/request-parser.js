/**
 * Parses HAPI request and extracts filter data
 * @param  {Object} request - HAPI request
 * @return {Object}         - data extracted from request
 */
const parseRequest = (request) => {
  const filter = JSON.parse(request.query.filter || '{}');
  return {
    filter
  };
};

module.exports = {
  parseRequest
};
