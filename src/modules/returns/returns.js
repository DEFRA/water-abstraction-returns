'use strict'

const Joi = require('joi')
const HAPIRestAPI = require('@envage/hapi-pg-rest-api')

const { preInsert } = require('./lib/pre-insert')
const { pool } = require('../../lib/connectors/db')

const isoDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/

const returnsApi = new HAPIRestAPI({
  table: 'returns.returns',
  primaryKey: 'return_id',
  endpoint: '/returns/1.0/returns',
  connection: pool,
  onCreateTimestamp: 'created_at',
  onUpdateTimestamp: 'updated_at',
  primaryKeyAuto: false,
  primaryKeyGuid: false,
  validation: {
    return_id: Joi.string(),
    regime: Joi.string(),
    licence_type: Joi.string(),
    licence_ref: Joi.string(),
    start_date: Joi.string().regex(isoDateRegex),
    end_date: Joi.string().regex(isoDateRegex),
    due_date: Joi.string().regex(isoDateRegex),
    returns_frequency: Joi.string().valid('year', 'month', 'quarter', 'week', 'day'),
    status: Joi.string().valid('due', 'received', 'completed', 'void'),
    source: Joi.string(),
    metadata: Joi.string(),
    received_date: Joi.string().regex(isoDateRegex).allow(null),
    return_requirement: Joi.string(),
    under_query: Joi.boolean(),
    under_query_comment: Joi.string(),
    is_test: Joi.boolean()
  },
  preInsert
})

module.exports = returnsApi

module.exports.repo = returnsApi.repo
