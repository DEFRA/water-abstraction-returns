'use strict';

const { isObject, get } = require('lodash');
const helpers = require('@envage/water-abstraction-helpers');

const returnCycleRepo = require('../../../lib/repo/return-cycles');

/**
 * Returns the correct full return cycle given the return start/end dates and season
 * @param {String} startDate - could be after cycle start date for split logs
 * @param {String} endDate - could be before cycle end date for split logs
 * @param {Boolean} isSummer
 * @returns {Object} return cycle
 */
const getCycle = (startDate, isSummer) => ({
  startDate: helpers.returns.date.getPeriodStart(startDate, isSummer),
  endDate: helpers.returns.date.getPeriodEnd(startDate, isSummer),
  isSummer
});

/**
 * The preInsert hook allows the data to be modified prior to insert.
 * A return cycle record is upserted, and the return_cycle_id linked automatically.
 * This is to maintain backwards compatibility with the existing returns API
 *
 * @param {Object} data
 * @returns {Promise<Object>} data with return_cycle_id populated
 */
const preInsert = async data => {
  // Parse isSummer flag from metadata
  const metadata = isObject(data.metadata) ? data.metadata : JSON.parse(data.metadata);
  const isSummer = get(metadata, 'isSummer', false);

  // Find matching return cycle
  const cycle = getCycle(data.start_date, isSummer);

  // Get/create return cycle for submitted return
  const result = await returnCycleRepo.getOrCreateReturnCycle(cycle);

  return {
    ...data,
    return_cycle_id: get(result, 'return_cycle_id', null)
  };
};

exports.preInsert = preInsert;
