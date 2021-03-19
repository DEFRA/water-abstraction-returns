'use strict';

const Joi = require('@hapi/joi');
const { isObject } = require('lodash');
const moment = require('moment-range').extendMoment(require('moment'));

const HAPIRestAPI = require('@envage/hapi-pg-rest-api');
const helpers = require('@envage/water-abstraction-helpers');

const { pool } = require('../../lib/connectors/db');
const returnCycleRepo = require('../../lib/repo/return-cycles');

const isoDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

const returnCycles = helpers.returns.date.createReturnCycles('2008-04-01', '2109-03-31');

/**
 * Returns the correct full return cycle given the return start/end dates and season
 * @param {String} startDate - could be after cycle start date for split logs
 * @param {String} endDate - could be before cycle end date for split logs
 * @param {Boolean} isSummer
 * @returns {Object} return cycle
 */
const getCycle = (startDate, isSummer) => returnCycles
  .filter(cycle => cycle.isSummer === isSummer)
  .find(cycle => moment.range(cycle.startDate, cycle.endDate).contains(moment(startDate)));

/**
 * The preInsert hook allows the data to be modified prior to insert.
 * A return cycle record is upserted, and the return_cycle_id linked automatically.
 * This is to maintain backwards compatibility with the existing returns API
 *
 * @param {Object} data
 * @returns {Promise<Object>} data with return_cycle_id populated
 */
const preInsert = async data => {
  const { start_date: startDate, metadata } = data;

  // Parse isSummer flag from metadata
  const { isSummer } = isObject(metadata) ? metadata : JSON.parse(metadata);

  // Find matching return cycle
  const cycle = getCycle(startDate, isSummer);

  // Get/create return cycle for submitted return
  const { return_cycle_id: returnCycleId } = await returnCycleRepo.getOrCreateReturnCycle(cycle.startDate, cycle.endDate, isSummer);

  return {
    ...data,
    return_cycle_id: returnCycleId
  };
};

const returnsApi = new HAPIRestAPI({
  table: 'returns.returns',
  primaryKey: 'return_id',
  endpoint: '/returns/1.0/returns',
  connection: pool,
  onCreateTimestamp: 'created_at',
  onUpdateTimestamp: 'updated_at',
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
    status: Joi.string().valid('due', 'received', 'completed', 'void'),
    source: Joi.string(),
    metadata: Joi.string(),
    received_date: Joi.string().regex(isoDateRegex).allow(null),
    return_requirement: Joi.string(),
    under_query: Joi.boolean(),
    under_query_comment: Joi.string(),
    is_test: Joi.boolean()
  },
  preInsert
});

module.exports = returnsApi;

module.exports.repo = returnsApi.repo;
