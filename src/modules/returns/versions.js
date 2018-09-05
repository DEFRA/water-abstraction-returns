const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');
const { pool } = require('../../lib/connectors/db');

const versionsApi = new HAPIRestAPI({
  table: 'returns.versions',
  primaryKey: 'version_id',
  endpoint: '/returns/1.0/versions',
  connection: pool,
  onCreateTimestamp: 'created_at',
  onUpdateTimestamp: 'updated_at',
  upsert: {
    fields: ['return_id', 'version_number'],
    set: ['user_id', 'user_type', 'metadata', 'nil_return']
  },
  primaryKeyAuto: false,
  primaryKeyGuid: false,
  validation: {
    version_id: Joi.string(),
    return_id: Joi.string(),
    user_id: Joi.string(),
    user_type: Joi.string(),
    version_number: Joi.number(),
    metadata: Joi.string(),
    nil_return: Joi.boolean()
  },
  showSql: true
});

module.exports = versionsApi;
