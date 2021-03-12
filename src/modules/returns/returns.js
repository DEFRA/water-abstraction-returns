'use strict';

const { isObject } = require('lodash');
const HAPIRestAPI = require('@envage/hapi-pg-rest-api');
const Joi = require('@hapi/joi');
const { pool } = require('../../lib/connectors/db');
const returnCycleRepo = require('../../lib/repo/return-cycles');

const isoDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

/**
 * The preInsert hook allows the data to be modified prior to insert.
 * A return cycle record is upserted, and the return_cycle_id linked automatically.
 * This is to maintain backwards compatibility with the existing returns API
 *
 * @param {Object} data
 * @returns {Promise<Object>} data with return_cycle_id populated
 */
const preInsert = async data => {
  const { start_date: startDate, end_date: endDate, metadata } = data;

  // Parse isSummer flag from metadata
  const { isSummer } = isObject(metadata) ? metadata : JSON.parse(metadata);

  // Get/create return cycle for submitted return
  const cycle = await returnCycleRepo.getOrCreateReturnCycle(startDate, endDate, isSummer);

  return {
    ...data,
    return_cycle_id: cycle.return_cycle_id
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
    is_test: Joi.boolean().default(false)
  },
  preInsert
});

module.exports = returnsApi;

module.exports.repo = returnsApi.repo;
