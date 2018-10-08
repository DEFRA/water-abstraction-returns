const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');
const { pool } = require('../../lib/connectors/db');

const isoDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

const returnsApi = new HAPIRestAPI({
  table: 'returns.returns',
  primaryKey: 'return_id',
  endpoint: '/returns/1.0/returns',
  connection: pool,
  onCreateTimestamp: 'created_at',
  onUpdateTimestamp: 'updated_at',
  upsert: {
    fields: ['regime', 'licence_type', 'licence_ref', 'start_date', 'end_date', 'return_requirement', 'due_date'],
    set: ['returns_frequency', 'status', 'source', 'metadata', 'received_date']
  },
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
    status: Joi.string().valid('due', 'received', 'completed'),
    source: Joi.string(),
    metadata: Joi.string(),
    received_date: Joi.string().regex(isoDateRegex).allow(null),
    return_requirement: Joi.string()
  },
  showSql: true
});

module.exports = returnsApi;

module.exports.repo = returnsApi.repo;
