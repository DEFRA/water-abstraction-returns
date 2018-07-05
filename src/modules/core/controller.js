const Boom = require('boom');
const statusConnector = require('../../lib/connectors/status');

const getStatus = async () => {
  try {
    const status = await statusConnector.getAll();
    return status;
  } catch (e) {
    throw Boom.badImplementation(e);
  }
};

module.exports = { getStatus };
