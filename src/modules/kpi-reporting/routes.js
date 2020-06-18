'use-strict';
const controller = require('./controller');
const Joi = require('@hapi/joi');

const kpiReporting = [
  {
    path: '/returns/1.0/kpi/licencesBySeason',
    method: 'GET',
    handler: controller.getReturnsKpiDataBySeason,
    config: {
      description: 'Gets returns data for KPI reporting',
      validate: {
        query: {
          startDate: Joi.date().required(),
          endDate: Joi.date().min(Joi.ref('startDate')).required(),
          isSummer: Joi.boolean().required()
        }
      }
    }
  }
];

module.exports = kpiReporting;
