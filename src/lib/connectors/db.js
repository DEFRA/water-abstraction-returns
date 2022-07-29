
require('dotenv').config()
const pg = require('pg')
const moment = require('moment')
const helpers = require('@envage/water-abstraction-helpers')

const config = require('../../../config.js')
const { logger } = require('../../logger')

// Set dates to format YYYY-MM-DD rather than full date/time string with timezone
pg.types.setTypeParser(1082, 'text', function (val) {
  return moment(val).format('YYYY-MM-DD')
})

exports.pool = helpers.db.createPool(config.pg, logger)
