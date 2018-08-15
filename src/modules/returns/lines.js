const Boom = require('boom');
const naldFacade = require('../../lib/connectors/nald-facade');

const getLines = async (request, h) => {
  let filter;

  try {
    filter = JSON.parse(request.query.filter);
  } catch (err) {
    throw Boom.badRequest('Invalid filter JSON', err);
  }

  const { rows: data } = await naldFacade.lines.find(filter);

  return {
    data,
    error: null
  };
};

module.exports = {
  getLines
};
