'use strict'

const environment = process.env.ENVIRONMENT
const isProduction = environment === 'prd'

module.exports = {

  blipp: {
    showAuth: true
  },

  jwt: {
    key: process.env.JWT_SECRET,
    verifyOptions: { algorithms: ['HS256'] }
  },

  logger: {
    level: process.env.WRLS_LOG_LEVEL || 'info',
    airbrakeKey: process.env.ERRBIT_KEY,
    airbrakeHost: process.env.ERRBIT_SERVER,
    airbrakeLevel: 'error'
  },

  pg: {
    connectionString: process.env.DATABASE_URL,
    max: process.env.NODE_ENV === 'local' ? 20 : 7,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000
  },

  server: {
    port: 8006,
    router: {
      stripTrailingSlash: true
    }
  },

  isProduction
}
