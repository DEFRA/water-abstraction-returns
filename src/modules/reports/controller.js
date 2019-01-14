const queries = require('./queries.js');

/**
 * Gets a list of completed returns, together with the user details
 * of who initially completed it
 * @param  {Object}  request - HAPI request instance
 * @param  {Object}  h       - HAPI reply helpers
 * @return {Promise}         - Resolves with report data in JSON format
 */
const getCompletedReturnsReport = async (request, h) => {
  const { regime, licenceType } = request.params;

  const { rows: data, error = null } = await queries.getCompletedReturns(regime, licenceType);

  return { data, error };
};

module.exports = {
  getCompletedReturnsReport
};
