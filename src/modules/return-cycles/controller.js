'use strict';
const Boom = require('@hapi/boom');
const repo = require('../../lib/repo/return-cycles');

const camelCaseKeys = require('../../lib/camel-case-keys');

/**
 * Gets a list of return cycles with stats about returns in each cycle
 */
const getReturnCyclesReport = async (request) => {
  const { startDate } = request.query;

  const data = await repo.getReturnCycleStatsReport(startDate);

  return {
    data: data.map(camelCaseKeys)
  };
};

/**
 * Get a single return cycle by ID
 */
const getReturnCycle = async request => {
  const { returnCycleId } = request.params;

  const returnCycle = await repo.getReturnCycle(returnCycleId);

  return returnCycle
    ? camelCaseKeys(returnCycle)
    : Boom.notFound(`Return cycle ${returnCycleId} not found`);
};

/**
 * Get a single return cycle's returns by ID
 */
const getReturnCycleReturns = async request => {
  const { returnCycleId } = request.params;

  const returnCycle = await repo.getReturnCycleReturns(returnCycleId);

  return returnCycle
    ? camelCaseKeys(returnCycle)
    : Boom.notFound(`Return cycle ${returnCycleId} not found`);
};

exports.getReturnCyclesReport = getReturnCyclesReport;
exports.getReturnCycle = getReturnCycle;
exports.getReturnCycleReturns = getReturnCycleReturns;
