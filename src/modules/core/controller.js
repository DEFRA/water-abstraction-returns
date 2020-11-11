const Boom = require('@hapi/boom');
const statusConnector = require('../../lib/connectors/status');

const getStatus = async () => {
  try {
    if (statusConnector) {
      const status = await statusConnector.getStatus();
      return status;
    } else {
      return null;
    }
  } catch (e) {
    throw Boom.badImplementation(e);
  }
};

exports.getStatus = getStatus;
