const coreRoutes = require('./modules/core/routes')
const returnsRoutes = require('./modules/returns/routes')
const acceptanceTestRoutes = require('./modules/acceptance-tests/routes')
const returnCycleRoutes = require('./modules/return-cycles/routes')
const healthRoutes = require('./modules/health/routes')

module.exports = [
  ...coreRoutes,
  ...returnsRoutes,
  ...acceptanceTestRoutes,
  ...Object.values(returnCycleRoutes),
  ...Object.values(healthRoutes)
]
