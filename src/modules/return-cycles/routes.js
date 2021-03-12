'use-strict';

const Joi = require('@hapi/joi');

const controller = require('./controller');

exports.getReturnCyclesReport = {
  path: '/returns/1.0/return-cycles/report',
  method: 'GET',
  handler: controller.getReturnCyclesReport,
  config: {
    description: 'Gets returns cycles statistics',
    validate: {
      query: Joi.object({
        startDate: Joi.string().isoDate().default('1900-01-01')
      })
    }
  }
};
