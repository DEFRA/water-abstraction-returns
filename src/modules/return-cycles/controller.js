'use strict';
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

exports.getReturnCyclesReport = getReturnCyclesReport;
