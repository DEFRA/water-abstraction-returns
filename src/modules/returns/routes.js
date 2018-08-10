const returnsApi = require('./returns');
const versionsController = require('./versions');
const linesController = require('./lines');

module.exports = [
  ...returnsApi.getRoutes(),

  {
    method: 'GET',
    path: '/returns/1.0/versions',
    handler: versionsController.getVersions,
    config: {
      description: 'Get versions data'
    }
  },

  {
    method: 'GET',
    path: '/returns/1.0/lines',
    handler: linesController.getLines,
    config: {
      description: 'Get lines data from NALD'
    }
  }

];
