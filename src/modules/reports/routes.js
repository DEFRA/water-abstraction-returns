const controller = require('./controller');

module.exports = [
  {
    method: 'GET',
    handler: controller.createRouteHandler('completedReturns'),
    path: '/returns/1.0/reports/completed-returns'
  }

];
