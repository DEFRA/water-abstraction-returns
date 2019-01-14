const Joi = require('joi');
const controller = require('./controller');

module.exports = [
  {
    method: 'GET',
    handler: controller.getCompletedReturnsReport,
    path: '/returns/1.0/reports/completed-returns/{regime}/{licenceType}',
    options: {
      validate: {
        params: {
          regime: Joi.string().required(),
          licenceType: Joi.string().required()
        }
      }
    }
  }

];
