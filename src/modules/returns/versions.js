const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');
const { pool } = require('../../lib/connectors/db');

const isoDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

const versionsApi = new HAPIRestAPI({
  table: 'returns.versions',
  primaryKey: 'version_id',
  endpoint: '/returns/1.0/versions',
  connection: pool,
  onCreateTimestamp: 'created_at',
  onUpdateTimestamp: 'updated_at',
  upsert: {
    fields: ['version_id'],
    set: ['return_id', 'user_id', 'user_type', 'version_number', 'metadata']
  },
  primaryKeyAuto: false,
  primaryKeyGuid: false,
  validation: {
    version_id: Joi.string(),
    return_id: Joi.string(),
    user_id: Joi.string(),
    user_type: Joi.string(),
    version_number: Joi.number(),
    metadata: Joi.string()
  },
  showSql: true
});

module.exports = versionsApi;
