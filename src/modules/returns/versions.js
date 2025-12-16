const HAPIRestAPI = require('@envage/hapi-pg-rest-api')
const Joi = require('joi')
const { pool } = require('../../lib/connectors/db')

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
  preInsert: async (data) => {
    // If current flag is true in submitted data, update other return versions
    // so that they are no longer current
    if (data.current) {
      const query = `
        update returns.versions
        set current=false
        where return_id=$1
        and version_number < $2;`

      const params = [data.return_id, data.version_number]
      await pool.query(query, params)
    }

    // Add the new return.id to the version as return_log_id foreign key
    if (data.return_id) {
      const query = `
        select id
        from returns.returns
        where return_id=$1;`

      const params = [data.return_id]
      const { rows: [{ id }] } = await pool.query(query, params)

      return {
        ...data,
        return_log_id: id
      }
    }

    return data
  }
})

module.exports = versionsApi
