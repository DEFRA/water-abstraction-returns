const coreRoutes = require('./modules/core/routes')
const returnsRoutes = require('./modules/returns/routes')
const acceptanceTestRoutes = require('./modules/acceptance-tests/routes')
const returnCycleRoutes = require('./modules/return-cycles/routes')

module.exports = [
  ...coreRoutes,
  ...returnsRoutes,
  ...acceptanceTestRoutes,
  ...Object.values(returnCycleRoutes)
]
