const builder = require('mongo-sql');
const { pool } = require('../../lib/connectors/db');
const reports = require('./lib/reports.js');
const { parseRequest } = require('./lib/request-parser');

/**
 * Creates a route handler for the given report type
 * @param  {String} reportType - the report type, available reports are in ./lib/reports
 * @return {Function}            HAPI route handler function
 */
const createRouteHandler = (reportType) => {
  /**
   * Gets requested report data and ouputs as JSON
   * @param {String} request.query.filter - JSON encoded filter object
   */
  return async (request, h) => {
    const { filter } = parseRequest(request);

    // Use mongo-sql library to build SQL statement
    const query = reports[reportType](filter);
    const sql = builder.sql(query);

    // Get data from DB
    const { rows: data, error = null } = await pool.query(sql.toString(), sql.values);
    return { data, error };
  };
};

module.exports = {
  createRouteHandler
};
