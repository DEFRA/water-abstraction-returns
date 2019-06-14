const { logger } = require('../../logger');
const { repo } = require('../../modules/returns/returns');

/**
 * For a given licence number with a list of valid return ids, makes any other
 * returns ids for the licence id have a status of void.
 * @param {Object} request The HAPI request containng a valdated payload
 */
const postVoidReturns = async request => {
  const { regime, licenceType, licenceId, validReturnIds } = request.payload;
  const filter = {
    regime,
    licence_type: licenceType,
    licence_ref: licenceId,
    source: 'NALD',
    return_id: {
      $nin: validReturnIds
    }
  };

  try {
    const result = await repo.update(filter, { status: 'void' });
    logger.info(`Void returns result for ${licenceId}`, result);
    return result;
  } catch (err) {
    logger.error('Failed to void returns', err);
    return err;
  }
};

exports.postVoidReturns = postVoidReturns;
