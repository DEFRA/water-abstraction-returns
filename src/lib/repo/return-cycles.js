'use strict';

const { pool } = require('../connectors/db');

const queries = require('./queries/return-cycles');

const getReturnCycleStatsReport = async startDate => {
  const { rows } = await pool.query(queries.returnCycleStatsReport, [startDate]);
  return rows;
};

/**
 * Upserts returns.return_cycles to either get or create a return cycle
 * for the supplied dates and return season
 *
 * The due date is automatically set 28 days after the cycle end date
 *
 * @param {String} startDate - YYYY-MM-DD
 * @param {String} endDate - YYYY-MM-DD
 * @param {Boolean} isSummer
 * @returns {Promise<Object>} resolves with the row created/fetched
 */
const getOrCreateReturnCycle = async (startDate, endDate, isSummer) => {
  const { rows: [row] } = await pool.query(queries.upsert, [startDate, endDate, isSummer]);
  return row;
};

/**
 * Gets return cycle by ID
 *
 * @param {String} id - return cycle ID
 * @returns {Promise<Object>}
 */
const getReturnCycle = async id => {
  const { rows: [row] } = await pool.query(queries.getReturnCycle, [id]);
  return row;
};

/**
 * Gets a report of returns for a given cycle
 *
 * @param {String} id - return cycle ID
 * @returns {Promise<Array>}
 */
const getReturnCycleReturns = async id => {
  const { rows } = await pool.query(queries.getReturnCycleReturns, [id]);
  return rows;
};

exports.getReturnCycleStatsReport = getReturnCycleStatsReport;
exports.getOrCreateReturnCycle = getOrCreateReturnCycle;
exports.getReturnCycle = getReturnCycle;
exports.getReturnCycleReturns = getReturnCycleReturns;
