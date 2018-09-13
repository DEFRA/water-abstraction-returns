const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');
const { pool } = require('../../lib/connectors/db');

const isoDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

const linesApi = new HAPIRestAPI({
  table: 'returns.lines',
  primaryKey: 'line_id',
  endpoint: '/returns/1.0/lines',
  connection: pool,
  onCreateTimestamp: 'created_at',
  onUpdateTimestamp: 'updated_at',
  upsert: {
    fields: ['version_id', 'substance', 'start_date', 'end_date'],
    set: ['quantity', 'unit', 'user_unit', 'time_period', 'metadata', 'reading_type']
  },
  primaryKeyAuto: false,
  primaryKeyGuid: false,
  validation: {
    line_id: Joi.string(),
    version_id: Joi.string(),
    substance: Joi.string(),
    quantity: Joi.number().allow(null),
    unit: Joi.string(),
    user_unit: Joi.string(),
    start_date: Joi.string().regex(isoDateRegex),
    end_date: Joi.string().regex(isoDateRegex),
    time_period: Joi.string().allow('day', 'week', 'month', 'year'),
    metadata: Joi.string(),
    reading_type: Joi.string().valid(['estimated', 'measured', 'assessed', 'derived'])
  },
  showSql: true
});

module.exports = linesApi;
