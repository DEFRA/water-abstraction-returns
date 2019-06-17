const { logger } = require('../../logger');
const { repo } = require('../../modules/returns/returns');

/**
 * For a given licence number with a list of valid return ids, makes any other
 * returns ids for the licence id have a status of void.
 * @param {Object} request The HAPI request containng a valdated payload
 */
const patchVoidReturns = async request => {
  const { regime, licenceType, licenceNumber, validReturnIds } = request.payload;
  const filter = {
    regime,
    licence_type: licenceType,
    licence_ref: licenceNumber,
    return_id: {
      $nin: validReturnIds
    }
  };

  try {
    const result = await repo.update(filter, { status: 'void' });
    logger.info(`Void returns result for ${licenceNumber}`, result);
    return result;
  } catch (err) {
    logger.error('Failed to void returns', err);
    return err;
  }
};

exports.patchVoidReturns = patchVoidReturns;
