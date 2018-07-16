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
    fields: ['return_id'],
    set: ['regime', 'licence_type', 'licence_ref', 'start_date', 'end_date', 'returns_frequency', 'status', 'source', 'metadata']
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
    returns_frequency: Joi.string().allow('annual', 'monthly', 'weekly', 'daily'),
    status: Joi.string().allow('pending', 'received', 'complete'),
    source: Joi.string(),
    metadata: Joi.string()
  },
  showSql: true
});

module.exports = returnsApi;
