'use-strict';
const repo = require('../../lib/repo/kpi-reporting');
const Boom = require('@hapi/boom');
const moment = require('moment');

const getReturnsKpiDataBySeason = async (request) => {
  const startDate = moment(request.query.startDate).format('YYYY-MM-DD');
  const endDate = moment(request.query.endDate).format('YYYY-MM-DD');
  const { isSummer } = request.query;

  const dataRows = await repo.findReturnsKpiDataBySeason(startDate, endDate, isSummer);
  if (dataRows.data.length < 1) {
    return Boom.notFound(`Returns KPI data by season not found for start date ${startDate}, ` +
    `end date ${endDate} and is summer flag ${isSummer}`);
  }
  return dataRows;
};
exports.getReturnsKpiDataBySeason = getReturnsKpiDataBySeason;
