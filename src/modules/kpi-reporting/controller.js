'use-strict';
const repo = require('../../lib/repo/kpi-reporting');
const Boom = require('@hapi/boom');
const moment = require('moment');
const { camelCase } = require('lodash');
const deepMapKeys = require('deep-map-keys');

/**
 * Camel cases the keys of an object, or an array of objects.
 * @param {Array|Object} data The array of objects, or object that is to
 * have it's keys camel cased
 */
const camelCaseKeys = data => {
  return deepMapKeys(data, camelCase);
};

const getReturnsKpiDataBySeason = async (request) => {
  const startDate = moment(request.query.startDate).format('YYYY-MM-DD');
  const endDate = moment(request.query.endDate).format('YYYY-MM-DD');
  const { isSummer } = request.query;

  const { data } = await repo.findReturnsKpiDataBySeason(startDate, endDate, isSummer);
  if (data.length < 1) {
    return Boom.notFound(`Returns KPI data by season not found for start date ${startDate}, ` +
    `end date ${endDate} and is summer flag ${isSummer}`);
  }
  const returnData = camelCaseKeys(data);

  return { data: returnData };
};
exports.getReturnsKpiDataBySeason = getReturnsKpiDataBySeason;
