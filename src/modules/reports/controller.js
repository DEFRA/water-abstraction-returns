const builder = require('mongo-sql');
const reports = require('./reports.js');
const { pool } = require('../../lib/connectors/db');

const createRouteHandler = (reportType) => {
  return async (request, h) => {
    const filter = JSON.parse(request.query.filter || '{}');
    const query = reports[reportType](filter);
    const sql = builder.sql(query);
    const { rows: data, error = null } = await pool.query(sql.toString(), sql.values);
    return { data, error };
  };
};

module.exports = {
  createRouteHandler
};
