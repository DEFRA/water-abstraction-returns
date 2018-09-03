
const { getLines } = require('./lib/nald-queries');
const { parseReturnId } = require('./lib/transform-returns-helpers');
const { repo: returnsRepository } = require('../../../modules/returns/returns');

const { mapLines } = require('./lib/transform-lines-helpers');

/**
 * Find lines using the supplied filter
 * @param {Object} filter
 * @return {Promise} resolves with synthetic line data
 */
const find = async (filter) => {
  const { version_id: versionId } = filter;

  // Find return
  const { rows: [ returnRow ] } = await returnsRepository.find({return_id: versionId});

  // Extract info from URL
  const { regionCode, formatId, startDate, endDate } = parseReturnId(versionId);

  const { rows: lines } = await getLines(formatId, regionCode, startDate, endDate);

  return { rows: mapLines(returnRow, lines) };
};

module.exports = {
  find
};
