'use-strict';

const Joi = require('joi');

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

exports.getReturnCycle = {
  path: '/returns/1.0/return-cycles/{returnCycleId}',
  method: 'GET',
  handler: controller.getReturnCycle,
  config: {
    description: 'Gets a single return cycle by ID',
    validate: {
      params: Joi.object({
        returnCycleId: Joi.string().guid().required()
      })
    }
  }
};

exports.getReturnCycleReturns = {
  path: '/returns/1.0/return-cycles/{returnCycleId}/returns',
  method: 'GET',
  handler: controller.getReturnCycleReturns,
  config: {
    description: 'Gets a report of returns for the given cycle',
    validate: {
      params: Joi.object({
        returnCycleId: Joi.string().guid().required()
      })
    }
  }
};
