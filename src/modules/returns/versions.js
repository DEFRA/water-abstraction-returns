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
  primaryKeyAuto: false,
  primaryKeyGuid: false,
  validation: {
    version_id: Joi.string(),
    return_id: Joi.string(),
    user_id: Joi.string(),
    user_type: Joi.string(),
    version_number: Joi.number(),
    metadata: Joi.string(),
    nil_return: Joi.boolean(),
    current: Joi.boolean()
  },
  showSql: true,
  preInsert: async (data) => {
    // If current flag is true in submitted data, update other return versions
    // so that they are no longer current
    if (data.current) {
      const query = `UPDATE returns.versions SET current=false WHERE return_id=$1`;
      const params = [data.return_id];
      await pool.query(query, params);
    }
    return data;
  }
});

module.exports = versionsApi;
