// provides all API services consumed by VML and VML Admin front ends
require('dotenv').config()

// -------------- Require vendor code -----------------
const Hapi = require('@hapi/hapi')
const HapiAuthJwt2 = require('hapi-auth-jwt2')

// -------------- Require project code -----------------
const config = require('./config')
const routes = require('./src/routes.js')
const db = require('./src/lib/connectors/db')
const HapiPinoPlugin = require('./src/plugins/hapi-pino.plugin.js')

// Initialise logger
const { logger } = require('./src/logger')

// Define server
const server = Hapi.server(config.server)

const registerServerPlugins = async (server) => {
  await server.register(HapiPinoPlugin())

  // JWT token auth
  await server.register(HapiAuthJwt2)
}

const configureServerAuthStrategy = (server) => {
  server.auth.strategy('jwt', 'jwt', {
    ...config.jwt,
    validate: async (decoded) => ({ isValid: !!decoded.id })
  })
  server.auth.default('jwt')
}

const start = async function () {
  try {
    await registerServerPlugins(server)
    configureServerAuthStrategy(server)
    server.route(routes)

    if (!module.parent) {
      await server.start()
      const name = process.env.SERVICE_NAME
      const uri = server.info.uri
      server.log('info', `Service ${name} running at: ${uri}`)
    }
  } catch (err) {
    logger.error(err.stack)
  }
}

const processError = message => err => {
  logger.error(message, err.stack)
  process.exit(1)
}

process
  .on('unhandledRejection', processError('unhandledRejection'))
  .on('uncaughtException', processError('uncaughtException'))
  .on('SIGINT', async () => {
    logger.info('Stopping returns service')

    await server.stop()
    logger.info('1/2: Hapi server stopped')

    await db.pool.end()
    logger.info('2/2: Connection pool closed')

    return process.exit(0)
  })

start()

module.exports = server
