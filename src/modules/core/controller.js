const Boom = require('@hapi/boom');
const statusConnector = require('../../lib/connectors/status');

const getStatus = async () => {
  try {
    const status = await statusConnector.getStatus();
    return status;
  } catch (e) {
    throw Boom.badImplementation(e);
  }
};

exports.getStatus = getStatus;
