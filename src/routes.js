const coreRoutes = require('./modules/core/routes');
const returnsRoutes = require('./modules/returns/routes');
const reportsRoutes = require('./modules/reports/routes');
const acceptanceTestRoutes = require('./modules/acceptance-tests/routes');

module.exports = [
  ...coreRoutes,
  ...returnsRoutes,
  ...reportsRoutes,
  ...acceptanceTestRoutes
];
