const { isNilReturn } = require('./lib/nald-queries');
const { repo: returnsRepository } = require('../../../modules/returns/returns');
const { parseReturnId } = require('./lib/transform-returns-helpers');

/**
 * Find lines using the supplied filter
 * @param {Object} filter
 * @return {Promise} resolves with synthetic line data
 */
const find = async (filter) => {
  const { return_id: returnId } = filter;

  // Extract info from URL
  const { regionCode, formatId, startDate, endDate } = parseReturnId(returnId);

  // Find return
  const { rows: [ returnRow ] } = await returnsRepository.find({return_id: returnId});

  if (!returnRow) {
    return { rows: [] };
  }

  const nilReturn = await isNilReturn(formatId, regionCode, startDate, endDate);

  const versionRow = {
    version_id: returnId,
    return_id: returnId,
    version_number: 1,
    nil_return: nilReturn
  };

  return { rows: [versionRow] };
};

module.exports = {
  find
};
